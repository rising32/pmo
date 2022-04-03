import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/base/Header';
import { MenuIcon } from '../../assets/svg';
import MobileBottom from '../../components/base/MobileBottom';
import Sidebar from '../../components/base/Sidebar';
import Logo from '../../components/base/Logo';

function MainLayout(): JSX.Element {
  return (
    <div className='flex flex-col bg-[#14477E] min-h-screen'>
      <Outlet />
      <MobileBottom />
    </div>
  );
}

export default MainLayout;
