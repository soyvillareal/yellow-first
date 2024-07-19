import { IPaginationParameters, IQueryValueRequest } from "@helpers/types";

export type TGetProductsRequest = IQueryValueRequest & IPaginationParameters;

export interface IGetProductsResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  stock: number;
}
