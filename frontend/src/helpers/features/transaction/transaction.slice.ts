import moment from 'moment';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getStorage } from '@helpers/storage';

import {
  ITransactionAddCard,
  ITransactionAddCardPayload,
  ITransactionAddToCart,
  ITransactionAddToCartPayload,
  ITransactionChangeQuantityById,
  ITransactionRemoveCartPayload,
  ITransactionState,
} from './transaction.types';

const initialState = {
  cart: {
    userId: null,
    products: [],
  },
  card: {
    userId: null,
    cardInfo: null,
  },
} as ITransactionState;

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    loadProductsToCart: (
      state: ITransactionState,
      action: PayloadAction<string>,
    ) => {
      const localStorageCartJSON = getStorage()?.getItem('cart') || '';

      if (localStorageCartJSON) {
        const localCartObject = JSON.parse(
          localStorageCartJSON,
        ) as ITransactionAddToCart;

        const currentUserId = action.payload;

        if (localCartObject.userId === currentUserId) {
          state.cart = localCartObject;
        }
      }
    },
    addToCart: (
      state: ITransactionState,
      action: PayloadAction<ITransactionAddToCartPayload>,
    ) => {
      const currentCart: ITransactionAddToCart = {
        userId: action.payload.userId,
        products: [
          ...state.cart.products.filter(
            (product) => product.id !== action.payload.product.id,
          ),
          {
            ...action.payload.product,
            quantity: action?.payload?.product?.quantity || 1,
          },
        ],
      };
      state.cart = currentCart;
      getStorage()?.setItem('cart', JSON.stringify(currentCart));
    },
    removeFromCart: (
      state: ITransactionState,
      action: PayloadAction<ITransactionRemoveCartPayload>,
    ) => {
      if (state.cart.userId === action.payload.userId) {
        getStorage()?.removeItem('cart');
        state.cart.products = state.cart.products.filter(
          (product) => product.id !== action.payload.productId,
        );
      }
    },
    clearCart: (state: ITransactionState) => {
      state.cart = {
        userId: null,
        products: [],
      };
      getStorage()?.removeItem('cart');
    },
    changeQuantityById: (
      state: ITransactionState,
      action: PayloadAction<ITransactionChangeQuantityById>,
    ) => {
      if (state.cart.userId === action.payload.userId) {
        state.cart.products = state.cart.products.map((product) => {
          if (product.id === action.payload.productId) {
            let quantity = product?.quantity || 0;
            if (product) {
              if (action.payload.type === 'increment') {
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
      }
    },
    loadCardinfo: (state: ITransactionState, action: PayloadAction<string>) => {
      const localStorageCardJSON = getStorage()?.getItem('card') || '';

      if (localStorageCardJSON) {
        const localCardObject = JSON.parse(
          localStorageCardJSON,
        ) as ITransactionAddCard;
        const currentTime = moment();
        const expiredAt = new Date(localCardObject.cardInfo?.expiredAt || '');

        if (currentTime.isBefore(expiredAt) === true) {
          const currentUserId = action.payload;

          if (currentUserId === localCardObject.userId) {
            state.card = localCardObject;
          }
        } else {
          state.card = {
            userId: null,
            cardInfo: null,
          };
          getStorage()?.removeItem('card');
        }
      }
    },
    addCardInfo: (
      state: ITransactionState,
      action: PayloadAction<ITransactionAddCardPayload>,
    ) => {
      const newCard: ITransactionAddCard = {
        userId: action.payload.userId,
        cardInfo: action.payload.cardInfo,
      };
      state.card = newCard;
      getStorage()?.setItem('card', JSON.stringify(newCard));
    },
    clearCard: (state: ITransactionState) => {
      state.card = {
        userId: null,
        cardInfo: null,
      };
      getStorage()?.removeItem('card');
    },
  },
});

export const {
  loadProductsToCart,
  addToCart,
  removeFromCart,
  changeQuantityById,
  addCardInfo,
  loadCardinfo,
  clearCart,
  clearCard,
} = transactionSlice.actions;

export default transactionSlice.reducer;
