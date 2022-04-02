import React from 'react';

interface MainResponsiveProps {
  className?: string;
  children: React.ReactNode;
}

function MainResponsive({ className, children }: MainResponsiveProps): JSX.Element {
  return <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>{children}</div>;
}

export default MainResponsive;
