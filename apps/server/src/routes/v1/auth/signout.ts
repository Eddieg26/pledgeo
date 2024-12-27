import {
  err,
  factory,
  Id,
  IdSchema,
  ok,
  Result,
  ServerError,
  unauthorized,
} from "models";
import { AppContext } from "../../../app/context";
import { validate } from "../../middleware";
import { del } from "../../route";

export async function signout(
  ctx: AppContext<true>,
  id: Id
): Promise<Result<boolean, ServerError>> {
  const { database } = ctx.services;
  const session = await database.sessions().get({ left: id });
  if (!session) return ok(true);

  if (session.user !== ctx.state.user.id)
    return err(unauthorized("Invalid session"));

  await database.sessions().delete({ left: id });
  return ok(true);
}

function parser(ctx: AppContext<true>): Id {
  return factory.id(ctx.query.id as string);
}

export default del("signout/:id", validate(IdSchema, parser, signout));
