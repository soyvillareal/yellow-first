import { Outlet } from 'react-router-dom';

import Navbar from '../components/shop/Navbar';

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
