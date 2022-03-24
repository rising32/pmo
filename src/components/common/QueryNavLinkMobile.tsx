import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { QueryNavLinkProps } from './QueryNavLink';

const QueryNavLinkMobile = ({ item }: { item: QueryNavLinkProps }) => {
  const location = useLocation();
  const isActive = location.pathname.split('/')[1] === item.to.split('/')[1];

  return (
    <NavLink to={item.to} className='flex flex-col items-center'>
      <div className='flex items-center'>
        <img src={isActive ? item.active_image : item.inactive_image} alt='Logo' className='w-auto h-6' />
      </div>
      {isActive ? <p className='text-sm text-[#EC1C24]'>{item.pathName}</p> : <p className='text-sm text-white'>{item.pathName}</p>}
    </NavLink>
  );
};

export default QueryNavLinkMobile;
