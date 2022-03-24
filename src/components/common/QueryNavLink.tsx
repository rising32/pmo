import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
export interface QueryNavLinkProps {
  to: string;
  pathName: string;
  active_image: string;
  inactive_image: string;
}

const QueryNavLink = ({ item }: { item: QueryNavLinkProps }) => {
  const location = useLocation();
  const isActive = location.pathname.split('/')[1] === item.to.split('/')[1];

  return (
    <NavLink to={item.to} className='flex flex-row items-center hover:bg-sky-700 rounded-full px-6 py-2'>
      <div className='flex items-center justify-start mr-6 xl:mr-10 2xl:mr-20'>
        <img src={isActive ? item.active_image : item.inactive_image} alt='Logo' className='w-auto h-10 xl:h-12' />
      </div>
      {isActive ? (
        <p className='text-2xl xl:text-3xl text-[#EC1C24]'>{item.pathName}</p>
      ) : (
        <p className='text-2xl xl:text-3xl text-slate-100'>{item.pathName}</p>
      )}
    </NavLink>
  );
};

export default QueryNavLink;
