import { createApi } from '@reduxjs/toolkit/query/react';

import { baseAPIQuery } from './baseAPIQuery';
import { RTKTagsAsArray } from './functions';

export const api = createApi({
  reducerPath: 'api',
  tagTypes: RTKTagsAsArray(),
  baseQuery: baseAPIQuery,
  // By default the invalidation Cache time is 60 seg.
  keepUnusedDataFor: 60,
  // Re-validate all data when user comes from off-line mode.
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
