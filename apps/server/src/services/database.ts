import type {
    Campaign,
    Either,
    Email,
    Id,
    Nullable,
    Pager,
    Password,
    User
} from "@pledgeo/models";
import { Config } from "../config";

export interface UserRepo {
	get(value: Either<Id, Email>): Promise<Nullable<User>>;
	create(email: Email, password: string, name: string): Promise<User>;
	update(email: Email, password: string): Promise<Nullable<User>>;
	delete(id: Id): Promise<Nullable<User>>;
}

export interface CampaignRepo {
	get_many(user: Id, page?: number, limit?: number): Promise<Pager<Campaign>>;
	get(id: Id): Promise<Nullable<Campaign>>;
	create(user: Id, name: string): Promise<Campaign>;
	update(id: Id, name: string): Promise<Nullable<Campaign>>;
	delete(id: Id): Promise<Nullable<Campaign>>;
}

export interface PasswordRepo {
	get(user: Id): Promise<Nullable<Password>>;
	create(user: Id, password: Password): Promise<Password>;
	update(user: Id, password: Password): Promise<Nullable<Password>>;
	delete(user: Id): Promise<Nullable<Password>>;
}

export interface Database {
	create(config: Config): Database;
	connect(): Promise<void>;
	disconnect(): Promise<void>;

	users(): UserRepo;
	campaigns(): CampaignRepo;
	passwords(): PasswordRepo;
}

export class PgDatabase implements Database {
	async connect(): Promise<void> {}
	async disconnect(): Promise<void> {}

	create(config: Config): Database {
		return new PgDatabase();
	}

	users(): UserRepo {
		throw new Error("Method not implemented.");
	}
	campaigns(): CampaignRepo {
		throw new Error("Method not implemented.");
	}
	passwords(): PasswordRepo {
		throw new Error("Method not implemented.");
	}
}
