import React from 'react';
import './Modal.scss'

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
	onClose: () => void;
};	

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

	// Обработчик клика по фону модального окна
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Обработчик клика по контенту модального окна (останавливает всплытие)
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

	return (
    <div className="modal modal_active" onClick={handleBackdropClick}>
      <div className="modal__content" onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
};

export default Modal;