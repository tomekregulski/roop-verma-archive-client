import React from 'react';

import { useModal } from '../../Hooks/useModal';

const AlertContainer = (props) => {
  const { show, RenderModal } = useModal();

  return (
    <div style={{ margin: '0 auto' }}>
      <RenderModal
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Password'}
        callback={props.callback}
        type={props.type}
      >
        <p>{props.message}</p>
      </RenderModal>
    </div>
  );
};

export default AlertContainer;
