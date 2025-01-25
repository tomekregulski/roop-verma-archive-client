/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import './loadingStyles.css';

import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  show: boolean;
}

export function LoadingNotification(props: AlertProps) {
  const { children, show } = props;
  const domEl = document.getElementById('modal-root');

  if (!domEl) return null;

  if (!show) {
    return null;
  }
  return (
    <div role="alert" className="modal--backdrop">
      <div className="modal--card-container">
        <div className="modal--content-body">{children}</div>
      </div>
    </div>
  );
}
