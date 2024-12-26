import Koa from "koa";
import { Nullable, Session, User } from "models";
import { Config } from "../config";
import { Services } from "../services";

export type AppState<AUTH extends boolean = false> = {
  user: AUTH extends true ? User : Nullable<User>;
  session: AUTH extends true ? Session : Nullable<Session>;
  config: Config;
} & Koa.DefaultState;

export type AppContext<AUTH extends boolean = false> = Koa.ParameterizedContext<
  AppState<AUTH>,
  {
    services: Services;
  } & Koa.DefaultContext
>;
