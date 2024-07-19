import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';

import { getJWT } from './constants';

export const baseAPIQuery = fetchBaseQuery({
  baseUrl: '', // This will be overriden by any api inject.
  mode: 'cors',
  prepareHeaders: (headers) => {
    const token = getJWT();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
