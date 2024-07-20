import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { isNotEmpty } from 'ramda-adjunct';
import moment from 'moment';

import Form from '@components/shop/Form';
import FancyCard from '@components/shop/FancyCard';
import { useCardTokenizeMutation } from '@helpers/features/transaction/transaction.api';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import { addCardInfo } from '@helpers/features/transaction/transaction.slice';
import { selectUserId } from '@helpers/features/session/session.selector';
import useAppSelector from '@hooks/redux/useAppSelector';

import { ICardDialogInputs, ICardDialogProps } from './CardDialog.types';
import ButtonLoading from '../ButtonLoading';

const CardDialog = ({ open, onClose }: ICardDialogProps) => {
  const dispatch = useAppDispatch();
  const [errorCode, setErrorCode] = useState('');

  const selectedUserId = useAppSelector(selectUserId);

  const methods = useForm<ICardDialogInputs>({
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      cardMonth: moment().format('MM'),
      cardYear: moment().format('YYYY'),
      cardCvv: '',
    },
  });

  const allFields = useWatch({ control: methods.control });

  const [cardTokenize, { isLoading: isLoadingCardTokenize }] =
    useCardTokenizeMutation();

  const onSubmit: SubmitHandler<ICardDialogInputs> = useCallback(
    async (data) => {
      try {
        const cardTokenized = await cardTokenize({
          number: data.cardNumber.replace(/\s/g, ''),
          cardHolder: data.cardHolder,
          expMonth: parseInt(data.cardMonth),
          expYear: parseInt(data.cardYear),
          cvc: data.cardCvv,
        }).unwrap();

        if (selectedUserId !== undefined && cardTokenized.data !== undefined) {
          dispatch(
            addCardInfo({
              userId: selectedUserId,
              cardInfo: {
                tokenId: cardTokenized.data.tokenId,
                brand: cardTokenized.data.brand,
                lastFour: cardTokenized.data.lastFour,
                expMonth: cardTokenized.data.expMonth,
                expYear: cardTokenized.data.expYear,
                cardHolder: cardTokenized.data.cardHolder,
                expiredAt: moment().add(10, 'minutes').toString(),
              },
            }),
          );
        } else {
          setErrorCode('tokenizationError');
        }
      } catch (error) {
        setErrorCode('tokenizationError');
      }
    },
    [dispatch, cardTokenize, selectedUserId],
  );

  useEffect(() => {
    setErrorCode('');
  }, [allFields]);

  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-40 focus:outline-none"
      onClose={onClose}
      __demoMode
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <Form
          className="flex min-h-full items-center justify-center p-4"
          methods={methods}
          onSubmit={onSubmit}
        >
          <DialogPanel
            transition
            className="w-full max-w-lg rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 px-2 pb-4 font-medium text-white"
            >
              Card information
            </DialogTitle>
            <div className="flex">
              <FancyCard
                buttons={
                  <div className="flex items-center justify-center gap-4 pt-4 w-full">
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700"
                      onClick={onClose}
                    >
                      Cancelar
                    </Button>
                    <ButtonLoading
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                      loading={isLoadingCardTokenize}
                      variant="dialog"
                    >
                      Agregar tarjeta
                    </ButtonLoading>
                  </div>
                }
              />
            </div>
            {isNotEmpty(errorCode) && (
              <p className="mt-2 text-sm text-center text-red-600">
                Esta tarjeta no es válida, por favor intenta con otra.
              </p>
            )}
          </DialogPanel>
        </Form>
      </div>
    </Dialog>
  );
};

export default CardDialog;
