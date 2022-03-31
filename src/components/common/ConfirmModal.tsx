import React from 'react';
import ReactModal from 'react-modal';

interface Props {
  show: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onConfirm?: () => void;
}
const ConfirmModal = ({ show, title, content, onClose, onConfirm }: Props) => {
  return (
    <ReactModal
      isOpen={show}
      onRequestClose={onClose}
      className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <div className='text-center'>{title}</div>
    </ReactModal>
  );
};

export default ConfirmModal;
