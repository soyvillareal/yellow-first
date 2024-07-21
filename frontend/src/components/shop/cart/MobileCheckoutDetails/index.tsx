import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  selectCard,
  selectCartTransaction,
} from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import {
  calculateRate,
  cn,
  fixedRate,
  getTotalAmount,
  numberWithCurrency,
  variablePercentage,
} from '@helpers/constants';
import CustomButton from '@components/headlessUI/CustomButton';
import ButtonLoading from '@components/headlessUI/ButtonLoading';

import { IMobileCheckoutDetailsProps } from './MobileCheckoutDetails.types';

const MobileCheckoutDetails = ({
  handleClickPayWithCard,
  handleClickPayment,
  isLoadingPayment,
}: IMobileCheckoutDetailsProps) => {
  const { t } = useTranslation();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const selectedCartTransaction = useAppSelector(selectCartTransaction);
  const selectedCard = useAppSelector(selectCard);

  useEffect(() => {
    const checkoutDetails = document.getElementById('checkoutDetails');
    const handleScroll = () => {
      if (checkoutDetails) {
        const bottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - checkoutDetails.scrollHeight;
        setIsAtBottom(bottom);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTotalAmount(getTotalAmount(selectedCartTransaction.products));
  }, [selectedCartTransaction]);

  return (
    <div
      id="checkoutDetailsMobile"
      className={cn(
        'block md:hidden fixed bottom-0 -ml-4 w-full bg-gray-900 transition-all duration-300 ease-in-out z-30',
        isAtBottom ? 'transform translate-x-full' : 'transform translate-x-0',
      )}
    >
      <div className="sticky left-0 right-0 w-full min-w-[330px] p-6 border rounded-lg shadow-md top-40 md:mt-0">
        <div className="mb-6">
          <span className="text-white font-bold text-xl">
            {t('cart.purchaseSummary')}
          </span>
        </div>
        <hr className="my-4 mx-[-24px]" />
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">{t('cart.subTotal')}</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">{t('cart.baseRate')}</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(fixedRate)} +{' '}
            {`${(variablePercentage * 100).toFixed(1)}%`}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">{t('cart.shippingFee')}</p>
          <p className="text-gray-100 before:mr-1">{numberWithCurrency(0)}</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-gray-100">
          <p className="text-lg font-bold">{t('cart.total')}</p>
          <div>
            <p className="mb-1 text-lg before:mr-1 font-bold">
              {numberWithCurrency(calculateRate(totalAmount))}
            </p>
          </div>
        </div>
        {selectedCard.cardInfo === null ? (
          <CustomButton onClick={handleClickPayWithCard} variant="default">
            {t('cart.payWithCard')}
          </CustomButton>
        ) : (
          <ButtonLoading
            className="mt-4"
            onClick={handleClickPayment}
            variant="payment"
            loading={isLoadingPayment}
          >
            {t('cart.pay')}
          </ButtonLoading>
        )}
      </div>
    </div>
  );
};

export default MobileCheckoutDetails;
