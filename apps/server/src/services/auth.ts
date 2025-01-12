import {
	factory,
	Id,
	Nullable,
	Password,
	Session,
	User,
} from "@pledgeo/models";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { AppContext } from "../app/context";

export class Auth {
	hash_password(password: Password, salt: number): Promise<string> {
		return bcrypt.hash(password, salt);
	}

	compare_password(password: Password, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}

	async get_session(ctx: AppContext): Promise<Nullable<Session>> {
		try {
			const token = ctx.cookies.get("session");
			if (!token) return null;

			const { secret } = ctx.state.config;
			const session_id = jwt.verify(token, secret) as Id;
			const session = await ctx.services.cache.get<Session>(
				`session:${session_id}`
			);
			return session;
		} catch (error) {
			await this.delete_session(ctx);
			return null;
		}
	}

	async create_session(ctx: AppContext, user: User): Promise<Session> {
		const expires = dayjs().add(30, "day").toDate();
		const session = {
			id: factory.id(uuid()),
			user: user.id,
			expires,
		};

		const token = jwt.sign(session.id, ctx.state.config.secret, {
			expiresIn: "30d",
		});

		await ctx.services.cache.set(
			`session:${session.id}`,
			session,
			30 * 24 * 60 * 60
		);

		const sessions =
			(await ctx.services.cache.get<string[]>(`sessions:${user.id}`)) ??
			[];

		sessions.push(session.id);

		await ctx.services.cache.set(
			`sessions:${user.id}`,
			sessions,
			30 * 24 * 60 * 60
		);

		ctx.cookies.set("session", token, {
			secure: ctx.state.config.env === "production",
			expires,
		});

		return session;
	}

	async delete_session(ctx: AppContext) {
		try {
			const session = await this.get_session(ctx);
			if (!session) return true;

			await ctx.services.cache.delete(`session:${session.id}`);
			ctx.cookies.set("session", "", { expires: new Date() });

			let sessions =
				(await ctx.services.cache.get<string[]>(
					`sessions:${session.user}`
				)) ?? [];

			sessions = sessions.filter((id) => id !== session.id);

			await ctx.services.cache.set(
				`sessions:${session.user}`,
				sessions,
				30 * 24 * 60 * 60
			);

			return true;
		} catch (error) {
			return false;
		}
	}
}
