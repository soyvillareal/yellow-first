import { MutableRefObject } from 'react';

import { IFormFieldsRefObj } from '../FancyCard.types';

export interface ICardProps {
  cardHolder: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  isCardFlipped: boolean;
  currentFocusedElm:
    | MutableRefObject<HTMLLabelElement | HTMLDivElement | undefined>
    | undefined;
  onCardElementClick: (key: keyof IFormFieldsRefObj) => void;
  cardNumberRef: MutableRefObject<HTMLLabelElement | undefined>;
  cardHolderRef: MutableRefObject<HTMLLabelElement | undefined>;
  cardDateRef: MutableRefObject<HTMLDivElement | undefined>;
}
