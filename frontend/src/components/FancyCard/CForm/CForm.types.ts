import { FocusEvent, MutableRefObject } from 'react';

import {
  ICardElementsRefObj,
  IFancyCardInitialState,
} from '../FancyCard.types';

export interface ICFormProps {
  cardMonth: string;
  cardYear: string;
  onUpdateState: (
    keyName: keyof IFancyCardInitialState,
    value: string | boolean,
  ) => void;
  cardNumberRef: MutableRefObject<HTMLInputElement | undefined>;
  cardHolderRef: MutableRefObject<HTMLInputElement | undefined>;
  cardDateRef: MutableRefObject<HTMLInputElement | undefined>;
  onCardInputFocus: (
    event: FocusEvent<HTMLSelectElement | HTMLInputElement>,
    inputName: keyof ICardElementsRefObj,
  ) => void;
  onCardInputBlur: () => void;
  cardCvv?: string;
  buttons: React.ReactNode;
}
