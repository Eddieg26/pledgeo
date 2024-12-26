import Koa from "koa";
import { Config } from "../config";
import routes from "../routes";
import { bodyParser, notFound } from "../routes/middleware";
import { Services } from "../services";
import { AppContext, AppState } from "./context";

export class App {
  config: Config;
  services: Services;
  private server: Koa<AppState, AppContext>;

  constructor(config: Config, services: Services) {
    this.config = config;
    this.services = services;
    this.server = new Koa();
    this.server.use(async (ctx, next) => {
      ctx.services = this.services;
      ctx.state.config = this.config;

      await next();
    });

    this.server.use(bodyParser());
    this.server.use(routes.routes());
    this.server.use(routes.allowedMethods());
    this.server.use(notFound);
  }

  async start() {
    await this.services.database.connect();
    const server = this.server.listen(this.config.port);
    return { server, app: this };
  }

  async stop() {
    await this.services.database.disconnect();
  }
}
