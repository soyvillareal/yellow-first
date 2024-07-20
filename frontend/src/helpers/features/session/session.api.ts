import { api } from '@helpers/api';
import { IAPIResponse } from '@helpers/types';
import env from '@helpers/env';
import { RTKTagsAsArray } from '@helpers/functions';

import {
  IAnonymousSessionRequest,
  IAuthSessionRequest,
  IAuthSessionResponse,
  ICommonSessionData,
} from './session.types';

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    anonymousSession: builder.mutation<
      IAPIResponse<ICommonSessionData>,
      IAnonymousSessionRequest
    >({
      query: ({ seed }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/session/anonymous`,
        method: 'POST',
        body: {
          seed,
        },
      }),
      invalidatesTags: RTKTagsAsArray(), // This will invalidate all cache when user logs out
    }),
    authSession: builder.mutation<
      IAPIResponse<IAuthSessionResponse>,
      IAuthSessionRequest
    >({
      query: ({ username, password }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/session/auth`,
        method: 'POST',
        body: {
          username,
          password,
        },
      }),
    }),
  }),
});

export const { useAnonymousSessionMutation, useAuthSessionMutation } =
  sessionApi;
