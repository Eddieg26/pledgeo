import {
  Email,
  EmailSchema,
  Password,
  PasswordSchema,
  Result,
  ServerError,
  Session,
} from "models";
import factory, { err, internal, ok, unauthorized } from "models/src/factory";
import { object } from "zod";
import { AppContext } from "../../../app/context";
import { validate } from "../../middleware";
import { post } from "../../route";

type SigninArgs = {
  email: Email;
  password: Password;
};

const schema = object({
  email: EmailSchema,
  password: PasswordSchema,
});

function parser(ctx: AppContext) {
  const body = ctx.request.body as any;
  const email = factory.email((body?.email as string) ?? "");
  const password = factory.password((body?.password as string) ?? "");
  return { email, password };
}

export async function signin(
  ctx: AppContext,
  args: SigninArgs
): Promise<Result<Session, ServerError>> {
  const { auth, database } = ctx.services;

  const user = await database.users().get({ right: args.email });
  if (!user) return err(unauthorized("Invalid email or password"));

  let session = await auth.get_session(ctx);
  if (!session) session = await auth.create_session(ctx, user);
  else {
    const result = auth.validate_session(session);
    if (result.error) return err(unauthorized(result.error));

    if (!result.value) {
      await database.sessions().delete({ right: session.token });
      session = await auth.create_session(ctx, user);
    }
  }

  if (session) {
    const password = await database.passwords().get(user.id);
    if (!password) return err(unauthorized("Invalid email or password"));
    if (await auth.compare_password(args.password, password)) {
      await database.sessions().update(session.id, 0);
      return ok(session);
    } else {
      await database.sessions().update(session.id, session.attempts + 1);
      return err(unauthorized("Invalid email or password"));
    }
  } else {
    return err(internal("Session not created"));
  }
}

export default post("signin", validate(schema, parser, signin));
