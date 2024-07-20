import { Route, Routes } from 'react-router-dom';

import useSession from '@hooks/custom/useSession';
import useAppSelector from '@hooks/redux/useAppSelector';
import { selectIsSessionLoading } from '@helpers/features/session/session.selector';
import Loader from '@components/loader/Loader';

import RootLayout from './layouts/RootLayout';
// import ProductLayout from "./layouts/ProductLayout";
import CanActivate from './components/routegurad/CanActivate';
import Products from './pages/products/Products';
import Login from './pages/login/Login';
import Cart from './pages/cart/Cart';
import ThankYou from './pages/thank-you/ThankYou';
import PageNotFound from './pages/pageNotFound/PageNotFound';

function App() {
  const selectedIsSessionLoading = useAppSelector(selectIsSessionLoading);

  useSession();

  return selectedIsSessionLoading ? (
    <Loader />
  ) : (
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
            path="thank-you"
            element={
              <CanActivate>
                <ThankYou />
              </CanActivate>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
