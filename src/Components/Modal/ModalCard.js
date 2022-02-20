import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button/Button';

import './modalStyles.css';

const Modal = React.memo(({ props, children, closeModal }) => {
  const domEl = document.getElementById('modal-root');

  const { callback } = props;

  if (!domEl) return null;

  return ReactDOM.createPortal(
    <div className='modal--card-container'>
      <div className='modal--content-body'>{children}</div>
      <div className='modal--buttons-div'>
        <Button name='Yes' callback={callback} margin='0 20px 0 0' />
        <Button name='No' callback={closeModal} margin='0 0 0 20px' />
      </div>
    </div>,
    domEl
  );
});

export default Modal;
