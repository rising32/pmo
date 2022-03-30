import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { attachThumbnail, backThumbnail, locationThumbnail, moreThumbnail } from '../../assets/images';
import AgendaCalendar from '../../components/priority/AgendaCalendar';
import MainResponsive from '../../containers/main/MainResponsive';
import { accountState, AccountState } from '../../modules/user';

function PrioritySupport(): JSX.Element {
  const account = useRecoilValue<AccountState | null>(accountState);

  return (
    <MainResponsive>
      <div className='w-full flex flex-row justify-between items-center bg-white rounded-md py-3 px-4'>
        <div className='flex items-center'>
          <img src={backThumbnail} className='h-4 w-auto' />
          <span className='text-xl font-normal capitalize ml-2 truncate'>Nouveau messsage...</span>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <img src={attachThumbnail} className='h-3 w-auto' />
          <img src={locationThumbnail} className='h-4 w-auto mx-3' />
          <img src={moreThumbnail} className='h-5 w-auto' />
        </div>
      </div>
    </MainResponsive>
  );
}

export default PrioritySupport;
