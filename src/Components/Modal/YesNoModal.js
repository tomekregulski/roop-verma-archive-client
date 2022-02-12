import React, { useEffect, useState } from 'react';

import Button from '../Button/Button';

import './modalStyles.css';

const YesNoModal = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOk = () => {
    props.callback();
    handleClose();
  };

  return (
    <div className='modal--button-container'>
      {open === false && (
        <Button
          width={props.buttonWidth}
          margin={props.buttonMargin}
          callback={handleOpen}
          name={props.action}
        />
      )}
      {open === true && (
        <div onClose={handleClose}>
          <div className='modal--card-container'>
            <p className='modal--content-body'>{props.message}</p>
            <Button
              width={props.buttonWidth}
              margin={props.buttonMargin}
              name='Yes'
              callback={handleOk}
            />
            <Button
              margin={props.buttonMargin}
              width={props.buttonWidth}
              callback={handleClose}
              name='No'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default YesNoModal;
