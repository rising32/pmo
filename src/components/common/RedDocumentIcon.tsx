import React from 'react';
import { documentThumbnail, redDocumentThumbnail } from '../../assets/images';
import { CheckSvg, CrossSvg } from '../../assets/svg';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  isChecked: boolean;
}
const RedDocumentIcon = ({ isChecked }: Props) => {
  return (
    <div className='w-6 h-6 mr-2 flex items-center justify-center relative bg-transparent'>
      {isChecked ? <img src={redDocumentThumbnail} className='h-4 w-auto' /> : <img src={documentThumbnail} className='h-4 w-auto' />}
    </div>
  );
};

export default RedDocumentIcon;
