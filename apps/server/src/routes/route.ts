import KoaRouter from "@koa/router";
import { Result, ServerError, StatusCode } from "models";
import { AppContext, AppState } from "../app/context";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Handler<T> = (ctx: AppContext) => Promise<Result<T, ServerError>>;
export interface Route<T> {
  method: Method;
  endpoint: string;
  handler: Handler<T>;
}

export function route<T>(
  method: Method,
  endpoint: string,
  handler: Handler<T>
): Route<T> {
  return { method, endpoint, handler };
}

export function get<T>(endpoint: string, handler: Handler<T>) {
  return { method: "GET" as Method, endpoint, handler };
}

export function post<T>(endpoint: string, handler: Handler<T>) {
  return { method: "POST" as Method, endpoint, handler };
}

export function put<T>(endpoint: string, handler: Handler<T>) {
  return { method: "PUT" as Method, endpoint, handler };
}

export function patch<T>(endpoint: string, handler: Handler<T>) {
  return { method: "PATCH" as Method, endpoint, handler };
}

export function del<T>(endpoint: string, handler: Handler<T>) {
  return { method: "DELETE" as Method, endpoint, handler };
}

function wrapper<T>(handler: Handler<T>) {
  return async (ctx: AppContext) => {
    const result = await handler(ctx);
    if (result.value) {
      ctx.status = StatusCode.OK;
      ctx.body = result.value;
    } else if (result.error) {
      ctx.status = result.error.status;
      ctx.body = { message: result.error.message, data: result.error.metadata };
    }
  };
}

export class Router {
  base: string;
  private router: KoaRouter<AppState, AppContext>;

  constructor(base: string = "") {
    this.base = base;
    this.router = new KoaRouter();
  }

  sub(router: Router) {
    this.router.use(router.base, router.routes());
  }

  add<T>(route: Route<T>): Router {
    const endpoint = `${this.base}${route.endpoint}`;
    switch (route.method) {
      case "GET":
        this.router.get(endpoint, wrapper(route.handler));
        break;
      case "POST":
        this.router.post(endpoint, wrapper(route.handler));
        break;
      case "PUT":
        this.router.put(endpoint, wrapper(route.handler));
        break;
      case "PATCH":
        this.router.patch(endpoint, wrapper(route.handler));
        break;
      case "DELETE":
        this.router.delete(endpoint, wrapper(route.handler));
        break;
    }

    return this;
  }

  get<T>(endpoint: string, handler: Handler<T>) {
    this.router.get(`${this.base}${endpoint}`, wrapper(handler));
  }

  post<T>(endpoint: string, handler: Handler<T>) {
    this.router.post(`${this.base}${endpoint}`, wrapper(handler));
  }

  put<T>(endpoint: string, handler: Handler<T>) {
    this.router.put(`${this.base}${endpoint}`, wrapper(handler));
  }

  patch<T>(endpoint: string, handler: Handler<T>) {
    this.router.patch(`${this.base}${endpoint}`, wrapper(handler));
  }

  delete<T>(endpoint: string, handler: Handler<T>) {
    this.router.delete(`${this.base}${endpoint}`, wrapper(handler));
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
