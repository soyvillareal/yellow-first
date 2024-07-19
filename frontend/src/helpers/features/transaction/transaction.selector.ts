import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@helpers/store";

import { ITransactionState } from "./transaction.types";

export const selectTransaction = (state: RootState) => state.transaction;

export const selectCartTransaction = createSelector(
  selectTransaction,
  (skill: ITransactionState) => skill.cart
);

export const selectQuantityTransactionById = (id: string) =>
  createSelector(
    selectCartTransaction,
    (cart) => cart.find((item) => item.id === id)?.quantity
  );
