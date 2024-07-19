import { useEffect } from "react";
import { Link } from "react-router-dom";

import { selectCartTransaction } from "@helpers/features/transaction/transaction.selector";
import useAppSelector from "@hooks/redux/useAppSelector";

import CartCard from "../../components/cart/CartCard";
import CartCheckoutDetails from "../../components/cart/CartCheckoutDetails";

const Cart = () => {
  const selectedCartTransaction = useAppSelector(selectCartTransaction);

  useEffect(() => {
    document.title = "Cart | The Book Shelf";
  }, []);
  return (
    <div className="mt-40 sm:mt-20 ">
      <h1 className="my-4 font-bold tracking-tight text-center text-gray-100 md:text-xl lg:text-4xl">
        Cart Items
      </h1>
      {selectedCartTransaction.length > 0 && (
        <div className="justify-center max-w-5xl px-6 mx-auto md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {selectedCartTransaction.map((product) => (
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
      )}
      {selectedCartTransaction.length === 0 && (
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

            <Link
              to="/wishlist"
              className="w-full px-5 block py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
            >
              Add From Wishlist
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
