import React from 'react';
import { useTransition, config, animated } from 'react-spring';

interface Props {
  title?: string;
  actionTitle?: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}
const BottomUpAnimatedView = ({ title, actionTitle, isOpen, onClose, onSave, children }: Props) => {
  const modalTransition = useTransition(!!isOpen, {
    config: isOpen ? { ...config.stiff } : { duration: 150 },
    from: { opacity: 0, transform: `translate3d(0, 100%, 0)` },
    enter: { opacity: 1, transform: `translate3d(0, 0px, 0)` },
    leave: { opacity: 0, transform: `translate3d(0, 100%, 0)` },
  });

  return (
    <>
      {isOpen && <div className='z-20 fixed bottom-0 left-0 w-full h-full opacity-50 bg-black' onClick={() => onClose()} />}
      {modalTransition(
        (styles, isOpen) =>
          isOpen && (
            <animated.div style={styles} className='z-30 absolute bottom-0 w-full bg-white'>
              <div className='flex flex-row w-full p-4 items-center justify-between'>
                <div className='text-sm text-black font-normal' onClick={onClose}>
                  Cancel
                </div>
                <div className='text-base text-black font-bold'>{title}</div>
                <div className='text-sm text-black font-normal' onClick={onSave}>
                  {actionTitle ? actionTitle : 'Save'}
                </div>
              </div>
              {children}
            </animated.div>
          ),
      )}
    </>
  );
};

export default BottomUpAnimatedView;
