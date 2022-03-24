import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/base/Header';
import { MenuIcon } from '../../assets/svg';
import MobileBottom from '../../components/base/MobileBottom';
import Sidebar from '../../components/base/Sidebar';
import Logo from '../../components/base/Logo';

function HomeContainer(): JSX.Element {
  const [showMenu, setShowMenu] = React.useState(false);

  const onShowMenu = () => {
    setShowMenu(true);
  };
  const onDisableMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className='flex flex-col bg-[#14477E] min-h-screen'>
      {/* <Header /> */}
      <Outlet />
      <MobileBottom />
      {/* {showMenu && (
        <div className='h-screen w-screen absolute z-50 hidden sm:flex lg:hidden' onClick={onDisableMenu}>
          <div className='basis-1/3 h-full bg-cyan-700 pt-10'>
            <div className='justify-center w-full flex mb-4'>
              <Logo />
            </div>
            <Sidebar />
          </div>
        </div>
      )} */}
    </div>
  );
}

export default HomeContainer;
