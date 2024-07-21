import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';

import useAppDispatch from '@hooks/redux/useAppDispatch';
import { IGetProductsResponse } from '@helpers/features/product/product.types';
import { addToCart } from '@helpers/features/transaction/transaction.slice';
import useAppSelector from '@hooks/redux/useAppSelector';
import {
  selectIsUserLoggedIn,
  selectUserId,
} from '@helpers/features/session/session.selector';
import { selectCartTransaction } from '@helpers/features/transaction/transaction.selector';
import CustomButton from '@components/headlessUI/CustomButton';

const AddToCartButton = ({
  id,
  name,
  description,
  image,
  price,
  stock,
}: IGetProductsResponse) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedIsUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
  const selectedUserId = useAppSelector(selectUserId);
  const selectedCartTransaction = useAppSelector(selectCartTransaction);

  const navigate = useNavigate();
  const location = useLocation();

  const isInTheCart = useMemo(() => {
    return (
      selectedCartTransaction.userId === selectedUserId &&
      selectedCartTransaction.products.some((product) => product.id === id)
    );
  }, [selectedCartTransaction, id, selectedUserId]);

  const handleClickAddToCart = useCallback(() => {
    if (selectedIsUserLoggedIn === false) {
      toast.error(t('cart.error.logInToContinue'));
      navigate('/login', { state: { from: location } });
    } else if (selectedUserId !== undefined) {
      dispatch(
        addToCart({
          userId: selectedUserId,
          product: { id, name, description, image, price, stock },
        }),
      );
      if (isInTheCart === true) {
        navigate('/cart');
      }
    }
  }, [
    selectedIsUserLoggedIn,
    selectedUserId,
    t,
    navigate,
    location,
    dispatch,
    id,
    name,
    description,
    image,
    price,
    stock,
    isInTheCart,
  ]);

  return (
    <CustomButton
      id={id}
      type="button"
      onClick={handleClickAddToCart}
      variant="primary"
    >
      {isInTheCart && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="hidden w-6 h-6 mr-2 lg:inline-block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      )}
      <span className="uppercase">
        {t(`cart.${isInTheCart ? 'goToCart' : 'addToCart'}`)}
      </span>
    </CustomButton>
  );
};

export default AddToCartButton;
