import { Nullable, Session, User } from "@pledgeo/models";
import { ParameterizedContext } from "koa";
import { Config } from "../config";
import { Services } from "../services";

export type AppState<AUTH extends boolean = false> = {
	user: AUTH extends true ? User : Nullable<User>;
	session: AUTH extends true ? Session : Nullable<Session>;
	config: Config;
};

export type AuthContext = ParameterizedContext<
	AppState<true>,
	{ services: Services; params: any }
>;
export type UnauthContext = ParameterizedContext<
	AppState<false>,
	{ services: Services; params: any }
>;
export type AppContext = AuthContext | UnauthContext;
