export type Environment = "development" | "production" | "test";

export class Config {
  port: number;
  db_url: string;
  secret: string;
  salt: number;
  env: Environment;

  constructor() {
    this.port = parseInt(process.env.PORT ?? "3000");
    this.db_url = process.env.DB_URL ?? "";
    this.secret = process.env.SECRET ?? "";
    this.salt = parseInt(process.env.SALT ?? "10");
    this.env = process.env.NODE_ENV as Environment as Environment;
  }
}
