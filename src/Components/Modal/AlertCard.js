import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button/Button';

import '../Modal/modalStyles.css';

const AlertCard = React.memo(({ children, closeModal }) => {
  const domEl = document.getElementById('modal-root');

  if (!domEl) return null;

  return ReactDOM.createPortal(
    <div className='modal--card-container'>
      <div className='modal--content-body'>{children}</div>
      <div className='modal--buttons-div'>
        <Button name='Ok' callback={closeModal} margin='0 0 0 20px' />
      </div>
    </div>,
    domEl
  );
});

export default AlertCard;
