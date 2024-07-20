import { ChangeEvent, LegacyRef, PropsWithChildren, useState } from 'react';
import { Field, Label } from '@headlessui/react';

import InputLabel from '@components/headlessUI/Form/InputLabel';
import SelectLabel from '@components/headlessUI/Form/SelectLabel';

import { ICFormProps } from './CForm.types';
import { IFancyCardInitialState } from '../FancyCard.types';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (_x, i) => {
  const month = i + 1;
  return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

export default function CForm({
  cardMonth,
  cardYear,
  onUpdateState,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
  onCardInputFocus,
  onCardInputBlur,
  cardCvv,
  children,
  buttons,
}: PropsWithChildren<ICFormProps>) {
  const [cardNumber, setCardNumber] = useState('');
  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    onUpdateState(name as keyof IFancyCardInitialState, value);
  };
  // TODO: We can improve the regex check with a better approach like in the card component.
  const onCardNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;
    let cardNumber = value;
    value = value.replace(/\D/g, '');
    if (/^3[47]\d{0,13}$/.test(value)) {
      cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
      // diner's club, 14 digits
      cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^\d{0,16}$/.test(value)) {
      // regular cc number, 16 digits
      cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    }

    setCardNumber(cardNumber.trimRight());
    onUpdateState(name as keyof IFancyCardInitialState, cardNumber);
  };

  const onCvvFocus = () => {
    onUpdateState('isCardFlipped', true);
  };

  const onCvvBlur = () => {
    onUpdateState('isCardFlipped', false);
  };

  return (
    <div className="max-w-2xl m-auto w-full ">
      <div className="-mb-36">{children}</div>
      <div className="pt-44 bg-base-300 pb-2 rounded-xl space-y-4">
        <InputLabel
          ref={cardNumberRef as LegacyRef<HTMLInputElement>}
          id="cardNumber"
          className="input w-full px-4"
          type="tel"
          name="cardNumber"
          autoComplete="off"
          onChange={onCardNumberChange}
          maxLength={19}
          onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
          onBlur={onCardInputBlur}
          value={cardNumber}
          label="Card Number"
        />
        <InputLabel
          ref={cardHolderRef as LegacyRef<HTMLInputElement>}
          id="cardHolder"
          name="cardHolder"
          type="text"
          className="input w-full px-4"
          autoComplete="off"
          onChange={handleFormChange}
          onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
          onBlur={onCardInputBlur}
          label="Card Holder"
        />

        <div className="flex gap-2 justify-between px-4">
          <Field className="w-3/4">
            <Label
              htmlFor="cardMonth"
              className="text-sm/6 font-medium text-white px-4"
            >
              Expiration Date
            </Label>
            <div className="flex">
              <SelectLabel
                ref={cardDateRef as LegacyRef<HTMLInputElement>}
                id="cardMonth"
                className="select w-full"
                name="cardMonth"
                value={cardMonth}
                onChange={handleFormChange}
                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                onBlur={onCardInputBlur}
                options={monthsArr.map((val) => ({
                  label: val.toString(),
                  value: val,
                }))}
              />
              <SelectLabel
                id="cardYear"
                className="select w-full px-4"
                name="cardYear"
                value={cardYear}
                onChange={handleFormChange}
                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                onBlur={onCardInputBlur}
                options={yearsArr.map((val) => ({
                  label: val.toString(),
                  value: val,
                }))}
              />
            </div>
          </Field>
          <div className="w-1/4">
            <InputLabel
              ref={cardCvv}
              id="cardCvv"
              className="input w-full pr-4"
              type="tel"
              name="cardCvv"
              maxLength={4}
              autoComplete="off"
              onChange={handleFormChange}
              onFocus={onCvvFocus}
              onBlur={onCvvBlur}
              label="CVV"
            />
          </div>
        </div>
        {buttons}
      </div>
    </div>
  );
}
