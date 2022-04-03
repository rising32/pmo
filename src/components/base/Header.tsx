import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import Logo from './Logo';
import { useAuth } from '../../lib/context/AuthProvider';

function Header(): JSX.Element {
  const navigate = useNavigate();
  const { account } = useAuth();
  const goLogin = () => {
    navigate('/');
  };
  return (
    <div className='z-10 w-full border-[#828486] border-b items-center justify-between px-6 h-20 drop-shadow-xl hidden sm:flex'>
      <Logo />
      <div className='flex items-center'>
        {!account?.login_id ? (
          <div className='rounded-full bg-black h-12 flex items-center px-9 mr-10 text-base font-bold text-white' onClick={goLogin}>
            Login
          </div>
        ) : (
          <div className='h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 mr-10 rounded-full'>
            {/* {account.user.avatar !== null && (
              <ImageBlock
                src={account.user.avatar}
                placeholderImg='https://via.placeholder.com/400x200.png?text=This+Will+Be+Shown+Before+Load'
                errorImg='https://image.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg'
                alt='thumbnail'
                className='w-full h-full rounded-full'
              />
            )} */}
          </div>
        )}
        <ThemeToggleButton />
      </div>
    </div>
  );
}

export default Header;
