import { EUserRoles } from "@helpers/types";

export enum ESessionType {
  ANONYMOUS = "anonymous",
  AUTH = "auth",
}

export interface ICommonSessionData {
  id: string;
  type: ESessionType;
  jwt: string;
  expired_at: Date;
}

export interface IUserSession {
  id: string;
  username: string;
  email: string;
  role: EUserRoles;
}

export interface IAuthSessionResponse extends ICommonSessionData {
  data?: IUserSession;
}

export interface IBaseSliceState {
  status: "idle" | "pending" | "succeeded" | "failed";
  error?: string;
}

export interface ISessionState extends IBaseSliceState {
  user: IUserSession | null;
  isAnonymous: boolean;
}

export interface IAuthSessionRequest {
  username: string;
  password: string;
}

export interface IAnonymousSessionRequest {
  seed: string;
}
