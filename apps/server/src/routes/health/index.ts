import { ok, Result, ServerError } from "@pledgeo/models";
import { get, Router } from "../route";

async function health_check(): Promise<
	Result<{ status: string }, ServerError>
> {
	return ok({ status: "Server is running" });
}

export default new Router("/health").add(get("/", health_check));
