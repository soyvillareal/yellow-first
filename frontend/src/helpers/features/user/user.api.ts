import { api } from "@helpers/api";
import { IAPIResponse } from "@helpers/types";
import env from "@helpers/env";
import { RTKTags } from "@helpers/functions";

import { ICreateUserRequest, ICreateUserResponse } from "./user.types";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<
      IAPIResponse<ICreateUserResponse>,
      ICreateUserRequest
    >({
      query: ({ email, password, username }) => ({
        url: `${env.VITE_APP_BASE_API_URL}/user/create`,
        method: "POST",
        body: {
          email,
          password,
          username,
        },
      }),
    }),
  }),
});

export const { useCreateUserMutation } = productApi;
