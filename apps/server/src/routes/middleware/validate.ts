import {
	bad_request,
	err,
	internal,
	ok,
	Result,
	ServerError
} from "@pledgeo/models";
import { tryit } from "radash";
import { ZodType } from "zod";
import { AppContext } from "../../app/context";

export function validate<T, U, Ctx extends AppContext>(
	schema: ZodType<T>,
	parser: (ctx: Ctx) => T,
	handler: (ctx: Ctx, args: T) => Promise<Result<U, ServerError>>
): (ctx: Ctx) => Promise<Result<U, ServerError>> {
	return async (ctx: Ctx) => {
		const args = parser(ctx);
		const validated = await schema.safeParseAsync(args);
		if (validated.success) {
			const [error, result] = await tryit(handler)(ctx, args);
			if (error) {
				if (error instanceof ServerError) {
					return err(internal(error.message, error.metadata));
				} else {
					return err(internal("Internal server error"));
				}
			} else if (result.error) {
				return err(result.error);
			} else {
				return ok(result.value);
			}
		} else {
			const errors: Record<string, string> = {};
			const field_errors = validated.error.flatten().fieldErrors;
			for (const key of Object.keys(field_errors)) {
				const field = field_errors[key as keyof typeof field_errors];
				if (field && field?.length > 0) {
					errors[key] = field[0];
				}
			}

			return err(bad_request("Validation failed", errors));
		}
	};
}
