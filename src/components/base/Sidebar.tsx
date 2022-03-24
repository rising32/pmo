import React from 'react';
import QueryNavLink from '../../components/common/QueryNavLink';
import { getNavLinkList } from '../../lib/utills/NavLinkList';

function Sidebar(): JSX.Element {
  const navLinkList = getNavLinkList();

  return (
    <div className='w-full'>
      {navLinkList.map((item, index) => (
        <ul key={index} className='py-3 xl:py-4 2xl:py-6 px-2 xl:px-4'>
          <QueryNavLink item={item} />
        </ul>
      ))}
    </div>
  );
}

export default Sidebar;
