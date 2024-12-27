import type {
  Campaign,
  Either,
  Email,
  Id,
  Nullable,
  Pager,
  Password,
  Session,
  Token,
  User,
} from "models";

export interface UserService {
  get(value: Either<Id, Email>): Promise<Nullable<User>>;
  create(email: Email, password: string, name: string): Promise<User>;
  update(email: Email, password: string): Promise<Nullable<User>>;
  delete(id: Id): Promise<Nullable<User>>;
}

export interface SessionService {
  insert(session: Session): Promise<Session>;
  update(id: Id, attempts: number): Promise<void>;
  get(value: Either<Id, Token>): Promise<Nullable<Session>>;
  get_many(user: Id): Promise<Session[]>;
  delete(value: Either<Id, Token>): Promise<Nullable<Session>>;
  delete_many(user: Id): Promise<Session[]>;
}

export interface CampaignService {
  get_many(user: Id, page?: number, limit?: number): Promise<Pager<Campaign>>;
  get(id: Id): Promise<Nullable<Campaign>>;
  create(user: Id, name: string): Promise<Campaign>;
  update(id: Id, name: string): Promise<Nullable<Campaign>>;
  delete(id: Id): Promise<Nullable<Campaign>>;
}

export interface PasswordService {
  get(user: Id): Promise<Nullable<Password>>;
  create(user: Id, password: Password): Promise<Password>;
  update(user: Id, password: Password): Promise<Nullable<Password>>;
  delete(user: Id): Promise<Nullable<Password>>;
}

export interface DatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  users(): UserService;
  sessions(): SessionService;
  campaigns(): CampaignService;
  passwords(): PasswordService;
}

export class Database implements DatabaseService {
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  users(): UserService {
    throw new Error("Method not implemented.");
  }
  sessions(): SessionService {
    throw new Error("Method not implemented.");
  }
  campaigns(): CampaignService {
    throw new Error("Method not implemented.");
  }
  passwords(): PasswordService {
    throw new Error("Method not implemented.");
  }
}
