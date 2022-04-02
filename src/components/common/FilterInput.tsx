import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import useResizeObserver from 'use-resize-observer';

interface MainResponsiveProps {
  show: boolean;
  className?: string;
  children: React.ReactNode;
}

function FilterInput({ show, className, children }: MainResponsiveProps): JSX.Element {
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const props = useSpring({
    height: show ? height : 0,
  });

  return (
    <animated.div
      style={{
        ...props,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div ref={ref} className={className}>
        {children}
      </div>
    </animated.div>
  );
}

export default FilterInput;
