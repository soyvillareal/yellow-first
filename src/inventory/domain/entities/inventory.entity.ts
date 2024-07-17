export enum ETransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
}

export interface IStockEntity {
  id: number;
  productId: string;
  quantity: number;
  updatedAt: Date;
  createdAt: Date;
}

export type TCreateStock = Pick<IStockEntity, 'productId' | 'quantity'>;

export interface ITransactionEntity {
  id: number;
  userId: string;
  productId: string;
  status: ETransactionStatus;
  amount: number;
  createdAt: Date;
}

export type TCreateTransaction = Pick<ITransactionEntity, 'userId' | 'productId' | 'amount'>;

export interface ITransactionPayload {
  productId: string;
  paymentSourceId: number;
  signature: string;
}

export interface ITransactionResponse {
  transactionId: number;
}

export interface ICardTokenizationPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface ICardTokenizationResponse {
  tokenId: number;
}
