import { Request } from 'express';

import { ELogPriority } from 'src/logs/domain/entities/logs.entity';
import { TWebhookLeadResponse } from 'src/product/domain/entities/product.entity';
import { ERoles } from 'src/users/domain/entities/users.entity';

export interface ApiResponseCase<T = []> {
  message?: string | undefined;
  data: T;
}

export interface IUserTokenData {
  userId: string;
  username: string;
  role: ERoles;
}

export interface IHeaderUserTokenData extends Request {
  user: IUserTokenData;
}

export interface IHeaderHaveUsers {
  haveUsers: boolean;
}

export type TPartialRequest = Partial<Request>;

export interface IResponseApi<T = []> {
  statusCode: number;
  message: string | undefined;
  timestamp?: string;
  data?: T;
}

export interface IGenerateLog {
  statusCode: number;
  request: IHeaderUserTokenData;
  response?: any;
  webhookData?: TWebhookLeadResponse | null;
  forcePriority?: ELogPriority;
}
