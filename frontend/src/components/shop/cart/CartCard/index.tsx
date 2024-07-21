import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import { IGetProductsResponse } from '@helpers/features/product/product.types';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import {
  changeQuantityById,
  removeFromCart,
} from '@helpers/features/transaction/transaction.slice';
import useAppSelector from '@hooks/redux/useAppSelector';
import { selectQuantityTransactionById } from '@helpers/features/transaction/transaction.selector';
import { selectUserId } from '@helpers/features/session/session.selector';
import { cn, numberWithCurrency } from '@helpers/constants';

const CartCard = ({
  id,
  name,
  description,
  image,
  price,
  stock,
}: IGetProductsResponse) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedUserId = useAppSelector(selectUserId);
  const selectedQuantityTransactionById = useAppSelector(
    selectQuantityTransactionById(id),
  );

  const handleClickRemoveFromCart = useCallback(() => {
    if (selectedUserId !== undefined) {
      dispatch(
        removeFromCart({
          userId: selectedUserId,
          productId: id,
        }),
      );
    }
  }, [dispatch, id, selectedUserId]);

  const handleClickDecrementQuantity = useCallback(() => {
    if (selectedUserId !== undefined) {
      dispatch(
        changeQuantityById({
          userId: selectedUserId,
          productId: id,
          type: 'decrement',
        }),
      );
    }
  }, [dispatch, id, selectedUserId]);

  const handleClickIncrementQuantity = useCallback(() => {
    if (selectedUserId !== undefined) {
      dispatch(
        changeQuantityById({
          userId: selectedUserId,
          productId: id,
          type: 'increment',
        }),
      );
    }
  }, [dispatch, id, selectedUserId]);

  const isDisableDecrease = useMemo(() => {
    return stock <= 1 || selectedQuantityTransactionById === 1;
  }, [stock, selectedQuantityTransactionById]);

  const isDisableIncrease = useMemo(() => {
    return stock <= 1 || selectedQuantityTransactionById === stock;
  }, [stock, selectedQuantityTransactionById]);

  return (
    <div
      id={id}
      className="flex flex-row justify-start p-6 mb-6 border-b border-gray-700 hover:rounded-lg hover:bg-gray-800"
    >
      <img
        className="self-center w-14 h-38 lg:w-32 lg:h-48"
        src={image}
        alt={name}
      />
      <div className="flex flex-row justify-between items-start ml-4 w-full">
        <div className="flex flex-col justify-between align-center">
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold text-gray-100 lg:text-xl line-clamp-2">
              {name}
            </h2>
            <p className="lg:block hidden mt-1 text-sm text-gray-200">
              {description}
            </p>
          </div>
          <div className="flex flex-row items-center mt-1 lg:mt-4 space-x-4 text-gray-400">
            <p className="text-md lg:text-xl before:mr-1 font-bold">
              {numberWithCurrency(price)}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between mt-4 space-y-3 lg:space-y-6 mt-0 w-full h-full">
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center justify-center text-gray-100 bg-gray-800 border border-gray-700 rounded w-min">
              <button
                onClick={handleClickDecrementQuantity}
                type="button"
                disabled={isDisableDecrease}
                className={cn(
                  'rounded-l py-1 px-3.5 duration-100 hover:bg-gray-900 hover:text-white select-none',
                  isDisableDecrease
                    ? 'cursor-not-allowed bg-gray-700'
                    : 'cursor-pointer',
                )}
              >
                -
              </button>
              <span className="w-8 text-xs text-center text-gray-100 outline-none cursor-default">
                {selectedQuantityTransactionById}
              </span>
              <button
                disabled={isDisableIncrease}
                onClick={handleClickIncrementQuantity}
                type="button"
                className={cn(
                  'px-3 py-1 duration-100 rounded-r hover:text-white hover:bg-gray-900 select-none',
                  isDisableIncrease ? 'cursor-not-allowed ' : 'cursor-pointer',
                )}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex relative items-center justify-end space-x-4 text-gray-100">
            <TrashIcon
              onClick={handleClickRemoveFromCart}
              title={t('cart.removeFromCart')}
              className="w-8 h-8 p-2 text-red-400 duration-150 bg-gray-800 border border-gray-700 rounded-full cursor-pointer shadow-xl hover:text-white hover:bg-rose-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
