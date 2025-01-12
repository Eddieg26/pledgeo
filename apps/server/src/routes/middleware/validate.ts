import { err, ok, Result, ServerError, StatusCode } from "@pledgeo/models";
import { tryit } from "radash";
import { ZodType } from "zod";
import { AppContext } from "../../app/context";

export function validate<T, U, AUTH extends boolean>(
  schema: ZodType<T>,
  parser: (ctx: AppContext<AUTH>) => T,
  handler: (ctx: AppContext<AUTH>, args: T) => Promise<Result<U, ServerError>>
): (ctx: AppContext<AUTH>) => Promise<Result<U, ServerError>> {
  return async (ctx: AppContext<AUTH>) => {
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
