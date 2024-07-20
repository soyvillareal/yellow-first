declare module 'i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
    returnNull: false;
  }
}

export interface IAPIResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
}

export enum EUserRoles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum EPaginationOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ELanguages {
  EN = 'en',
  ES = 'es',
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

export interface ISEOPage {
  title?: string;
  subtitle: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    image: string;
    url: string;
    language: string;
  };
  twitter?: {
    title: string;
    description: string;
    url: string;
    image: string;
    creator?: string;
  };
}
