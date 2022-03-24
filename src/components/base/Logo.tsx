import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoThumbnail } from '../../assets/images';

function Logo(): JSX.Element {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate('/');
  };
  return (
    <div className='flex items-center justify-start' onClick={goLogin}>
      <img src={logoThumbnail} alt='Logo' className='h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16' />
    </div>
  );
}

export default Logo;
