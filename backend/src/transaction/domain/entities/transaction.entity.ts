export enum ETransactionStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
}

export interface ITransactionEntity {
  id: number;
  userId: string;
  gatewayId: string;
  gatewayTokenId: string;
  reference: string;
  productId: string;
  status: ETransactionStatus;
  amount: number;
  createdAt: Date;
}

export type TCreateTransaction = Pick<
  ITransactionEntity,
  'userId' | 'gatewayTokenId' | 'gatewayId' | 'reference' | 'productId' | 'amount'
>;

export interface ICreatePaymentPayload {
  productId: string;
  installments: number;
}

export interface ICardTokenizationPayload {
  number: string;
  cvc: string;
  expMonth: number;
  expYear: number;
  cardHolder: string;
}

export interface IUpdateTransactionResponse {
  recieve: boolean;
}
