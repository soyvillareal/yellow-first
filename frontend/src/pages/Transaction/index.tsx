import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import CustomButton from '@components/headlessUI/CustomButton';
import { subscribeToTransactionUpdates } from '@helpers/sockets/transactions';
import { ISubscribeToTransactionUpdates } from '@helpers/sockets/sockets.types';
import { ETransactionStatus } from '@helpers/types';
import { cn, numberWithCurrency } from '@helpers/constants';
import { useLazyGetTransactionByIdQuery } from '@helpers/features/transaction/transaction.api';
import {
  clearCard,
  clearCart,
} from '@helpers/features/transaction/transaction.slice';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import PageContainer from 'layouts/PageContainer';

import { messageByStatus } from './Transaction.contants';

const Transaction = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { transactionId } = useParams();
  const [transactionData, setTransactionData] =
    useState<ISubscribeToTransactionUpdates | null>(null);
  const navigate = useNavigate();

  const [
    getTransactionById,
    { data: dataGetTransactionById, isLoading: isLoadingGetTransactionById },
  ] = useLazyGetTransactionByIdQuery();

  useEffect(() => {
    subscribeToTransactionUpdates((transaction) => {
      setTransactionData(transaction);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (transactionId === undefined) {
          navigate('/404');
          return;
        }
        await getTransactionById({
          transactionId,
        }).unwrap();

        dispatch(clearCart());
        dispatch(clearCard());
      } catch (error) {
        navigate('/404');
      }
    })();
  }, [getTransactionById, dispatch, navigate, transactionId]);

  const handleClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const transactionIsPending = useMemo(() => {
    return (
      (transactionData === null ||
        transactionData?.status === ETransactionStatus.PENDING) &&
      dataGetTransactionById?.data?.status === ETransactionStatus.PENDING
    );
  }, [transactionData, dataGetTransactionById]);

  const transactionStatus: ETransactionStatus = useMemo(() => {
    if (dataGetTransactionById?.data?.status !== ETransactionStatus.PENDING) {
      return dataGetTransactionById?.data?.status || ETransactionStatus.PENDING;
    }
    return transactionData?.status || ETransactionStatus.PENDING;
  }, [transactionData, dataGetTransactionById]);

  const transactionMessages = useMemo(() => {
    if (transactionData === null && dataGetTransactionById?.data?.status) {
      return messageByStatus(t)[dataGetTransactionById?.data?.status];
    } else if (transactionData) {
      return messageByStatus(t)[
        transactionData.status || ETransactionStatus.PENDING
      ];
    }
    return messageByStatus(t)[ETransactionStatus.PENDING];
  }, [t, transactionData, dataGetTransactionById?.data?.status]);

  return (
    <PageContainer
      seo={{
        title: t('SEO.transaction.title'),
        subtitle: t('SEO.transaction.subtitle'),
        description: t('SEO.transaction.description'),
      }}
      loading={isLoadingGetTransactionById}
    >
      <div className="md:px-6 isolate pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="max-w-2xl py-32 mx-auto sm:py-32 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center">
              {transactionMessages.icon}
            </div>
            <h1
              className={cn(
                'text-2xl sm:text-4xl text-gradient-to-tr opacity-80 font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-tr from-[#ff4694] to-[#776fff]',
                [
                  ETransactionStatus.DECLINED,
                  ETransactionStatus.VOIDED,
                ].includes(transactionStatus) === true
                  ? 'sm:text-10xl'
                  : 'sm:text-5xl',
              )}
            >
              {transactionMessages.title}
            </h1>
            {transactionMessages.errorMessage && (
              <p className="mt-2 text-lg leading-8 text-rose-700">
                {transactionMessages.errorMessage}
              </p>
            )}
            <p className="mt-6 text-lg leading-8 text-gray-100">
              {t('transaction.amount', {
                replace: {
                  amount: numberWithCurrency(
                    dataGetTransactionById?.data?.amount || 0,
                  ),
                },
              })}
            </p>
            <div className="flex items-center justify-center mt-10 gap-x-6">
              <CustomButton
                className="w-full w-30 sm:w-1/4"
                onClick={handleClick}
                variant="primary"
                disabled={transactionIsPending}
              >
                {t('pageNotFound.backHome')}
              </CustomButton>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Transaction;
