export enum ERoles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export interface IUsersEntity {
  id: string;
  email: string;
  username: string;
  password: string;
  role: ERoles;
  firstAddress: string;
  secondAddress: string;
  state: string;
  city: string;
  pincode: string;
  phoneCode: string;
  phoneNumber: string;
  updatedAt: Date;
  createdAt: Date;
}
export type TGetInfoUser = Pick<
  IUsersEntity,
  'email' | 'phoneCode' | 'phoneNumber' | 'firstAddress' | 'secondAddress' | 'state' | 'city' | 'pincode'
>;

export type IGetInfoByUsername = Pick<
  IUsersEntity,
  | 'id'
  | 'email'
  | 'username'
  | 'password'
  | 'role'
  | 'firstAddress'
  | 'secondAddress'
  | 'state'
  | 'city'
  | 'pincode'
  | 'phoneCode'
  | 'phoneNumber'
>;

export interface ISeedAnonymousSession {
  seed: string;
  expiredAt: Date;
}

export type TAuthSessionData = Pick<
  IUsersEntity,
  | 'id'
  | 'username'
  | 'email'
  | 'role'
  | 'firstAddress'
  | 'secondAddress'
  | 'state'
  | 'city'
  | 'pincode'
  | 'phoneCode'
  | 'phoneNumber'
>;

export interface IAuthSession {
  data?: TAuthSessionData;
}

export type TAnonymousSession = Pick<ISessionEntity, 'id' | 'type'> & Partial<ISeedAnonymousSession>;

export type TSession = IAuthSession & TAnonymousSession;

export interface ICredentialsToken {
  username: string;
  password: string;
}

export enum ESessionType {
  ANONYMOUS = 'anonymous',
  AUTH = 'auth',
}

export type TCreateSession = Partial<Pick<ISessionEntity, 'id'>> & Pick<ISessionEntity, 'userId' | 'jwt' | 'type' | 'expiredAt'>;

export interface ISessionEntity {
  id: string;
  userId: string | null;
  jwt: string;
  type: ESessionType;
  expiredAt: Date;
  createdAt: Date;
}

export type TAuthSessionResponse = TSession & {
  jwt: string;
};

export interface IAnonymousSessionPayload {
  seed: string;
}
