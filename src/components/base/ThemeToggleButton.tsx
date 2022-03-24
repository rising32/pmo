import React from 'react';
import { animated, useTransition } from 'react-spring';
import { MoonIcon, SunIcon } from '../../assets/svg';
import { useToggleTheme } from '../../lib/hooks/useToggleTheme';
import '../../lib/styles/commonStyles.css';

function ThemeToggleButton(): JSX.Element {
  const [theme, toggle] = useToggleTheme();
  const isDark = theme === 'dark';
  const transitions = useTransition(isDark, {
    initial: {
      transform: 'scale(1) rotate(0deg)',
      opacity: 1,
    },
    from: {
      transform: 'scale(0) rotate(-180deg)',
      opacity: 0,
    },
    enter: {
      transform: 'scale(1) rotate(0deg)',
      opacity: 1,
    },
    leave: {
      transform: 'scale(0) rotate(180deg)',
      opacity: 0,
    },

    reverse: true,
  });

  return (
    <div onClick={toggle} className='relative'>
      {transitions((style, item) =>
        item ? (
          <div className='svg-icon'>
            <animated.div style={style}>
              <MoonIcon />
            </animated.div>
          </div>
        ) : (
          <div className='svg-icon'>
            <animated.div style={style}>
              <SunIcon />
            </animated.div>
          </div>
        ),
      )}
    </div>
  );
}

export default ThemeToggleButton;
