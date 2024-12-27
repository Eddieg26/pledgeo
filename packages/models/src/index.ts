export type Nullable<T> = T | null | undefined;
export type Opaque<T extends string, V> = V & { __type: T };

export type Id = Opaque<"Id", string>;
export type Email = Opaque<"Email", string>;
export type Password = Opaque<"Password", string>;
export type Token = Opaque<"Token", string>;

export interface User {
  id: Id;
  email: Email;
  name: string;
}

export interface Campaign {
  id: Id;
  name: string;
  user_id: Id;
  user?: User;
}

export interface Session {
  id: Id;
  token: Token;
  user: Id;
  expires: Date;
  attempts: number;
}

export interface Pager<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export class ServerError extends Error {
  status: StatusCode;
  metadata?: any;

  constructor(status: StatusCode, message: string, metadata?: any) {
    super(message);
    this.status = status;
    this.metadata = metadata;
  }

  data<T>(): T | undefined {
    return this.metadata ? (this.metadata as T) : undefined;
  }
}

export type Ok<T> = { error: null; value: T };
export type Err<E> = { value: null; error: E };
export type Result<T, E> = Ok<T> | Err<E>;
export const Empty = {};

export type Left<T> = { left: T };
export type Right<T> = { right: T };
export type Either<L, R> = Left<L> | Right<R>;

export * from "./factory";
export * from "./schemas";

