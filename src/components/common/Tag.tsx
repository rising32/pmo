import React from 'react';
import { documentThumbnail } from '../../assets/images';
import { CheckSvg, CrossSvg } from '../../assets/svg';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  text: string;
}
const Tag = ({ text }: Props) => {
  return <div className='text-sm text-white px-2 bg-rouge-blue text-center'>{text}</div>;
};

export default Tag;
