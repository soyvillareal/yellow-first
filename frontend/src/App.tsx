import { Route, Routes } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import ProductLayout from "./layouts/ProductLayout";

import CanActivate from "./components/routegurad/CanActivate";

import Products from "./pages/products/Products";
import Login from "./pages/login/Login";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import ThankYou from "./pages/thank-you/ThankYou";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import useSession from "@hooks/custom/useSession";

function App() {

  useSession();

  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Products />} />
          <Route path="login" element={<Login />} />
          <Route
            path="cart"
            element={
              <CanActivate>
                <Cart />
              </CanActivate>
            }
          />
          <Route
            path="checkout"
            element={
              <CanActivate>
                <Checkout />
              </CanActivate>
            }
          />
          <Route
            path="thank-you"
            element={
              <CanActivate>
                <ThankYou />
              </CanActivate>
            }
          />
          <Route path="products" element={<ProductLayout />}>
            <Route index element={<Products />} />
            <Route path=":category" element={<Products />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
