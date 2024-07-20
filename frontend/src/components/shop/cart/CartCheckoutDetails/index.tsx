import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  selectCard,
  selectCartTransaction,
} from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import {
  calculateRate,
  fixedRate,
  getTotalAmount,
  numberWithCurrency,
  variablePercentage,
} from '@helpers/constants';
import CardDialog from '@components/headlessUI/CardDialog';
import ButtonLoading from '@components/headlessUI/ButtonLoading';
import CustomButton from '@components/headlessUI/CustomButton';
import { usePaymentMutation } from '@helpers/features/transaction/transaction.api';
import {
  clearCard,
  clearCart,
} from '@helpers/features/transaction/transaction.slice';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import Address from '@components/shop/Address';

import CardInfo from '../CardInfo';

const CartCheckoutDetails = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const selectedCartTransaction = useAppSelector(selectCartTransaction);
  const selectedCard = useAppSelector(selectCard);

  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const [payment, { isLoading: isLoadingPayment }] = usePaymentMutation();

  const handleClickPayment = useCallback(() => {
    (async () => {
      try {
        if (selectedCard.cardInfo?.tokenId === undefined) {
          return toast.error('Por favor, seleccione una tarjeta');
        }

        const paymentResponse = await payment({
          tokenId: selectedCard.cardInfo?.tokenId,
          products: selectedCartTransaction.products.map((product) => ({
            id: product.id,
            quantity: product.quantity || 1,
          })),
          installments: 1,
        }).unwrap();

        if (paymentResponse.statusCode === 200) {
          toast.success('Pago exitoso');
          navigate('/');
          dispatch(clearCart());
          dispatch(clearCard());
        } else {
          toast.error('Pago fallido');
        }
      } catch (error) {
        toast.error('Pago fallido');
      }
    })();
  }, [
    payment,
    dispatch,
    navigate,
    selectedCard.cardInfo?.tokenId,
    selectedCartTransaction.products,
  ]);

  useEffect(() => {
    setTotalAmount(getTotalAmount(selectedCartTransaction.products));
  }, [selectedCartTransaction]);

  const handleClickPayWithCard = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleClickEditCard = useCallback(() => {
    setShowModal(true);
    dispatch(clearCard());
  }, [dispatch]);

  return (
    <div className="relative mb-20 lg:w-1/3">
      <div className="sticky left-0 right-0 w-full min-w-[330px] p-6 mt-6 border rounded-lg shadow-md top-40 md:mt-0">
        <div className="mb-6">
          <span className="text-white font-bold text-xl">
            {t('cart.purchaseSummary')}
          </span>
        </div>
        <hr className="my-4 mx-[-24px]" />
        <Address />
        <hr className="my-4" />
        {selectedCartTransaction.products.length > 0 &&
          selectedCartTransaction.products.map(
            ({ id, name, price, quantity }) => (
              <div key={id} title={name} className="flex justify-between mb-2">
                <p className="w-40 text-gray-100 truncate">{name}</p>{' '}
                <span className="text-gray-600">X {quantity} </span>
                <p className="text-gray-100 before:mr-1">
                  {numberWithCurrency(price)}
                </p>
              </div>
            ),
          )}

        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Subtotal</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Tarifa base</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(fixedRate)} +{' '}
            {`${(variablePercentage * 100).toFixed(1)}%`}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Tarifa de envío</p>
          <p className="text-gray-100 before:mr-1">{numberWithCurrency(0)}</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-gray-100">
          <p className="text-lg font-bold">Total</p>
          <div>
            <p className="mb-1 text-lg before:mr-1 font-bold">
              {numberWithCurrency(calculateRate(totalAmount))}
            </p>
          </div>
        </div>
        {selectedCard.cardInfo === null ? (
          <CustomButton onClick={handleClickPayWithCard} variant="default">
            Pagar con tarjeta
          </CustomButton>
        ) : (
          <ButtonLoading
            className="mt-4"
            onClick={handleClickPayment}
            variant="payment"
            loading={isLoadingPayment}
          >
            Pagar
          </ButtonLoading>
        )}
        {selectedCard.cardInfo === null && (
          <CardDialog onClose={() => setShowModal(false)} open={showModal} />
        )}
        <CardInfo handleClickEditCard={handleClickEditCard} />
      </div>
    </div>
  );
};

export default CartCheckoutDetails;
