import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { selectCartTransaction } from "@helpers/features/transaction/transaction.selector";
import useAppSelector from "@hooks/redux/useAppSelector";
import {
  calculateRate,
  fixedRate,
  getTotalAmount,
  numberWithCurrency,
  variablePercentage,
} from "@helpers/constants";

const CartCheckoutDetails = () => {
  const selectedCartTransaction = useAppSelector(selectCartTransaction);

  const [totalAmount, setTotalAmount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setTotalAmount(getTotalAmount(selectedCartTransaction));
  }, [selectedCartTransaction]);

  const checkoutHandler = () => {
    if (location.pathname === "/cart") {
      navigate("/checkout");
    } else {
      // if (getAddress().length === 0) {
      //   toast.error("Please add a Primary Address to Proceed.");
      //   return;
      // }
    }
  };
  return (
    <div className="relative mb-20 sm:w-1/3">
      <div className="sticky left-0 right-0 w-full p-6 mt-6 border rounded-lg shadow-md top-40 md:mt-0">
        {selectedCartTransaction.length > 0 &&
          selectedCartTransaction.map(({ id, name, price, quantity }) => (
            <div key={id} title={name} className="flex justify-between mb-2">
              <p className="w-40 text-gray-100 truncate">{name}</p>{" "}
              <span className="text-gray-600">X {quantity} </span>
              <p className="text-gray-100 before:mr-1">
                {numberWithCurrency(price)}
              </p>
            </div>
          ))}

        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Subtotal</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Tarifa base</p>
          <p className="text-gray-100 before:mr-1">
            {numberWithCurrency(fixedRate)} +{" "}
            {`${(variablePercentage * 100).toFixed(1)}%`}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-100">Tarifa de envío</p>
          <p className="text-gray-100 before:mr-1">{numberWithCurrency(0)}</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-gray-100">
          <p className="text-lg font-bold">Total</p>
          <div>
            <p className="mb-1 text-lg before:mr-1 font-bold">
              {numberWithCurrency(calculateRate(totalAmount))}
            </p>
          </div>
        </div>
        <button
          onClick={checkoutHandler}
          className="mt-6 w-full px-5 py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
        >
          {location.pathname === "/cart" ? "Check Out" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CartCheckoutDetails;
