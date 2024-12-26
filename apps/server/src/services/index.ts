import { AuthService } from "./auth";
import { DatabaseService } from "./database";

export interface Services {
  auth: AuthService;
  database: DatabaseService;
}
