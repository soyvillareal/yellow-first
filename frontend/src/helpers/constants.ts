import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TTransactionCart } from './features/transaction/transaction.types';
import { getStorage } from './storage';

export const currencySite = 'COP';

const CARDS = {
  visa: '^4',
  amex: '^(34|37)',
  mastercard: '^5[1-5]',
  discover: '^6011',
  unionpay: '^62',
  troy: '^9792',
  diners: '^(30[0-5]|36)',
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getJWT = () => {
  const session = getStorage()?.getItem('session');

  if (session) {
    return JSON.parse(session).jwt;
  }

  return null;
};

export const numberWithCurrency = (amount: string | number): string => {
  let amountNumber = amount as number;
  if (typeof amount === 'string') {
    amountNumber = parseInt(amount);
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currencySite,
  }).format(amountNumber);
};

export const getTotalAmount = (items: TTransactionCart[]): number => {
  const total = items.reduce((totalAmount, item) => {
    const priceNumber = parseInt(item.price);
    const quantity = item.quantity || 1;

    return priceNumber * quantity + totalAmount;
  }, 0);
  return total;
};

export const fixedRate = 900.0; // in COP
export const variablePercentage = 0.029; // 2.9%

export const calculateRate = (amount: number) => {
  const variableRate = fixedRate + amount;

  const totalRate = (variableRate / 100) * variablePercentage * 100;

  return amount + totalRate;
};

export const cardType = (cardNumber: string) => {
  const number = cardNumber;
  let re;
  for (const [card, pattern] of Object.entries(CARDS)) {
    re = new RegExp(pattern);
    if (number.match(re) != null) {
      return card;
    }
  }
  return 'visa';
};
