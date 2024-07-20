import {
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import transactionReducer from './features/transaction/transaction.slice';
import sessionReducer from './features/session/session.slice';
import { api } from './api';
import env from './env';

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  transaction: transactionReducer,
  session: sessionReducer,

  [api.reducerPath]: api.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: env.VITE_NODE_ENV,
    middleware: (getDefaultMiddleware) => {
      const middlewares = [api.middleware];

      return getDefaultMiddleware().concat(middlewares);
    },
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
