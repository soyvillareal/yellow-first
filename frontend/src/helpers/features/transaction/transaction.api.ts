import { api } from "@helpers/api";
import { IAPIResponse } from "@helpers/types";
import env from "@helpers/env";
import { RTKTags } from "@helpers/functions";

import { ICardTokenizeRequest, IPaymentRequest } from "./transaction.types";

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    cardTokenize: builder.mutation<IAPIResponse, ICardTokenizeRequest>({
      query: ({ number, cvc, expMonth, expYear, cardHolder }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/card-tokenize`,
        method: "POST",
        body: {
          number,
          cvc,
          expMonth,
          expYear,
          cardHolder,
        },
      }),
    }),
    payment: builder.mutation<IAPIResponse, IPaymentRequest>({
      query: ({ productId, tokenHash }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/transaction/payment`,
        method: "POST",
        body: {
          productId,
          tokenHash,
        },
      }),
      invalidatesTags: [RTKTags.GetProducts],
    }),
  }),
});

export const { useCardTokenizeMutation, usePaymentMutation } = transactionApi;
