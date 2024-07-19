import { useCallback, useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { IGetProductsResponse } from "@helpers/features/product/product.types";
import useAppDispatch from "@hooks/redux/useAppDispatch";
import {
  changeQuantityById,
  removeFromCart,
} from "@helpers/features/transaction/transaction.slice";
import useAppSelector from "@hooks/redux/useAppSelector";
import { selectQuantityTransactionById } from "@helpers/features/transaction/transaction.selector";

const CartCard = ({
  id,
  name,
  description,
  image,
  price,
  stock,
}: IGetProductsResponse) => {
  const dispatch = useAppDispatch();
  const selectedQuantityTransactionById = useAppSelector(
    selectQuantityTransactionById(id)
  );

  const handleClickRemoveFromCart = useCallback(() => {
    dispatch(removeFromCart(id));
  }, [dispatch, id]);

  const handleClickDecrementQuantity = useCallback(() => {
    dispatch(
      changeQuantityById({
        id,
        type: "decrement",
      })
    );
  }, [dispatch, id]);

  const handleClickIncrementQuantity = useCallback(() => {
    dispatch(
      changeQuantityById({
        id,
        type: "increment",
      })
    );
  }, [dispatch, id]);

  const isDisableDecrease = useMemo(() => {
    return stock <= 1 || selectedQuantityTransactionById === 1;
  }, [stock, selectedQuantityTransactionById]);

  const isDisableIncrease = useMemo(() => {
    return stock <= 1 || selectedQuantityTransactionById === stock;
  }, [stock, selectedQuantityTransactionById]);

  return (
    <div
      id={id}
      className="flex flex-col justify-between p-6 mb-6 border-b border-gray-700 sm:flex-row hover:rounded-lg hover:bg-gray-800 sm:justify-start"
    >
      <img
        className="self-center w-32 h-48 sm:h-40 sm:w-18"
        src={image}
        alt={name}
      />
      <div className="relative">
        <div className="absolute bottom-0 items-center space-y-2 text-gray-100 right-16 sm:hidden">
          <TrashIcon
            onClick={handleClickRemoveFromCart}
            title="Remove From Cart"
            className="w-8 h-8 p-2 text-red-400 duration-150 bg-red-100 rounded-full cursor-pointer opacity-80 hover:text-red-500"
          />
        </div>
      </div>
      <div className="flex flex-col items-center sm:items-start sm:flex-row sm:ml-4 sm:w-full sm:justify-between">
        <div className="flex flex-col justify-between mt-5 align-center sm:mt-0">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-lg font-bold text-gray-100 lg:text-xl">
              {name}
            </h2>
            <p className="mt-1 text-xs text-gray-200 sm:text-sm">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-center mt-4 space-x-4 text-gray-100 sm:flex-row">
            <p className="text-xl before:mr-1 font-bold sm:text-2xl">{price}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between mt-4 sm:space-y-6 sm:mt-0 sm:block">
          <div className="flex items-center justify-center text-gray-100 bg-gray-800 border border-gray-700 rounded w-min">
            <button
              onClick={handleClickDecrementQuantity}
              type="button"
              disabled={isDisableDecrease}
              className={`
               rounded-l
                py-1
                 px-3.5 
                 duration-100
                  hover:bg-gray-900
                   hover:text-white
                   ${
                     isDisableDecrease ? "cursor-not-allowed" : "cursor-pointer"
                   }
                   ${isDisableDecrease ? "bg-gray-700" : ""}
                   `}
            >
              -
            </button>
            <span className="w-8 text-xs text-center text-gray-100 outline-none cursor-default">
              {selectedQuantityTransactionById}
            </span>
            <button
              disabled={isDisableIncrease}
              onClick={handleClickIncrementQuantity} // changeQuantity(product, "increment")
              type="button"
              className={`px-3 py-1 duration-100 rounded-r  ${
                isDisableIncrease ? "cursor-not-allowed " : "cursor-pointer"
              } hover:text-white hover:bg-gray-900 `}
            >
              +
            </button>
          </div>

          {/* For Desktop */}
          <div className="relative items-center hidden space-x-4 text-gray-100 sm:flex">
            <TrashIcon
              onClick={handleClickRemoveFromCart}
              title="Remove From Cart"
              className="w-8 h-8 p-2 text-red-400 duration-150 bg-gray-800 border border-gray-700 rounded-full cursor-pointer hover:text-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
