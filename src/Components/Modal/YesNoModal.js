import React, { useEffect, useState } from 'react';

import Button from '../Button/Button';

const YesNoModal = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOk = () => {
    props.callback();
    handleClose();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'solid 2px white',
              borderRadius: '10px',
              padding: '20px',
              margin: '20px 0 10px 0',
            }}
          >
            <p style={{ color: 'white' }}>{props.message}</p>
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
