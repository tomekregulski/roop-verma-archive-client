import axios from 'axios';

import { useAuthContext } from '../context/AuthContext';

// import tw from 'twin.macro';

const key = import.meta.env.VITE_API_KEY;

export function ManageAccount() {
  const { userData } = useAuthContext();

  const handlePortal = async () => {
    console.log('portal');
    console.log(userData);
    try {
      const portalRes = await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/user/create-portal-session/${key}`,
        {
          customerId: userData!.stripeId,
        },
      );
      const portalAddress = portalRes.data.session.url;
      console.log(portalAddress);
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
