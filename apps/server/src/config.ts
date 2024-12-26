export type Environment = "development" | "production" | "test";

export type Config = {
  db_url: string;
  secret: string;
  salt: number;
  env: Environment;
};
