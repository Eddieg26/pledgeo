import { err, left, Result, ServerError, unauthorized } from "@pledgeo/models";
import { AppContext } from "../../app/context";

export function authenticate<U, Ctx extends AppContext>(
	route: (ctx: Ctx) => Promise<Result<U, ServerError>>
) {
	return async (ctx: Ctx) => {
		const { auth, database } = ctx.services;

		const session = await auth.get_session(ctx);
		if (!session) return err(unauthorized("Unauthorized"));

		if (session.expires < new Date()) {
			await auth.delete_session(ctx);
			return err(unauthorized("Session expired"));
		}

		const user = await database.users().get(left(session.user));
		if (!user) return err(unauthorized("Unauthorized"));

		ctx.state.session = session;
		ctx.state.user = user;

		return await route(ctx);
	};
}
