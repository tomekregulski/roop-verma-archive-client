import React, { useState } from 'react';

import AlertCard from '../Components/Modal/AlertCard';

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const RenderModal = (props) => (
    <React.Fragment>
      {isVisible && (
        <AlertCard props={props} closeModal={hide}>
          {props.children}
        </AlertCard>
      )}
    </React.Fragment>
  );

  return {
    show,
    hide,
    RenderModal,
  };
};
