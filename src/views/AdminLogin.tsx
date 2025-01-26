import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Input } from '../components/Input/Input';
import { useAdminContext } from '../context/AdminContext';

export function AdminLogin() {
  const [password, setPassword] = useState('');

  const { checkIsAdmin } = useAdminContext();

  function handleSubmit() {
    if (!password) {
      return;
    }
    checkIsAdmin(password);
  }

  return (
    <div className="w-[500px]">
      <p>This site is under development and is only available to admin users.</p>
      <Form
        id="admin-login-form"
        isSubmitDisabled={!password}
        handleSubmit={handleSubmit}
      >
        <Input
          id="admin-password-input"
          label="Admin Password"
          name="adminpasword"
          value={password}
          type="password"
          callback={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <Button
          form="admin-login-form"
          type="submit"
          name="Submit"
          isDisabledMessage={!password ? 'Please enter password' : undefined}
        />
      </Form>
    </div>
  );
}
