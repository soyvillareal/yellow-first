import { Outlet } from 'react-router-dom';

import Navbar from '@components/shop/Navbar';

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] relative py-4 px-4 xl:px-24 mt-[80px]">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
