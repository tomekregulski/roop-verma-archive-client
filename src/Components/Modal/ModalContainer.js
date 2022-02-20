import React from 'react';

import { useModal } from '../../Hooks/useModal';

import Button from '../Button/Button';

const ModalContainer = (props) => {
  const { show, RenderModal } = useModal();

  return (
    <div style={{ margin: '0 auto' }}>
      <Button
        width={props.buttonWidth}
        margin={props.buttonMargin}
        callback={show}
        name={props.action}
      />
      <RenderModal
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Password'}
        callback={props.callback}
      >
        <p>{props.message}</p>
      </RenderModal>
    </div>
  );
};

export default ModalContainer;
