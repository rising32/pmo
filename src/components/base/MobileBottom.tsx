import React from 'react';
import { getNavLinkList } from '../../lib/utills/NavLinkList';
import QueryNavLinkMobile from '../common/QueryNavLinkMobile';

function MobileBottom(): JSX.Element {
  const navLinkList = getNavLinkList();
  return (
    <div className='z-10 fixed bottom-0 w-full flex bg-main-back'>
      <div className='bg-white items-center justify-evenly mx-4 my-2 flex flex-1 rounded-t-xl'>
        {navLinkList.map((item, index) => (
          <ul key={index} className='py-2'>
            <QueryNavLinkMobile item={item} />
          </ul>
        ))}
      </div>
    </div>
  );
}

export default MobileBottom;
