import { init, sendForm } from 'emailjs-com';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Section } from '../../components/Section/Section';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { Input } from '../Input/Input';

init('user_sWNT4oROPiAoUGksmqFlD');

/** Sends support requests through the existing configured EmailJS form. */
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
  const isSubmitDisabled = busy || !helpInfo.name || !helpInfo.email || !helpInfo.message;

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
      await sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form');
      if (active.current) {
        setMessage(
          'Your message was accepted for delivery. Keep your account email handy for support.',
        );
        setHelpInfo((current) => ({ ...current, message: '' }));
      }
    } catch {
      if (active.current) {
        setFailed(true);
        setMessage(
          'We could not confirm your message was sent. Please retry. If you already sent it, support may still receive it.',
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
          callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <Input
          id="support-message--email-input"
          label="Email"
          name="email"
          value={helpInfo.email}
          type="email"
          callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <Input
          id="support-message--message-input"
          label="Message"
          name="message"
          value={helpInfo.message}
          type="text"
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
