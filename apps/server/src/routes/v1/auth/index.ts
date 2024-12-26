import { Router } from "../../route";
import signin from "./signin";
import signout from "./signout";
import signup from "./signup";

const auth = new Router("auth").add(signup).add(signin).add(signout);

export default auth;
