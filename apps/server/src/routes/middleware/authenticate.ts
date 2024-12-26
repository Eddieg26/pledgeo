import { Result, ServerError, StatusCode } from "models";
import { AppContext } from "../../app/context";

export function authenticate<U>(
  route: (ctx: AppContext) => Promise<Result<U, ServerError>>
) {
  return async (ctx: AppContext) => {
    const { auth, database } = ctx.services;

    const session = await auth.get_session(ctx);
    if (!session)
      return new ServerError(StatusCode.UNAUTHORIZED, "Unauthorized");

    const user = await database.users().get({ left: session.user });
    if (!user) return new ServerError(StatusCode.UNAUTHORIZED, "Unauthorized");

    ctx.state.session = session;
    ctx.state.user = user;

    return await route(ctx);
  };
}
