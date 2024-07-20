import { Route, Routes } from 'react-router-dom';

import useSession from '@hooks/custom/useSession';
import useAppSelector from '@hooks/redux/useAppSelector';
import { selectIsSessionLoading } from '@helpers/features/session/session.selector';
import ItemContainer from 'layouts/ItemContainer';

import RootLayout from './layouts/RootLayout';
import CanActivate from './helpers/middlewares/CanActivate';
import Products from './pages/Products';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ThankYou from './pages/ThankYou';
import PageNotFound from './pages/PageNotFound';

function App() {
  const selectedIsSessionLoading = useAppSelector(selectIsSessionLoading);

  useSession();

  return (
    <ItemContainer loading={selectedIsSessionLoading}>
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
    </ItemContainer>
  );
}

export default App;
