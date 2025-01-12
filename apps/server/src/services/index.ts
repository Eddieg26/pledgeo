import { Auth } from "./auth";
import { Cache } from "./cache";
import { Database } from "./database";

export interface Services {
  auth: Auth;
  database: Database;
  cache: Cache;
}
