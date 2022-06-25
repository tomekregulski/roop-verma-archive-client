import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button/Button';

import '../Modal/modalStyles.css';

const AlertCard = React.memo(({ children, closeAlert, show }) => {
  const domEl = document.getElementById('modal-root');

  if (!domEl) return null;

  return (
    <>
      {show
        ? ReactDOM.createPortal(
            <div className='modal--card-container'>
              <div className='modal--content-body'>{children}</div>
              <div className='modal--buttons-div'>
                <Button name='Ok' callback={closeAlert} margin='0 0 0 20px' />
              </div>
            </div>,
            domEl
          )
        : null}
    </>
  );
});

export default AlertCard;
