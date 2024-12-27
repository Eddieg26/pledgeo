import bcrypt from "bcrypt";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import {
  err,
  factory,
  Id,
  Nullable,
  ok,
  Password,
  Result,
  Session,
  Token,
  User,
} from "models";
import { v4 as uuid } from "uuid";
import { AppContext } from "../app/context";

export interface AuthService {
  hash_password(password: Password, salt: number): Promise<string>;
  compare_password(password: Password, hash: string): Promise<boolean>;
  get_token(ctx: AppContext): Nullable<Token>;
  get_session(ctx: AppContext): Promise<Nullable<Session>>;
  validate_token(ctx: AppContext, token: Token): Result<Id, string>;
  validate_session(session: Session): Result<boolean, string>;
  create_session(ctx: AppContext, user: User): Promise<Session>;
}

export class Auth implements AuthService {
  hash_password(password: Password, salt: number): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  compare_password(password: Password, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  get_token(ctx: AppContext): Nullable<Token> {
    const raw_token = ctx.cookies.get("session");
    if (!raw_token) return null;

    const token = factory.token(raw_token);
    return token;
  }

  validate_token(ctx: AppContext, token: Token): Result<Id, string> {
    try {
      const user = jwt.verify(token, ctx.state.config.secret) as Id;
      return ok(user);
    } catch (error: any) {
      return err(error.message);
    }
  }

  validate_session(session: Session): Result<boolean, string> {
    if (session.expires < new Date()) return ok(false);
    if (session.attempts >= 5) {
      const expires = dayjs(session.expires).format("YYYY-MM-DD HH:mm:ss");
      return err(`Too many attempts. Sign in locked until ${expires}`);
    }

    return ok(true);
  }

  async get_session(ctx: AppContext): Promise<Nullable<Session>> {
    const token = this.get_token(ctx);
    if (!token) return null;

    const user = this.validate_token(ctx, token);
    if (user.error) {
      ctx.cookies.set("session", "", { expires: new Date(0) });
      return null;
    }

    return await ctx.services.database.sessions().get({ right: token });
  }

  async create_session(ctx: AppContext, user: User): Promise<Session> {
    const expires = dayjs().add(30, "day").toDate();
    const token = jwt.sign(user.id, ctx.state.config.secret, {
      expiresIn: "30d",
    });

    ctx.cookies.set("session", token, {
      secure: ctx.state.config.env === "production",
      expires,
    });

    const session = {
      id: factory.id(uuid()),
      token: factory.token(token),
      user: user.id,
      expires,
      attempts: 0,
    };

    return await ctx.services.database.sessions().insert(session);
  }
}
