import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { equals } from 'ramda';
import { isNilOrEmpty, isNotNilOrEmpty } from 'ramda-adjunct';
import Cookies from 'universal-cookie';

import { removeCookie, setCookie } from '../../cookie';
import { getStorage } from '../../storage';
import { IAuthSessionResponse, ISessionState } from './session.types';

const initialState = {
  user: null,
  isAnonymous: false,
  status: 'idle',
} as ISessionState;

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: (state: ISessionState) => {
      const localStorageSessionJSON = getStorage()?.getItem('session') || '';

      if (isNotNilOrEmpty(localStorageSessionJSON)) {
        const localSessionObject = JSON.parse(
          localStorageSessionJSON,
        ) as IAuthSessionResponse;
        const cookies = new Cookies();
        const expiredAt = new Date(localSessionObject.expiredAt);
        const today = new Date();

        if (
          equals(localSessionObject.id, cookies.get('session-id')) &&
          today <= expiredAt
        ) {
          // if session is an anonymous session, don't load user into store
          if (localSessionObject.data) {
            state.user = localSessionObject.data;
          }
          state.status = 'succeeded';
        } else {
          state.status = 'pending';
        }
      } else {
        state.status = 'pending';
      }
    },
    setSession: (
      state: ISessionState,
      action: PayloadAction<IAuthSessionResponse>,
    ) => {
      const session = action.payload;
      // Set session info
      setCookie(
        'session-id',
        JSON.stringify(session.id),
        new Date(session.expiredAt),
      );
      getStorage()?.setItem('session', JSON.stringify(session));
      if (session.data) {
        state.user = session.data;
      }
      state.isAnonymous = isNilOrEmpty(session.data);
      state.status = 'succeeded';
    },
    removeSession: (state: ISessionState) => {
      getStorage()?.clear();
      removeCookie('session-id');
      state.user = initialState.user;
      state.isAnonymous = initialState.isAnonymous;
      state.status = 'pending';
    },
  },
});

export const { loadSession, setSession, removeSession } = sessionSlice.actions;

export default sessionSlice.reducer;
