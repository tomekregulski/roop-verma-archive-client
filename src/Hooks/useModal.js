import React, { useState } from 'react';

import ModalCard from '../Components/Modal/ModalCard';

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const RenderModal = (props) => (
    <React.Fragment>
      {isVisible && (
        <ModalCard props={props} closeModal={hide}>
          {props.children}
        </ModalCard>
      )}
    </React.Fragment>
  );

  return {
    show,
    hide,
    RenderModal,
  };
};
