import { Link } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import type { UserData } from '../context/AuthContext';
import { hostedRedirect, purchaseMessage, usePurchase } from '../util/purchase';

/** Displays the verified account identity. */
function AccountIdentity({ user }: { user: UserData }) {
  return (
    <p>
      {user.firstName} {user.lastName} — {user.email} (account reference: {user.id})
    </p>
  );
}

/** Displays server-owned billing actions and the existing support route. */
export function ManageAccount({
  redirect = hostedRedirect,
}: {
  redirect?: (url: string) => void;
}) {
  const state = usePurchase(undefined, redirect);
  if (state.status === 'loading') return <p role="status">Loading account…</p>;
  if (state.status === 'error')
    return (
      <Button
        name="Retry account session"
        callback={() => {
          void state.refreshSession();
        }}
      />
    );
  if (!state.userData)
    return (
      <p>
        Please <Link to="/">log in</Link> to access your account.
      </p>
    );
  const unavailable = state.busy
    ? 'An account request is in progress. Please wait.'
    : undefined;
  return (
    <Section>
      <ViewTitle title="Account" />
      <AccountIdentity user={state.userData} />
      {state.result && (
        <>
          <p role="status">{purchaseMessage(state.result)}</p>
          {state.result.attempt && <p>Purchase reference: {state.result.attempt}</p>}
          {(state.result.action === 'purchase' ||
            (state.result.action === 'pending' &&
              ['checkout_open', 'unknown_provider_outcome'].includes(
                state.result.reason,
              ))) && (
            <Button
              name={
                state.result.action === 'purchase'
                  ? 'Continue to Checkout'
                  : 'Continue same purchase'
              }
              isDisabledMessage={unavailable}
              callback={() => {
                void state.startCheckout();
              }}
            />
          )}
          {state.result.action === 'manage' && (
            <Button
              name="Manage billing in Stripe"
              isDisabledMessage={unavailable}
              callback={() => {
                void state.openPortal();
              }}
            />
          )}
        </>
      )}
      <Button
        name="Refresh account"
        isDisabledMessage={unavailable}
        callback={() => {
          void state.refresh();
        }}
      />
      {state.busy && <p role="status">Checking account…</p>}
      {state.error && <p role="alert">{state.error}</p>}
      <hr />
      <h2>Account deletion</h2>
      <p>
        Cancel your subscription in Stripe to stop renewal and keep your account. Account
        deletion is a separate, owner-assisted process. It does not automatically cancel
        billing, refund payments or immediately invalidate issued media links.
      </p>
      <p>
        To delete your app account,{' '}
        <Link to="/library">contact support through Help</Link> using your account email
        and the account reference above. Support will verify your request and arrange
        billing closure.
      </p>
      <Link to="/library">Help</Link>
    </Section>
  );
}
