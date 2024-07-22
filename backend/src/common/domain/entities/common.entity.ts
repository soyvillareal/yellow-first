import { Request } from 'express';

import { ELogPriority } from 'src/logs/domain/entities/logs.entity';
import { TSession } from 'src/session/domain/entities/session.entity';

export enum EOrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPageOptions {
  order?: EOrderType;
  page: number;
  limit: number;
}

export interface IPageFilter extends IPageOptions {
  skip?: number;
}

export interface IPageMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPageMetaResponse<T> {
  content: T;
  meta: IPageMeta;
}
export interface IPageMetaParameters {
  pageOptions: IPageOptions;
  itemCount: number;
}

export interface IListAndTotal<T> {
  list: T;
  total: number;
}

export interface IPageMetaDtoParameters {
  pageOptionsDto: IPageOptions;
  itemCount: number;
}

export interface IGetEntitySchema {
  column_name: string;
  data_type: string;
  character_maximum_length: number;
  is_nullable: 'YES' | 'NO';
  is_unique: 'YES' | 'NO';
  column_default: string;
}

export interface IDApiResponseCase<T, K> {
  statusCode: number;
  description?: string;
  dataDto?: T;
  schema?: K;
  type?: 'array' | 'object';
}

export interface IParamsWithUUID {
  id: string;
}

export interface IGenerateSignature {
  reference: string;
  amountInCents: number;
  currency: string;
}

export interface ICalculateRateConfig {
  fixedRate: number;
  variablePercentage: number;
}

export interface ApiResponseCase<T = []> {
  message?: string | undefined;
  data?: T;
}

export interface IHeaderUserTokenData extends Request {
  user: TSession;
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
  forcePriority?: ELogPriority;
}
