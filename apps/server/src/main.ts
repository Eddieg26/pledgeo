import { App } from "./app";
import { Config } from "./config";
import { Services } from "./services";
import { Auth } from "./services/auth";
import { PgDatabase } from "./services/database";

const config = new Config();
const services: Services = {
  auth: new Auth(),
  database: new PgDatabase(),
};

new App(config, services).start().then(({ server, app }) => {
  console.log(`Server running on port ${config.port}`);
  server.on("close", () => {
    app.stop();
  });
});
