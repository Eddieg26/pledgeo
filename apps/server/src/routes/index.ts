import { Router } from "./route";
import v1 from "./v1";

const routes = new Router().sub(v1);

export default routes;
