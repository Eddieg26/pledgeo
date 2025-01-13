import { Router } from "../../middleware/route";
import signin from "./signin";
import signout from "./signout";
import signup from "./signup";

export default new Router("/auth").add(signup).add(signin).add(signout);
