export type Environment = "development" | "production" | "test";

export class Config {
	port: number;
	db_url: string;
	secret: string;
	salt: number;
	env: Environment;
	cache: {
		host: string;
		port: number;
	};

	constructor() {
		this.port = parseInt(process.env.PORT ?? "3000");
		this.secret = process.env.SECRET ?? "";
		this.salt = parseInt(process.env.SALT ?? "10");
		this.env =
			(process.env.NODE_ENV as Environment as Environment) ??
			"development";

		const db_host = process.env.DB_HOST ?? "";
		const db_port = parseInt(process.env.DB_PORT ?? "");
		const db_user = process.env.DB_USER ?? "";
		const db_password = process.env.DB_PASSWORD ?? "";
		const db_name = process.env.DB_NAME ?? "";

		this.db_url = `postgres://${encodeURIComponent(db_user)}:${encodeURIComponent(db_password)}@${db_host}:${db_port}/${encodeURIComponent(db_name)}`;
		this.cache = {
			host: process.env.CACHE_HOST ?? "",
			port: parseInt(process.env.CACHE_PORT ?? "6379"),
		};
	}
}
