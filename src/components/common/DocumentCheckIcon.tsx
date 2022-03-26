import React from 'react';
import { documentThumbnail } from '../../assets/images';
import { CheckSvg, CrossSvg } from '../../assets/svg';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  isCompleted: number | null;
}
const DocumentCheckIcon = ({ isCompleted }: Props) => {
  return (
    <div className='w-6 h-6 mr-2 flex items-center justify-center relative'>
      <img src={documentThumbnail} className='h-6 w-auto' />
      {isCompleted === 0 && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <CheckSvg stroke='red' strokeWidth={4} className='w-4 h-4' />
        </div>
      )}
      {isCompleted === 1 && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <CheckSvg stroke='red' strokeWidth={4} className='w-4 h-4' />
        </div>
      )}
    </div>
  );
};

export default DocumentCheckIcon;
