import { AppContext } from "../../app/context";

export function notFound(ctx: AppContext) {
  ctx.throw(404, "Route Not Found");
}
