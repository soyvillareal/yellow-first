import { IGetProductsResponse } from '../product/product.types';

export type TTransactionCart = IGetProductsResponse & {
  quantity?: number;
};

export interface ITransactionAddToCartPayload {
  userId: string;
  product: TTransactionCart;
}

export interface ITransactionAddToCart {
  userId: string | null;
  products: TTransactionCart[];
}

export interface ITransactionRemoveCartPayload {
  userId: string;
  productId: string;
}

export interface ITransactionAddCardInfo {
  tokenId: string;
  brand: string;
  lastFour: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
  expiredAt: string;
}

export interface ITransactionAddCardPayload {
  userId: string;
  cardInfo: ITransactionAddCardInfo;
}

export interface ITransactionAddCard {
  userId: string | null;
  cardInfo: ITransactionAddCardInfo | null;
}

export interface ITransactionState {
  cart: ITransactionAddToCart;
  card: ITransactionAddCard;
}

export interface ITransactionChangeQuantityById {
  userId: string;
  productId: string;
  type: 'increment' | 'decrement';
}

export interface ICardTokenizeResponse {
  tokenId: string;
  brand: string;
  lastFour: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface ICardTokenizeRequest {
  number: string;
  cvc: string;
  expMonth: number;
  expYear: number;
  cardHolder: string;
}

export interface IPaymentProducts {
  id: string;
  quantity: number;
}

export interface IPaymentRequest {
  products: IPaymentProducts[];
  tokenId: string;
  installments: number;
}

export interface IGetTransactionByIdResponse {
  amount: number;
}
export interface IGetTransactionByIdRequest {
  transactionId: string;
}
