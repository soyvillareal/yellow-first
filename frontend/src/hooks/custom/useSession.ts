import { useCallback, useEffect } from 'react';

import { useAnonymousSessionMutation } from '@helpers/features/session/session.api';
import {
  selectIsUserNeedsAnonymousSession,
  selectUserId,
} from '@helpers/features/session/session.selector';
import {
  loadSession,
  setSession,
} from '@helpers/features/session/session.slice';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import useAppSelector from '@hooks/redux/useAppSelector';
import {
  loadCardinfo,
  loadProductsToCart,
} from '@helpers/features/transaction/transaction.slice';

export default function useSession() {
  const dispatch = useAppDispatch();

  const selectedUserId = useAppSelector(selectUserId);
  const userNeedsAnonymousSession = useAppSelector(
    selectIsUserNeedsAnonymousSession,
  );
  const [getAnonymousSession, { isLoading: isLoadingAnonymousSession }] =
    useAnonymousSessionMutation();

  const loadAnonymousSession = useCallback(async () => {
    // load session from api
    const anonSession = await getAnonymousSession({
      seed: 'empty',
    }).unwrap();
    // set session in store
    if (anonSession?.data !== undefined) {
      dispatch(
        setSession({
          jwt: anonSession.data.jwt,
          expiredAt: anonSession.data.expiredAt,
          id: anonSession.data.id,
          type: anonSession.data.type,
        }),
      );
    }
  }, [dispatch, getAnonymousSession]);

  const loadAuthSession = useCallback(() => {
    dispatch(loadSession());
  }, [dispatch]);

  const loadCartSession = useCallback(() => {
    if (selectedUserId !== undefined) {
      dispatch(loadProductsToCart(selectedUserId));
      dispatch(loadCardinfo(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  useEffect(() => {
    // Load session into the store
    if (userNeedsAnonymousSession && isLoadingAnonymousSession === false) {
      // user need an anonymous session
      loadAnonymousSession();
    } else {
      loadAuthSession();
      loadCartSession();
    }
  }, [
    userNeedsAnonymousSession,
    getAnonymousSession,
    isLoadingAnonymousSession,
    loadAnonymousSession,
    loadAuthSession,
    loadCartSession,
  ]);
}
