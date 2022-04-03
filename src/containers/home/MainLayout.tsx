import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileBottom from '../../components/base/MobileBottom';

function MainLayout(): JSX.Element {
  return (
    <div className='flex flex-col bg-[#14477E] min-h-screen'>
      <Outlet />
      <MobileBottom />
    </div>
  );
}

export default MainLayout;
