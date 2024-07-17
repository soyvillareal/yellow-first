import {
  IMerchantsResponse,
  IPaymentResourcePayload,
  IPaymentResourceResponse,
  IResponseAG,
  ITokensCardsPayload,
  ITokensCardsResponse,
  ITransactionsPayload,
  ITransactionsResponse,
  TResponseOkOrError,
} from '../entities/payment-gateway.entity';

export interface paymentGatewayRepository {
  merchants: () => Promise<IResponseAG<TResponseOkOrError<IMerchantsResponse>>>;
  tokensCards: (payload: ITokensCardsPayload) => Promise<IResponseAG<TResponseOkOrError<ITokensCardsResponse>>>;
  paymentResource: (payload: IPaymentResourcePayload) => Promise<IResponseAG<TResponseOkOrError<IPaymentResourceResponse>>>;
  transactions: (payload: ITransactionsPayload) => Promise<IResponseAG<TResponseOkOrError<ITransactionsResponse>>>;
}
