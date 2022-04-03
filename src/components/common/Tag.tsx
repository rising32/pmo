import React from 'react';

interface Props {
  text: string;
}
const Tag = ({ text }: Props) => {
  return <div className='text-sm text-white px-2 bg-rouge-blue text-center'>{text}</div>;
};

export default Tag;
