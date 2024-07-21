import { TTransactionStatus } from 'src/payment-gateway/domain/entities/payment-gateway.entity';

export enum ETransactionStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
}

export interface ITransactionEntity {
  id: string;
  userId: string;
  gatewayId: string;
  gatewayTokenId: string;
  reference: string;
  productId: string;
  status: ETransactionStatus;
  quantity: number;
  amount: number;
  createdAt: Date;
}

export type TCreateTransaction = Pick<
  ITransactionEntity,
  'userId' | 'gatewayTokenId' | 'gatewayId' | 'reference' | 'productId' | 'quantity' | 'amount'
>;

export interface ICreatePaymentProducts {
  id: string;
  quantity: number;
}

export interface ICreatePaymentPayload {
  products: ICreatePaymentProducts[];
  tokenId: string;
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

export interface ICardTokenizationResponse {
  tokenId: string;
  brand: string;
  lastFour: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface IGetTransactionByGatewayId {
  userId: string;
  productId: string;
  amount: number;
  quantity: number;
}

export interface INotifyTransactionUpdate {
  transactionId: string;
  status: TTransactionStatus;
}
