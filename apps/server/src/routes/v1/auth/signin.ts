import {
	Email,
	EmailSchema,
	err,
	factory,
	internal,
	ok,
	Password,
	PasswordSchema,
	Result,
	right,
	ServerError,
	Session,
	unauthorized,
} from "@pledgeo/models";
import { tryit } from "radash";
import { object } from "zod";
import { AppContext } from "../../../app/context";
import { validate } from "../../middleware";
import { post } from "../../middleware/route";

type SigninArgs = {
	email: Email;
	password: Password;
};

const schema = object({
	email: EmailSchema,
	password: PasswordSchema,
});

function parser(ctx: AppContext) {
	const body = ctx.request.body as any;
	const email = factory.email((body?.email as string) ?? "");
	const password = factory.password((body?.password as string) ?? "");
	return { email, password };
}

export async function signin(
	ctx: AppContext,
	args: SigninArgs
): Promise<Result<Session, ServerError>> {
	const { auth, database } = ctx.services;

	const user = await database.users().get(right(args.email));
	if (!user) return err(unauthorized("Invalid email or password"));

	const password = await database.passwords().get(user.id);
	if (!password) return err(unauthorized("Invalid email or password"));

	if (!(await auth.compare_password(args.password, password)))
		return err(unauthorized("Invalid email or password"));

	const [error, session] = await tryit(auth.create_session)(ctx, user);

	if (error) return err(internal(error.message));
	else return ok(session);
}

export default post("/signin", validate(schema, parser, signin));
