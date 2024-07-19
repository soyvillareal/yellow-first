import { TTransactionCart } from "./features/transaction/transaction.types";
import { getStorage } from "./storage";

export const currencySite = "COP";

export const getJWT = () => {
  const session = getStorage()?.getItem("session");

  if (session) {
    return JSON.parse(session).jwt;
  }

  return null;
};

export const numberWithCurrency = (amount: string | number): string => {
  let amountNumber = amount as number;
  if (typeof amount === "string") {
    amountNumber = parseInt(amount);
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
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

export const fixedRate = 900; // in COP
export const variablePercentage = 0.029; // 2.9%

export const calculateRate = (amount: number) => {
  const variableRate = amount * fixedRate;
  const totalRate = variablePercentage + variableRate;
  return totalRate;
};
