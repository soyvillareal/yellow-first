import { IUsersEntity } from 'src/users/domain/entities/users.entity';

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
