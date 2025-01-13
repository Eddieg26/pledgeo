import "dotenv/config";
import { App } from "./app";
import { Config } from "./config";
import { Auth, DrizzleDb, RedisCache, Services } from "./services";

const config = new Config();
const services: Services = {
	auth: new Auth(),
	database: new DrizzleDb(config),
	cache: new RedisCache(config),
};

new App(config, services).start().then(({ server, app }) => {
	console.log("Server started", config);
	server.on("close", () => {
		app.stop();
	});
});
