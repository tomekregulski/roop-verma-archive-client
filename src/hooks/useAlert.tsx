import React, { useState } from 'react';

import { Alert } from '../components/Alert/Alert';

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  // @ts-expect-error any type
  const RenderModal = (props) => (
    <React.Fragment>
      {isVisible && (
        // @ts-expect-error any type
        <Alert props={props} closeModal={hide}>
          {props.children}
        </Alert>
      )}
    </React.Fragment>
  );

  return {
    show,
    hide,
    RenderModal,
  };
};
