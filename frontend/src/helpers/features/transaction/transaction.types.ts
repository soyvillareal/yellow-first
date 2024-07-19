import { IGetProductsResponse } from "../product/product.types";

export type TTransactionCart = IGetProductsResponse & {
  quantity?: number;
};

export interface ITransactionState {
  cart: TTransactionCart[];
}

export interface ICardTokenizeRequest {
  number: string;
  cvc: string;
  expMonth: number;
  expYear: number;
  cardHolder: string;
}

export interface IPaymentRequest {
  productId: string;
  tokenHash: string;
}
