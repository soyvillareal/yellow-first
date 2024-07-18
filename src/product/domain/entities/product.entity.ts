import {
  IMerchantsResponse,
  IOkResponseGA,
  IPaymentResourceResponse,
  IResponseAG,
  ITokensCardsResponse,
  ITransactionsResponse,
} from 'src/payment-gateway/domain/entities/payment-gateway.entity';

export type TCustomValue = string | number;

export interface IProductEntity {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  updatedAt: Date;
  createdAt: Date;
}

export type TGetProduct = Pick<IProductEntity, 'id' | 'name' | 'description' | 'price' | 'stock'>;
export type TGetProductById = Pick<IProductEntity, 'price' | 'stock'>;

export type TWebhookLeadResponse = IResponseAG<
  IOkResponseGA<IMerchantsResponse | ITokensCardsResponse | IPaymentResourceResponse | ITransactionsResponse>
>;

export interface ITransactionCase {
  data: any;
  webhookData?: TWebhookLeadResponse;
}
