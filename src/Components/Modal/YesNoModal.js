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
    <div>
      <Button callback={handleOpen} name={props.action} />
      {open === true && (
        <div onClose={handleClose}>
          <div>
            <p>{props.message}</p>
            <Button name='Yes' callback={handleOk} />
            <Button callback={handleClose} name='No' />
          </div>
        </div>
      )}
    </div>
  );
};

export default YesNoModal;
