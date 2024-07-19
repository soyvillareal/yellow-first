import { useEffect } from "react";
import CartCheckoutDetails from "../../components/cart/CartCheckoutDetails";
import Address from "../../components/address/Address";

const Checkout = () => {
  useEffect(() => {
    document.title = "Checkout | The Book Shelf";
  }, []);
  return (
    <div className="py-32">
      <h1 className="my-4 font-bold tracking-tight text-center text-gray-100 md:text-xl lg:text-4xl">
        Checkout
      </h1>
      <div className="justify-center max-w-5xl px-6 mx-auto md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          <Address />
        </div>
        <CartCheckoutDetails />
      </div>
    </div>
  );
};

export default Checkout;
