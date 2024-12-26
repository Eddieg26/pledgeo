import { Router } from "../route";
import auth from "./auth";

const v1 = new Router("v1").sub(auth);

export default v1;
