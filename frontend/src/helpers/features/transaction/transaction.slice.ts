import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITransactionState, TTransactionCart } from "./transaction.types";

const initialState = {
  cart: [],
} as ITransactionState;

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addToCart: (
      state: ITransactionState,
      action: PayloadAction<TTransactionCart>
    ) => {
      state.cart.push({
        ...action.payload,
        quantity: action?.payload?.quantity || 1,
      });
    },
    removeFromCart: (
      state: ITransactionState,
      action: PayloadAction<string>
    ) => {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload
      );
    },
    clearCart: (state: ITransactionState) => {
      state.cart = [];
    },
    changeQuantityById: (
      state: ITransactionState,
      action: PayloadAction<{ id: string; type: "increment" | "decrement" }>
    ) => {
      state.cart = state.cart.map((product) => {
        if (product.id === action.payload.id) {
          let quantity = product?.quantity || 0;
          if (product) {
            if (action.payload.type === "increment") {
              quantity += 1;
            } else {
              quantity -= 1;
            }
          }
          return {
            ...product,
            quantity,
          };
        }
        return product;
      });
    },
  },
});

export const { addToCart, removeFromCart, clearCart, changeQuantityById } =
  transactionSlice.actions;

export default transactionSlice.reducer;
