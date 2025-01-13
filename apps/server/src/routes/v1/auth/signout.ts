import { ok, Result, ServerError } from "@pledgeo/models";
import { AuthContext } from "../../../app";
import { authenticate } from "../../middleware";
import { del } from "../../middleware/route";

export async function signout(
	ctx: AuthContext
): Promise<Result<boolean, ServerError>> {
	const result = await ctx.services.auth.delete_session(ctx);
	return ok(result);
}

export default del("/signout", authenticate(signout));
