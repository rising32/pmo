import React from 'react';
import { animated, useSpring, config, useSpringRef, useChain } from 'react-spring';

interface Props {
  isChecked?: boolean;
  text?: string;
  activeColor?: string;
  unCheck: () => void;
}
const CheckBox = ({ isChecked, text, activeColor, unCheck }: Props) => {
  const checkboxAnimationRef = useSpringRef();
  const checkboxAnimationStyle = useSpring({
    backgroundColor: isChecked ? activeColor : '#898181',
    borderColor: isChecked ? '#808' : '#ddd',
    config: config.gentle,
    ref: checkboxAnimationRef,
  });

  const [checkmarkLength, setCheckmarkLength] = React.useState<number>(1);

  const checkmarkAnimationRef = useSpringRef();
  const checkmarkAnimationStyle = useSpring({
    x: isChecked ? 0 : checkmarkLength,
    config: config.stiff,
    ref: checkmarkAnimationRef,
  });

  useChain(isChecked ? [checkboxAnimationRef, checkmarkAnimationRef] : [checkmarkAnimationRef, checkboxAnimationRef], [0, 0.1]);

  return (
    <div onClick={() => unCheck()} className='flex flex-row items-center'>
      <animated.svg style={checkboxAnimationStyle} className='w-6 h-6 p-1 rounded-full' aria-hidden='true' viewBox='0 0 15 11' fill='none'>
        <animated.path
          d='M1 4.5L5 9L14 1'
          strokeWidth='2'
          stroke='#FFF'
          ref={ref => {
            if (ref) {
              setCheckmarkLength(ref.getTotalLength());
            }
          }}
          strokeDasharray={checkmarkLength}
          strokeDashoffset={checkmarkAnimationStyle.x}
        />
      </animated.svg>
      <p className='pl-2 text-sm'>{text}</p>
    </div>
  );
};

export default CheckBox;
