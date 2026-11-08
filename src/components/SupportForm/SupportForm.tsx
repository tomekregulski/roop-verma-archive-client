import { isAxiosError } from 'axios';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { sendSupportMessage } from '../../api/support';
import { Section } from '../../components/Section/Section';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { Input } from '../Input/Input';

/** Send bounded support requests through the backend's fixed Resend destination. */
export function SupportForm() {
  const { userData } = useAuthContext();
  const [helpInfo, setHelpInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData ? userData.email : '',
    message: '',
  });

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const pending = useRef(false);
  const active = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const isSubmitDisabled =
    busy || !helpInfo.name.trim() || !helpInfo.email.trim() || !helpInfo.message.trim();

  /** Updates only local form fields while no send is pending. */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (pending.current) return;
    const { name, value } = event.target;

    setHelpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /** Prevents duplicate sends and reports acceptance without promising inbox delivery. */
  async function handleFormSubmit() {
    if (pending.current || isSubmitDisabled) return;
    pending.current = true;
    setBusy(true);
    setMessage('');
    setFailed(false);
    try {
      await sendSupportMessage(helpInfo);
      if (active.current) {
        setMessage(
          'Your message was accepted for delivery. Keep your account email handy for support.',
        );
        setHelpInfo((current) => ({ ...current, message: '' }));
      }
    } catch (error) {
      if (active.current) {
        setFailed(true);
        setMessage(
          isAxiosError(error) && error.response?.status === 429
            ? 'Too many support requests. Wait 15 minutes before trying again.'
            : 'We could not confirm your message was sent. Please retry. If you already sent it, support may still receive it.',
        );
      }
    } finally {
      pending.current = false;
      if (active.current) setBusy(false);
    }
  }

  return (
    <Section>
      {busy && <p role="status">Sending your support message…</p>}
      {message && <p role={failed ? 'alert' : 'status'}>{message}</p>}
      <Form
        id="contact-form"
        handleSubmit={handleFormSubmit}
        isSubmitDisabled={Boolean(isSubmitDisabled)}
        aria-busy={busy}
      >
        <Input
          id="support-message--name-input"
          label="Name"
          name="name"
          value={helpInfo.name}
          type="text"
          maxLength={100}
          callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <Input
          id="support-message--email-input"
          label="Email"
          name="email"
          value={helpInfo.email}
          type="email"
          maxLength={254}
          callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <Input
          id="support-message--message-input"
          label="Message"
          name="message"
          value={helpInfo.message}
          type="text"
          maxLength={5000}
          callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <Button
          type="submit"
          name="Send Message"
          form="contact-form"
          isDisabledMessage={
            busy
              ? 'Sending your support message. Please wait.'
              : isSubmitDisabled
              ? 'Please complete the form'
              : undefined
          }
        />
      </Form>
    </Section>
  );
}
