import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { selectCartTransaction } from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import { selectUserId } from '@helpers/features/session/session.selector';
import CartCard from '@components/shop/cart/CartCard';
import CartCheckoutDetails from '@components/shop/cart/CartCheckoutDetails';
import PageContainer from 'layouts/PageContainer';

const Cart = () => {
  const { t } = useTranslation();
  const selectedCartTransaction = useAppSelector(selectCartTransaction);
  const selectedUserId = useAppSelector(selectUserId);

  return (
    <PageContainer
      seo={{
        title: t('SEO.cart.title'),
        subtitle: t('SEO.cart.subtitle'),
        description: t('SEO.cart.description'),
      }}
    >
      {selectedCartTransaction.userId === selectedUserId &&
      selectedCartTransaction.products.length > 0 ? (
        <div className="flex flex-col md:flex-row justify-center max-w-6xl sm:px-6 mx-auto md:space-x-6 xl:px-0">
          <div className="rounded-lg lg:w-2/3">
            {selectedCartTransaction.products.map((product) => (
              <CartCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                stock={product.stock}
              />
            ))}
          </div>
          <CartCheckoutDetails />
        </div>
      ) : (
        <div className="grid h-60 place-items-center">
          <div className="space-y-4">
            <p className="my-4 text-2xl font-semibold tracking-wide text-gray-100">
              {t('cart.cartIsEmpty')}
            </p>
            <Link
              to="/"
              className="w-full px-5 block py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
            >
              {t('cart.shopNow')}
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Cart;
