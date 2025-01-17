import { api } from '@helpers/api';
import { IAPIResponse } from '@helpers/types';
import env from '@helpers/env';
import { RTKTags } from '@helpers/functions';

import {
  ICardTokenizeRequest,
  ICardTokenizeResponse,
  IGetTransactionByIdRequest,
  IGetTransactionByIdResponse,
  IGetTransactionConfigResponse,
  IPaymentRequest,
  IPaymentResponse,
} from './transaction.types';

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    cardTokenize: builder.mutation<
      IAPIResponse<ICardTokenizeResponse>,
      ICardTokenizeRequest
    >({
      query: ({ number, cvc, expMonth, expYear, cardHolder }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/card-tokenize`,
        method: 'POST',
        body: {
          number,
          cvc,
          expMonth,
          expYear,
          cardHolder,
        },
      }),
    }),
    payment: builder.mutation<IAPIResponse<IPaymentResponse>, IPaymentRequest>({
      query: ({ products, tokenId, installments }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/payment`,
        method: 'POST',
        body: {
          products,
          tokenId,
          installments,
        },
      }),
      invalidatesTags: [RTKTags.GetProducts],
    }),
    getTransactionById: builder.query<
      IAPIResponse<IGetTransactionByIdResponse>,
      IGetTransactionByIdRequest
    >({
      query: ({ transactionId }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/${transactionId}`,
        method: 'GET',
      }),
    }),
    getTransactionConfig: builder.query<
      IAPIResponse<IGetTransactionConfigResponse>,
      void
    >({
      query: () => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/config`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCardTokenizeMutation,
  usePaymentMutation,
  useLazyGetTransactionByIdQuery,
  useGetTransactionConfigQuery,
} = transactionApi;
