export interface IAPIResponse<T = unknown> {
  statusCode: string;
  message: string;
  data?: T;
}

export enum EUserRoles {
  ADMIN = "admin",
  CLIENT = "client",
}

export enum EPaginationOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface IQueryValueRequest {
  query_value?: string;
}

export interface IPaginationParameters {
  page: number;
  limit: number;
  order: EPaginationOrder;
}

export interface IPageResponse<T> {
  content: T;
  meta: {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviuslyPage: boolean;
    hasNextPage: boolean;
  };
}
