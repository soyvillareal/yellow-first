import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  selectCard,
  selectCartTransaction,
} from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import { getTotalAmount, numberWithCurrency } from '@helpers/constants';
import CardDialog from '@components/headlessUI/CardDialog';
import ButtonLoading from '@components/headlessUI/ButtonLoading';
import CustomButton from '@components/headlessUI/CustomButton';
import { usePaymentMutation } from '@helpers/features/transaction/transaction.api';
import { clearCard } from '@helpers/features/transaction/transaction.slice';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import Address from '@components/shop/Address';
import CustomSelect from '@components/headlessUI/CustomSelect';

import CardInfo from '../CardInfo';
import MobileCheckoutDetails from '../MobileCheckoutDetails';
import { validInstallments } from './CartCheckoutDetailts.constants';
import CardConfig from '../CardConfig';

const CartCheckoutDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [installments, setInstallments] = useState(validInstallments[0].value);
  const selectedCartTransaction = useAppSelector(selectCartTransaction);
  const selectedCard = useAppSelector(selectCard);

  const [totalAmount, setTotalAmount] = useState(0);

  const [payment, { isLoading: isLoadingPayment }] = usePaymentMutation();

  const handleClickPayment = useCallback(() => {
    (async () => {
      try {
        if (selectedCard.cardInfo?.tokenId === undefined) {
          return toast.error(t('cart.error.plaseSelectCard'));
        }

        const paymentResponse = await payment({
          tokenId: selectedCard.cardInfo?.tokenId,
          products: selectedCartTransaction.products.map((product) => ({
            id: product.id,
            quantity: product.quantity || 1,
          })),
          installments,
        }).unwrap();

        if (paymentResponse.statusCode === 200) {
          navigate(`/transaction/${paymentResponse.data?.transactionId}`);
        } else {
          toast.error(t('cart.error.paymentNotSuccessful'));
        }
      } catch (error) {
        toast.error(t('cart.error.paymentNotSuccessful'));
      }
    })();
  }, [
    t,
    payment,
    navigate,
    installments,
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

  const handleChangeInstallments = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInstallments(Number(e.target.value));
    },
    [],
  );

  return (
    <>
      {showModal === false && (
        <MobileCheckoutDetails
          handleClickPayWithCard={handleClickPayWithCard}
          handleClickPayment={handleClickPayment}
          isLoadingPayment={isLoadingPayment}
        />
      )}
      <div id="checkoutDetails" className="relative mb-20 lg:w-1/3">
        <div className="sticky left-0 right-0 w-full min-w-[330px] p-6 mt-6 border rounded-lg shadow-md top-40 md:mt-0">
          <div className="mb-6">
            <span className="text-white font-bold text-xl">
              {t('cart.purchaseSummary')}
            </span>
          </div>
          <hr className="my-4 -mx-6" />
          <Address />
          <hr className="my-4" />
          {selectedCartTransaction.products.length > 0 &&
            selectedCartTransaction.products.map(
              ({ id, name, price, quantity }) => (
                <div
                  key={id}
                  title={name}
                  className="flex justify-between mb-2"
                >
                  <p className="w-40 text-gray-100 truncate">{name}</p>{' '}
                  <span className="text-gray-600">X {quantity} </span>
                  <p className="text-gray-400 before:mr-1">
                    {numberWithCurrency(price)}
                  </p>
                </div>
              ),
            )}

          {selectedCard.cardInfo !== null && (
            <>
              <hr className="my-4" />
              <div className="flex justify-between mb-2">
                <p className="text-gray-100 leading-[36px]">
                  {t('cart.installments')}
                </p>
                <CustomSelect
                  id="installments"
                  className="w-1/6"
                  options={validInstallments}
                  onChange={handleChangeInstallments}
                  value={installments}
                />
              </div>
            </>
          )}
          <hr className="my-4" />
          <div className="flex justify-between mb-2">
            <p className="text-gray-100">{t('cart.subTotal')}</p>
            <p className="text-gray-400 before:mr-1">
              {numberWithCurrency(totalAmount)}
            </p>
          </div>
          <CardConfig totalAmount={totalAmount} />
          {selectedCard.cardInfo === null ? (
            <CustomButton onClick={handleClickPayWithCard} variant="default">
              {t('cart.payWithCard')}
            </CustomButton>
          ) : (
            <ButtonLoading
              onClick={handleClickPayment}
              variant="payment"
              loading={isLoadingPayment}
            >
              {t('cart.pay')}
            </ButtonLoading>
          )}
          {selectedCard.cardInfo === null && (
            <CardDialog onClose={() => setShowModal(false)} open={showModal} />
          )}
          <CardInfo handleClickEditCard={handleClickEditCard} />
        </div>
      </div>
    </>
  );
};

export default CartCheckoutDetails;
