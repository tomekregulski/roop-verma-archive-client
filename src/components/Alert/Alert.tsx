/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import './alertStyles.css';

import type { ReactNode } from 'react';

import { Button } from '../Button/Button';

interface AlertProps {
  children: ReactNode;
  closeAlert: () => void;
  show: boolean;
}

export function Alert(props: AlertProps) {
  const { children, closeAlert, show } = props;
  const domEl = document.getElementById('modal-root');

  if (!domEl) return null;

  if (!show) {
    return null;
  }
  return (
    <div onMouseDown={closeAlert} role="alert" className="modal--backdrop">
      <div className="modal--card-container">
        <div className="modal--content-body">{children}</div>
        <div className="modal--buttons-div">
          <Button name="Ok" callback={closeAlert} />
        </div>
      </div>
    </div>
  );
}
