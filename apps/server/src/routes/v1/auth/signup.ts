import {
	Email,
	EmailSchema,
	err,
	factory,
	internal,
	NameSchema,
	ok,
	Password,
	PasswordSchema,
	Result,
	right,
	ServerError,
	unauthorized,
	User,
} from "@pledgeo/models";
import { tryit } from "radash";
import { object } from "zod";
import { AppContext } from "../../../app/context";
import { validate } from "../../middleware";
import { post } from "../../middleware/route";

export async function signup(
	ctx: AppContext,
	args: SignupArgs
): Promise<Result<User, ServerError>> {
	const { auth, database } = ctx.services;

	if (await database.users().get(right(args.email)))
		return err(unauthorized("Email already in use"));

	const password = (await auth.hash_password(
		args.password,
		ctx.state.config.salt
	)) as Password;

	const user = await database.users().create(args.email, args.name);

	const [error] = await tryit(database.passwords().create)(user.id, password);
	if (error) {
		await database.users().delete(user.id);
		return err(internal("Failed to sign up", { message: error.message }));
	}

	return ok(user);
}

function parser(ctx: AppContext) {
	const body = ctx.request.body as any;
	const email = factory.email(body?.email as string);
	const password = factory.password(body?.password as string);
	const name = body?.name as string;
	return { email, password, name };
}

type SignupArgs = {
	email: Email;
	password: Password;
	name: string;
};

const schema = object({
	email: EmailSchema,
	password: PasswordSchema,
	name: NameSchema,
});

export default post("/signup", validate(schema, parser, signup));
