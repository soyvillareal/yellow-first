import {
  FocusEvent,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';

import Card from './Card';
import CForm from './CForm';
import {
  ICardElementsRefObj,
  IFancyCardInitialState,
  IFancyCardProps,
  IFormFieldsRefObj,
} from './FancyCard.types';

const initialState: IFancyCardInitialState = {
  cardNumber: '#### #### #### ####',
  cardHolder: 'FULL NAME',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
  isCardFlipped: false,
};

const FancyCard = ({ buttons }: IFancyCardProps) => {
  const [state, setState] = useState(initialState);
  const [currentFocusedElm, setCurrentFocusedElm] =
    useState<MutableRefObject<HTMLLabelElement | HTMLDivElement | undefined>>();

  const updateStateValues = useCallback(
    (keyName: keyof IFancyCardInitialState, value: string | boolean) => {
      setState({
        ...state,
        [keyName]: value || initialState[keyName],
      });
    },
    [state],
  );

  const formFieldsRefObj: IFormFieldsRefObj = {
    cardNumber: useRef<HTMLInputElement | undefined>(),
    cardHolder: useRef<HTMLInputElement | undefined>(),
    cardDate: useRef<HTMLInputElement | undefined>(),
    cardCvv: useRef(),
  };

  const focusFormFieldByKey = (key: keyof IFormFieldsRefObj) => {
    formFieldsRefObj[key].current?.focus();
  };

  const cardElementsRef: ICardElementsRefObj = {
    cardNumber: useRef<HTMLLabelElement | undefined>(),
    cardHolder: useRef<HTMLLabelElement | undefined>(),
    cardDate: useRef<HTMLDivElement | undefined>(),
  };

  const onCardFormInputFocus = (
    _event: FocusEvent<HTMLSelectElement | HTMLInputElement>,
    inputName: keyof ICardElementsRefObj,
  ) => {
    const refByName = cardElementsRef[inputName];
    setCurrentFocusedElm(refByName);
  };

  const onCardInputBlur = useCallback(() => {
    setCurrentFocusedElm(undefined);
  }, []);

  return (
    <CForm
      cardMonth={state.cardMonth}
      cardYear={state.cardYear}
      onUpdateState={updateStateValues}
      cardNumberRef={formFieldsRefObj.cardNumber}
      cardHolderRef={formFieldsRefObj.cardHolder}
      cardDateRef={formFieldsRefObj.cardDate}
      onCardInputFocus={onCardFormInputFocus}
      onCardInputBlur={onCardInputBlur}
      buttons={buttons}
    >
      <Card
        cardNumber={state.cardNumber}
        cardHolder={state.cardHolder}
        cardMonth={state.cardMonth}
        cardYear={state.cardYear}
        cardCvv={state.cardCvv}
        isCardFlipped={state.isCardFlipped}
        currentFocusedElm={currentFocusedElm}
        onCardElementClick={focusFormFieldByKey}
        cardNumberRef={cardElementsRef.cardNumber}
        cardHolderRef={cardElementsRef.cardHolder}
        cardDateRef={cardElementsRef.cardDate}
      ></Card>
    </CForm>
  );
};

export default FancyCard;
