import { useTranslation } from 'react-i18next';
import { isNilOrEmpty } from 'ramda-adjunct';

import { calculateRate, numberWithCurrency } from '@helpers/constants';
import { useGetTransactionConfigQuery } from '@helpers/features/transaction/transaction.api';
import ItemContainer from '@layouts/ItemContainer';

import { ICardConfigProps } from './CardConfig.types';
import CardConfigSkeleton from './CardConfigSkeleton';

const CardConfig = ({ totalAmount }: ICardConfigProps) => {
  const { t } = useTranslation();

  const { data: dataTransactionConfig, isLoading: isLoadingTransactionConfig } =
    useGetTransactionConfigQuery();

  return (
    <ItemContainer
      skeletonElement={<CardConfigSkeleton />}
      loading={
        isLoadingTransactionConfig || isNilOrEmpty(dataTransactionConfig)
      }
    >
      <div className="flex justify-between mb-2">
        <p className="text-gray-100">{t('cart.baseRate')}</p>
        <p className="text-gray-100 before:mr-1">
          {numberWithCurrency(dataTransactionConfig?.data?.fixedRate || 0)} +{' '}
          {`${(
            (dataTransactionConfig?.data?.variablePercentage || 0) * 100
          ).toFixed(1)}%`}
        </p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-100">{t('cart.shippingFee')}</p>
        <p className="text-gray-100 before:mr-1">
          {numberWithCurrency(dataTransactionConfig?.data?.shippingFee || 0)}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex justify-between text-gray-100 mb-2">
        <p className="text-lg font-bold">{t('cart.total')}</p>
        <div>
          <p className="mb-1 text-lg before:mr-1 font-bold">
            {numberWithCurrency(
              calculateRate(dataTransactionConfig?.data, totalAmount),
            )}
          </p>
        </div>
      </div>
    </ItemContainer>
  );
};

export default CardConfig;
