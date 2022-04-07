import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/base/Header';
import { MenuSvg } from '../../assets/svg';
import MobileBottom from '../../components/base/MobileBottom';
import Sidebar from '../../components/base/Sidebar';
import Logo from '../../components/base/Logo';

function MainPage(): JSX.Element {
  const [showMenu, setShowMenu] = React.useState(false);

  const onShowMenu = () => {
    setShowMenu(true);
  };
  const onDisableMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className='flex flex-col h-screen bg-[#14477E]'>
      <Header />
      <div className='flex-1 flex flex-row'>
        <div className='basis-0 lg:basis-1/4 border-r border-[#828486] pt-10 hidden lg:flex'>
          <Sidebar />
        </div>
        <div className='hidden sm:flex lg:hidden px-8 pt-6'>
          <MenuSvg height={36} width={36} fill='#FFF' onClick={onShowMenu} />
        </div>
        <div className='basis-full lg:basis-3/4 justify-center flex'>
          <Outlet />
        </div>
      </div>
      <MobileBottom />
      {showMenu && (
        <div className='h-screen w-screen absolute z-50 hidden sm:flex lg:hidden' onClick={onDisableMenu}>
          <div className='basis-1/3 h-full bg-cyan-700 pt-10'>
            <div className='justify-center w-full flex mb-4'>
              <Logo />
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
