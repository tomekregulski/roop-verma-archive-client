import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function PortalRoot(children: ReactNode) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mount = document.getElementById('portal-root')!;
  const el = document.createElement('div');

  useEffect(() => {
    mount.appendChild(el);
    return () => {
      mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
}
