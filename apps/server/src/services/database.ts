import {
	factory,
	right,
	type Either,
	type Email,
	type Id,
	type Nullable,
	type Password,
	type User,
} from "@pledgeo/models";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Config } from "../config";

export interface UserRepo {
	get(value: Either<Id, Email>): Promise<Nullable<User>>;
	create(email: Email, name: string): Promise<User>;
	update(
		email: Email,
		values: Partial<{ password: string; name: string }>
	): Promise<Nullable<User>>;
	delete(id: Id): Promise<Nullable<User>>;
}

export interface PasswordRepo {
	get(user: Id): Promise<Nullable<Password>>;
	create(user: Id, password: Password): Promise<Password>;
	update(user: Id, password: Password): Promise<Nullable<Password>>;
	delete(user: Id): Promise<Nullable<Password>>;
}

export interface Database {
	connect(): Promise<void>;
	disconnect(): Promise<void>;

	users(): UserRepo;
	passwords(): PasswordRepo;
}

type Drizzle = ReturnType<typeof drizzle>;

function Users(db: Drizzle) {
	const users = pgTable("users", {
		id: uuid().primaryKey().generatedAlwaysAs("gen_random_uuid()"),
		email: uuid().notNull().unique(),
		name: uuid().notNull(),
	});

	return {
		async get(value: Either<Id, Email>): Promise<Nullable<User>> {
			const filter =
				value.__type === "left"
					? eq(users.id, value.left)
					: eq(users.email, value.right);
			const result = await db.select().from(users).where(filter);

			const user = result[0];
			if (!user) return null;

			return factory.user(user.id, user.email, user.name);
		},

		async create(email: Email, name: string): Promise<User> {
			const user = (
				await db.insert(users).values({ email, name }).returning()
			)[0];
			if (!user) throw new Error("Failed to create user.");

			return factory.user(user.id, user.email, user.name);
		},

		async update(
			email: Email,
			values: Partial<{ name: string }>
		): Promise<Nullable<User>> {
			let user = await this.get(right(email));
			if (!user) return null;

			if (values.name) {
				const results = await db
					.update(users)
					.set({ name: values.name })
					.where(eq(users.id, user.id))
					.returning();
				user.name = results[0].name;
			}

			return user;
		},

		async delete(id: Id): Promise<Nullable<User>> {
			return await db
				.delete(users)
				.where(eq(users.id, id))
				.returning()
				.then((result) => {
					const user = result[0];
					return user
						? factory.user(user.id, user.email, user.name)
						: null;
				});
		},
	};
}

function Passwords(db: Drizzle) {
	const table = pgTable("passwords", {
		id: uuid().primaryKey().generatedAlwaysAs("gen_random_uuid()"),
		user: uuid().notNull(),
		password: text().notNull(),
	});

	return {
		async get(user: Id): Promise<Nullable<Password>> {
			const result = await db
				.selectDistinct()
				.from(table)
				.where(eq(table.user, user));

			return (result[0]?.password as Password) ?? null;
		},

		async create(user: Id, password: Password): Promise<Password> {
			await db.insert(table).values({ user: user, password });
			return password;
		},

		async update(
			user: Id,
			password: Password
		): Promise<Nullable<Password>> {
			await db
				.update(table)
				.set({ password })
				.where(eq(table.user, user));

			return password;
		},

		async delete(user: Id): Promise<Nullable<Password>> {
			const result = await db
				.delete(table)
				.where(eq(table.user, user))
				.returning();

			return (result[0]?.password as Password) ?? null;
		},
	};
}

export class DrizzleDb implements Database {
	db: Drizzle;
	_users: UserRepo;
	_passwords: PasswordRepo;

	constructor(config: Config) {
		this.db = drizzle(config.db_url);
		this._users = Users(this.db);
		this._passwords = Passwords(this.db);
	}

	users(): UserRepo {
		return this._users;
	}

	passwords(): PasswordRepo {
		return this._passwords;
	}

	async connect(): Promise<void> {}
	async disconnect(): Promise<void> {}
}
