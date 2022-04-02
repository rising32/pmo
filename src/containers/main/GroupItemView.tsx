import React from 'react';

interface GroupItemViewProps {
  className?: string;
  children: React.ReactNode;
}

function GroupItemView({ className, children }: GroupItemViewProps): JSX.Element {
  const wholeClassName = 'bg-card-gray shadow-xl w-full ' + className;

  return <div className={wholeClassName}>{children}</div>;
}

export default GroupItemView;
