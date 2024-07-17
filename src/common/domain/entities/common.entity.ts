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
}

export interface IParamsWithUUID {
  id: string;
}
