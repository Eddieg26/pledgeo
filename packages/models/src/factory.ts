import {
  Campaign,
  Either,
  Email,
  Id,
  Password,
  Result,
  ServerError,
  Session,
  StatusCode,
  Token,
  User,
} from ".";

export function id(id: string): Id {
  return id as Id;
}

export function email(email: string): Email {
  return email as Email;
}

export function password(password: string): Password {
  return password as Password;
}

export function token(token: string): Token {
  return token as Token;
}

export function user(id: Id, email: Email, name: string): User {
  return {
    id,
    email,
    name,
  };
}

export function campaign(
  id: Id,
  user_id: Id,
  name: string,
  user?: User
): Campaign {
  return {
    id,
    name,
    user_id,
    user,
  };
}

export function session(
  id: Id,
  user: Id,
  token: Token,
  expires: Date,
  attempts: number
): Session {
  return { id: id, user, token, expires, attempts };
}

export function pager<T>(
  items: T[],
  total: number,
  page: number,
  per_page: number
) {
  return { items, total, page, per_page };
}

export function ok<T, E>(value: T) {
  return { error: null, value } as Result<T, E>;
}

export function err<T, E>(error: E) {
  return { value: null, error } as Result<T, E>;
}

export function empty<E>() {
  return ok<{}, E>({});
}

export function todo(message?: string) {
  return err({ message: message ?? "Not implemented" });
}

export function left<L, R>(value: L): Either<L, R> {
  return { left: value };
}

export function right<L, R>(value: R): Either<L, R> {
  return { right: value };
}

export function unauthorized(message: string, metadata?: any) {
  return new ServerError(StatusCode.UNAUTHORIZED, message, metadata);
}

export function forbidden(message: string, metadata?: any) {
  return new ServerError(StatusCode.FORBIDDEN, message, metadata);
}

export function not_found(message: string, metadata?: any) {
  return new ServerError(StatusCode.NOT_FOUND, message, metadata);
}

export function bad_request(message: string, metadata?: any) {
  return new ServerError(StatusCode.BAD_REQUEST, message, metadata);
}

export function internal(message: string, metadata?: any) {
  return new ServerError(StatusCode.SERVER_ERROR, message, metadata);
}

export const factory = {
  id,
  email,
  password,
  token,
  user,
  campaign,
  pager,
  session,
  ok,
  err,
  empty,
  left,
  right,
  unauthorized,
  forbidden,
  not_found,
  bad_request,
  internal,
};

export default factory;
