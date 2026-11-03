import { Link } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import { hostedRedirect, purchaseMessage, usePurchase } from '../util/purchase';

/** Displays owned Checkout confirmation with safe manual refresh. */
export function CompleteRegistration({
  redirect = hostedRedirect,
}: {
  redirect?: (url: string) => void;
}) {
  const params = new URLSearchParams(window.location.search);
  const sessionId =
    params.get('success') === 'true' ? params.get('session_id') || undefined : undefined;
  const state = usePurchase(sessionId, redirect);
  return (
    <Section>
      <ViewTitle title="Checkout return" />
      <p>A return URL does not confirm payment or playback access.</p>
      {state.status === 'loading' ? (
        <p role="status">Checking your session…</p>
      ) : !state.userData ? (
        <p>
          Please <Link to="/">log in</Link>, then return to your account to check the
          purchase.
        </p>
      ) : (
        <>
          {state.result && <p role="status">{purchaseMessage(state.result)}</p>}
          {state.result?.attempt && <p>Purchase reference: {state.result.attempt}</p>}
          <Button
            name="Refresh purchase confirmation"
            isDisabledMessage={
              state.busy ? 'A purchase lookup is in progress. Please wait.' : undefined
            }
            callback={() => {
              void state.refresh();
            }}
          />
        </>
      )}
      {state.error && <p role="alert">{state.error}</p>}
      <Link to="/manage-account">View account</Link> · <Link to="/library">Help</Link>
    </Section>
  );
}
