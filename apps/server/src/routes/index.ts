import health from "./health";
import { Router } from "./middleware/route";
import v1 from "./v1";

export default new Router().sub(health).sub(v1);
