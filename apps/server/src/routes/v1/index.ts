import { Router } from "../middleware/route";
import auth from "./auth";

export default new Router("/v1").sub(auth);
