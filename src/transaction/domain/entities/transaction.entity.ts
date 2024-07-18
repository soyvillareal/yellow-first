export enum ETransactionStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
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
  reference: string;
  productId: string;
  status: ETransactionStatus;
  amount: number;
  createdAt: Date;
}

export type TCreateTransaction = Pick<ITransactionEntity, 'userId' | 'reference' | 'productId' | 'amount'>;

export interface ICreatePaymentPayload {
  productId: string;
  installments: number;
}

export interface ITransactionResponse {
  transactionId: number;
}

export interface ICardTokenizationPayload {
  number: string;
  cvc: string;
  expMonth: number;
  expYear: number;
  cardHolder: string;
}

export interface ICardTokenizationResponse {
  tokenId: number;
}
