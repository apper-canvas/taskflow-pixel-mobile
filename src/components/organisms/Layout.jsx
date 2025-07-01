import React from 'react';
import { Outlet } from 'react-router-dom';
import CategorySidebar from '@/components/organisms/CategorySidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <CategorySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;