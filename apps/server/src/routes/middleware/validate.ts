import { err, ok, Result, ServerError, StatusCode } from "models";
import { tryit } from "radash";
import { Schema } from "zod";
import { AppContext } from "../../app/context";

export function validate<T, U>(
  schema: Schema<T>,
  parser: (ctx: AppContext) => T,
  handler: (ctx: AppContext, args: T) => Promise<Result<U, ServerError>>
): (ctx: AppContext) => Promise<Result<U, ServerError>> {
  return async (ctx: AppContext) => {
    const args = parser(ctx);
    const validated = await schema.safeParseAsync(args);
    if (validated.success) {
      const [error, result] = await tryit(handler)(ctx, args);
      if (error) {
        if (error instanceof ServerError) {
          return err(
            new ServerError(error.status, error.message, error.metadata)
          );
        } else {
          return err(
            new ServerError(StatusCode.SERVER_ERROR, "Internal server error")
          );
        }
      } else if (result.error) {
        return err(result.error);
      } else {
        return ok(result.value);
      }
    } else {
      return err(
        new ServerError(StatusCode.BAD_REQUEST, "Validation failed", {
          message: validated.error.message,
          data: validated.error.flatten(),
        })
      );
    }
  };
}
