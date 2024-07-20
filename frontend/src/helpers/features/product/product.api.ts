import { isNotNilOrEmpty } from 'ramda-adjunct';

import { api } from '@helpers/api';
import { EPaginationOrder, IAPIResponse, IPageResponse } from '@helpers/types';
import env from '@helpers/env';
import { RTKTags } from '@helpers/functions';

import { IGetProductsResponse, TGetProductsRequest } from './product.types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IAPIResponse<IPageResponse<IGetProductsResponse[]>>,
      TGetProductsRequest
    >({
      query: ({
        query_value,
        page = 1,
        limit = 10,
        order = EPaginationOrder.ASC,
      }) => ({
        url: `${
          env.VITE_APP_BASE_API_URL
        }/product/list?page=${page}&limit=${limit}&order=${order}${
          isNotNilOrEmpty(query_value) ? `&query_value=${query_value}` : ''
        }`,
        method: 'GET',
      }),
      providesTags: [RTKTags.GetProducts],
    }),
  }),
});

export const { useLazyGetProductsQuery } = userApi;
