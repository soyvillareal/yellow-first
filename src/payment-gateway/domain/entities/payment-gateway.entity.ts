import { TPartialRequest } from 'src/framework/domain/entities/framework.entity';

export interface IFieldsTL {
  id: string;
  name: string;
  values: string[];
}

export interface IFormDataTL {
  created_time: string;
  id: string;
  fields: IFieldsTL[];
}

export interface IOkResponseGA<T, K = Record<string, unknown>> {
  status?: 'CREATED' | 'DECLINED' | 'ERROR';
  data: T;
  meta?: K;
}

export interface IErrorResponseGA {
  error: {
    type: string;
    code?: string;
    reason?: string;
    messages?: string[];
  };
}

export type TResponseOkOrError<T, K = Record<string, unknown>> = IOkResponseGA<T, K> | IErrorResponseGA;

export interface IResponseAG<T> {
  request?: TPartialRequest;
  type: string;
  response: T;
}

export interface IPaymentProccessors {
  name: string;
}

export interface IMerchantsResponsePaymentMethods {
  name: string;
  payment_processors: IPaymentProccessors[];
}

export interface IPresignedAcceptance {
  acceptance_token: string;
  permalink: string;
  type: string;
}

export interface IMerchantsResponse {
  id: number;
  name: string;
  email: string;
  contact_name: string;
  phone_number: string;
  active: true;
  logo_url: string | null;
  legal_name: string;
  legal_id_type: string;
  legal_id: string;
  public_key: string;
  accepted_currencies: string[];
  fraud_javascript_key: string | null;
  fraud_groups: [];
  accepted_payment_methods: string[];
  payment_methods: IMerchantsResponsePaymentMethods[];
  presigned_acceptance: IPresignedAcceptance;
}

export interface ITokensCardsPayload {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface ITokensCardsResponse {
  id: string;
  created_at: string;
  brand: string;
  name: string;
  last_four: string;
  bin: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
  created_with_cvc: boolean;
  expires_at: string;
  validity_ends_at: string;
}

export interface IPaymentResourcePayload {
  acceptance_token: string;
  customer_email: string;
  type: string;
  token: string;
}

export interface IPublicData {
  bin: string;
  last_four: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  validity_ends_at: string;
  type: string;
}

export interface IPaymentResourceResponse {
  id: 25671;
  public_data: IPublicData;
  token: string;
  type: 'NEQUI' | 'CARD';
  status: 'AVAILABLE' | 'PENDING' | 'VOIDED';
  customer_email: string;
}

export interface IPaymentMethodsTransactionsPayload {
  installments?: number;
}

export interface ITransactionsPayload {
  amount_in_cents: number;
  currency: string;
  signature: string;
  customer_email: string;
  payment_method?: IPaymentMethodsTransactionsPayload;
  reference: string;
  payment_source_id: number;
}

export interface IPaymentMethodsExtra {
  bin: string;
  name: string;
  brand: string;
  exp_year: string;
  card_type: string;
  exp_month: string;
  last_four: string;
  card_holder: string;
  is_three_ds: number;
  unique_code: string | null;
}

export interface IPaymentMethodsTransactionsResponse {
  type: string;
  extra: IPaymentMethodsExtra;
  installments: number;
}

export interface ITransactionsResponseCustomer {
  phone_number: string;
  full_name: string;
}

export interface ITransactionsResponseTaxes {
  type: 'VAT' | 'IVA' | 'CONSUMPTION';
  amount_in_cents: number;
}

export interface ITransactionsResponse {
  id: string;
  created_at: string;
  finalized_at: string | null;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: IPaymentMethodsTransactionsResponse;
  status: 'APPROVED' | 'PENDING' | 'DECLINED' | 'VOIDED';
  status_message: string | null;
  billing_data: null;
  shipping_address: 'string' | null;
  redirect_url: string | null;
  payment_source_id: number;
  payment_link_id: number | null;
  customer_data: ITransactionsResponseCustomer | null;
  bill_id: number | null;
  taxes: ITransactionsResponseTaxes[];
  tip_in_cents: string | null;
}

export interface ITransactionPayload {
  productId: string;
  cardToken: string;
}

export interface IGenerateCardTokenPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface IGeneratePaymentSourcesPayload {
  customerEmail: string;
  type: string;
  cardToken: string;
}
