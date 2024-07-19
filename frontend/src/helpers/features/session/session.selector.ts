import { createSelector } from "@reduxjs/toolkit";
import { equals } from "ramda";
import { isNilOrEmpty, isNotNilOrEmpty } from "ramda-adjunct";

import { RootState } from "@helpers/store";
import { ISessionState } from "./session.types";

export const selectSession = (state: RootState) => state.session;

export const selectUserSession = createSelector(
  selectSession,
  (session: ISessionState) => session.user
);

export const selectUserId = createSelector(
  selectSession,
  (session: ISessionState) => session.user?.id
);

/**
 * if session is pending or failed we assume loading state.
 * Failed is used when there is no session and the system is loading a anon session
 */
export const selectIsSessionLoading = createSelector(
  selectSession,
  (session: ISessionState) =>
    equals(session.status, "pending") || equals(session.status, "idle")
);

export const selectIsUserNeedsAnonymousSession = createSelector(
  selectSession,
  (session: ISessionState) =>
    equals(session.status, "pending") &&
    isNilOrEmpty(session.user) &&
    !session.isAnonymous
);

export const selectIsUserLoggedIn = createSelector(
  selectSession,
  (session: ISessionState) => isNotNilOrEmpty(session.user)
);

export const selectSessionError = createSelector(
  selectSession,
  (session: ISessionState) => session.error
);
