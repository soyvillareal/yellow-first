import { TTransactionStatus } from 'src/payment-gateway/domain/entities/payment-gateway.entity';

export interface ITransactionProductsEntity {
  id: string;
  userId: string;
  transactionId: string;
  productId: string;
  gatewayId: string;
  quantity: number;
  amount: number;
  createdAt: Date;
}

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
  totalAmount: number;
  status: ETransactionStatus;
  phoneCode: string;
  phoneNumber: string;
  firstAddress: string;
  secondAddress: string;
  state: string;
  city: string;
  pincode: string;
  createdAt: Date;
}

export type TCreateTransaction = Pick<
  ITransactionEntity,
  | 'userId'
  | 'gatewayTokenId'
  | 'gatewayId'
  | 'reference'
  | 'totalAmount'
  | 'phoneCode'
  | 'phoneNumber'
  | 'firstAddress'
  | 'secondAddress'
  | 'state'
  | 'city'
  | 'pincode'
>;

export type TCreateTransactionProduct = Pick<
  ITransactionProductsEntity,
  'userId' | 'transactionId' | 'productId' | 'gatewayId' | 'quantity' | 'amount'
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

export interface ICreatePaymentResponse {
  transactionId;
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
  transactionId: string;
  productId: string;
  amount: number;
  quantity: number;
}

export interface INotifyTransactionUpdate {
  transactionId: string;
  status: TTransactionStatus;
}

export type TGetTransactionById = Pick<ITransactionEntity, 'totalAmount' | 'status'>;

export interface ITransactionByIdResponse {
  amount: number;
  status: TTransactionStatus;
}

export interface IDeliveryEntity {
  id: string;
  userId: string;
  transactionId: string;
  phoneCode: string;
  phoneNumber: string;
  firstAddress: string;
  secondAddress: string;
  state: string;
  city: string;
  pincode: string;
  createdAt: Date;
}

export type TCreateDelivery = Pick<
  IDeliveryEntity,
  'userId' | 'transactionId' | 'phoneCode' | 'phoneNumber' | 'firstAddress' | 'secondAddress' | 'state' | 'city' | 'pincode'
>;

export interface ITransactionConfigEntity {
  id: string;
  fixedRate: string;
  variablePercentage: string;
  shippingFee: string;
  updatedAt: Date;
  createdAt: Date;
}

export type TGetTransactionConfig = Pick<ITransactionConfigEntity, 'fixedRate' | 'variablePercentage' | 'shippingFee'>;

export interface IGetTransactionConfig {
  fixedRate: number;
  variablePercentage: number;
  shippingFee: number;
}
