import { TFunction } from 'i18next';
import { CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/20/solid';

import SpinnerLoading from '@components/atoms/SpinnerLoading';
import { ETransactionStatus } from '@helpers/types';

import { TMessageByStatus } from './Transaction.types';

export const messageByStatus = (t: TFunction): TMessageByStatus => {
  return {
    [ETransactionStatus.PENDING]: {
      icon: <SpinnerLoading className="size-16 mb-4" color="#17a555" />,
      title: (
        <p className="text-gray-100">{t('transaction.verifyingTransaction')}</p>
      ),
    },
    [ETransactionStatus.APPROVED]: {
      icon: <CheckCircleIcon className="size-16 mb-4 text-green-700" />,
      title: t('transaction.succesfulTransaction'),
    },
    [ETransactionStatus.DECLINED]: {
      icon: <NoSymbolIcon className="size-16 mb-4 text-rose-700" />,
      title: t('transaction.somethingWentWrongWithYourPayment'),
      errorMessage: t(
        'transaction.error.itLooksLikeThereWasProblemWithYouPayment',
      ),
    },
    [ETransactionStatus.VOIDED]: {
      icon: <NoSymbolIcon className="size-16 mb-4 text-rose-700" />,
      title: t('transaction.transactionCanceled'),
      errorMessage: t('transaction.error.yourTransactionHasBeenCancelled'),
    },
  };
};
