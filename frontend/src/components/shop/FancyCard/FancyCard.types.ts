import { MutableRefObject } from 'react';

export interface IFormFieldsRefObj {
  cardNumber: MutableRefObject<HTMLInputElement | undefined>;
  cardHolder: MutableRefObject<HTMLInputElement | undefined>;
  cardDate: MutableRefObject<HTMLInputElement | undefined>;
  cardCvv: MutableRefObject<HTMLInputElement | undefined>;
}

export interface ICardElementsRefObj {
  cardNumber: MutableRefObject<HTMLLabelElement | undefined>;
  cardHolder: MutableRefObject<HTMLLabelElement | undefined>;
  cardDate: MutableRefObject<HTMLDivElement | undefined>;
}

export interface IFancyCardInitialState {
  cardNumber: string;
  cardHolder: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  isCardFlipped: boolean;
}

export interface IFancyCardProps {
  buttons: React.ReactNode;
}
