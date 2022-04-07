import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDownSvg, DownArrowSvg, FolderSvg, HomeSvg, LeftArrowSvg, MenuSvg, RightArrowSvg, SearchSvg } from '../../assets/svg';
import MainResponsive from '../../containers/main/MainResponsive';

function FileManager(): JSX.Element {
  return (
    <MainResponsive>
      <div className='w-full flex flex-row justify-between items-center mt-4'>
        <LeftArrowSvg strokeWidth={4} className='w-6 h-6 text-svg' />
        <RightArrowSvg strokeWidth={4} className='w-6 h-6 text-svg' />
      </div>
      <div className='w-full flex flex-row justify-between items-center mt-4 px-4 text-white text-xl'>
        <div className='w-10 h-10 flex items-center justify-center relative'>
          <FolderSvg fill='#7C7272' className='w-10 h-10 text-[#7C7272] absolute top-0 left-0' />
          <HomeSvg strokeWidth={4} className='w-5 h-5 z-10 text-black' />
        </div>
        <div>Internal storage</div>
        <SearchSvg strokeWidth={4} className='w-6 h-6' />
      </div>
      <div className='w-full flex flex-row justify-between items-center mt-4 px-8 text-white text-xl'>
        <div className='flex flex-1'>All</div>
        <div className='flex flex-row justify-center items-center text-[#7C7272]'>
          <ArrowUpDownSvg strokeWidth={4} className='w-6 h-6 -mr-2' />
          <MenuSvg stroke='#7C7272' strokeWidth={4} className='w-6 h-6' />
          <DownArrowSvg strokeWidth={4} className='w-6 h-6' />
        </div>
      </div>
      {['ID LOGISTICS', 'ABATONE', 'AMIPREMIUM'].map(item => (
        <div key={item} className=''>
          {item}
        </div>
      ))}
    </MainResponsive>
  );
}

export default FileManager;
