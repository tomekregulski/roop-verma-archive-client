import React, { useState } from 'react';

import ModalCard from '../Components/Modal/ModalCard';
import AlertCard from '../Components/Modal/AlertCard';

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const RenderModal = (props) => (
    <React.Fragment>
      {props.type === 'modal'
        ? isVisible && (
            <ModalCard props={props} closeModal={hide}>
              {props.children}
            </ModalCard>
          )
        : isVisible && (
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
