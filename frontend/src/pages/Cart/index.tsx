import { Link } from 'react-router-dom';

import { selectCartTransaction } from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import { selectUserId } from '@helpers/features/session/session.selector';
import PageContainer from 'layouts/PageContainer';

import CartCard from '../../components/shop/cart/CartCard';
import CartCheckoutDetails from '../../components/shop/cart/CartCheckoutDetails';

const Cart = () => {
  const selectedCartTransaction = useAppSelector(selectCartTransaction);
  const selectedUserId = useAppSelector(selectUserId);

  return (
    <PageContainer
      seo={{
        title: 'Cart',
        subtitle: 'Your Cart',
        description: 'Your cart items.',
      }}
    >
      {selectedCartTransaction.userId === selectedUserId &&
      selectedCartTransaction.products.length > 0 ? (
        <div className="flex flex-col md:flex-row justify-center max-w-6xl px-6 mx-auto md:space-x-6 xl:px-0">
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
              Cart is Empty.
            </p>
            <Link
              to="/products"
              className="w-full px-5 block py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Cart;
