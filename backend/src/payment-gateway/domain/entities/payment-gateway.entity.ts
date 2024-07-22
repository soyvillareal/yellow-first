import { TPartialRequest } from 'src/common/domain/entities/common.entity';

export type TCardTypes = 'CARD' | 'NEQUI' | 'BANCOLOMBIA' | 'BANCOLOMBIA_TRANSFER' | 'CLAVE' | 'DAVIPLATA';

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
  id: number;
  public_data: IPublicData;
  token: string;
  type: TCardTypes;
  status: 'AVAILABLE' | 'PENDING' | 'VOIDED';
  customer_email: string;
}

export interface IPaymentMethodsTransactionsPayload {
  type: TCardTypes;
  installments?: number;
  token?: string;
}

export interface ITransactionsPayload {
  amount_in_cents: number;
  currency: string;
  signature: string;
  customer_email: string;
  acceptance_token?: string;
  payment_method?: IPaymentMethodsTransactionsPayload;
  reference: string;
  payment_source_id?: number;
}

export type TCreateTransactions = Omit<ITransactionsPayload, 'acceptance_token'>;

export interface IPaymentMethodsExtra {
  bin: string;
  name: string;
  brand: string;
  exp_year: string;
  card_type: 'CREDIT' | 'DEBIT';
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

export type TTransactionStatus = 'APPROVED' | 'PENDING' | 'DECLINED' | 'VOIDED';

export interface ITransactionsResponse {
  id: string;
  created_at: string;
  finalized_at: string | null;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: TCardTypes;
  payment_method: IPaymentMethodsTransactionsResponse;
  status: TTransactionStatus;
  status_message: string | null;
  billing_data: null;
  shipping_address: string | null;
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

export interface IMerchantTransaction {
  id: number;
  name: string;
  legal_name: string;
  contact_name: string;
  phone_number: string;
  logo_url: string | null;
  legal_id_type: string;
  email: string;
  legal_id: string;
  public_key: string;
}

export interface IThreeDsAuth {
  three_ds_auth: {
    current_step: string;
    current_step_status: string;
  };
}

export interface ITransactionExtra extends IPaymentMethodsExtra {
  three_ds_auth: IThreeDsAuth;
  external_identifier: string;
  processor_response_code: string;
}

export interface ITransactionPaymentMethod {
  type: TCardTypes;
  extra: ITransactionExtra;
  installments: number;
}

export interface IGetTransactionsResponse {
  id: string;
  created_at: string;
  finalized_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: TCardTypes;
  payment_method: ITransactionPaymentMethod;
  status: TTransactionStatus;
  status_message: string | null;
  billing_data: null;
  shipping_address: string | null;
  redirect_url: string | null;
  payment_source_id: number;
  payment_link_id: number | null;
  customer_data: ITransactionsResponseCustomer | null;
  bill_id: number | null;
  taxes: ITransactionsResponseTaxes[];
  tip_in_cents: null;
  merchant: IMerchantTransaction;
  entries: [];
  disbursement: null;
  refunds: [];
}

export interface IGenerateCardTokenPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface IGenerateCardTokenResponse {
  cardToken: string;
  brand: string;
  lastFour: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
  expiredAt: string;
  validityEndsAt: string;
}

export interface IGatewayEventTransaction {
  id: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: TCardTypes;
  redirect_url: string | null;
  status: TTransactionStatus;
  shipping_address: string | null;
  payment_link_id: number | null;
  payment_source_id: null;
}

export interface IGatewayEventSignature {
  properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'];
  checksum: string;
}

export interface IGatewayEventData {
  transaction: IGatewayEventTransaction;
}

export interface IGatewayEvent {
  event: 'transaction.updated' | 'nequi_token.updated';
  data: IGatewayEventData;
  environment: 'test' | 'prod';
  signature: IGatewayEventSignature;
  timestamp: number;
  sent_at: string;
}

export interface IGatewayEventHeaders extends Record<string, string> {
  'x-event-checksum': string;
}
