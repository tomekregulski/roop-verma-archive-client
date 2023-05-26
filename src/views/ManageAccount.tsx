import axios from 'axios';

import { useAuthContext } from '../context/AuthContext';

const key = import.meta.env.VITE_API_KEY;

export function ManageAccount() {
  const { userData } = useAuthContext();

  const handlePortal = async () => {
    try {
      const portalRes = await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/user/create-portal-session/${key}`,
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          customerId: userData!.stripeId,
        },
      );
      const portalAddress = portalRes.data.session.url;
      window.location.href = portalAddress;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button id="portal-session-button" type="button" onClick={() => handlePortal()}>
        Manage Account
      </button>
    </div>
  );
}
