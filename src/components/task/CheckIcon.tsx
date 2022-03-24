import React from 'react';
import { CheckSvg, CrossSvg } from '../../assets/svg';
interface Props {
  checked: boolean;
  toggle?: () => void;
}
const CheckIcon = ({ checked, toggle }: Props) => {
  return (
    <div
      className='w-7 h-7 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'
      //   onClick={toggle}
    >
      <span>{checked ? <CheckSvg stroke='red' strokeWidth={4} /> : null}</span>
    </div>
  );
};

export default CheckIcon;
