import { ChangeEvent, useState } from 'react';

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
    <div style={{ width: '500px' }}>
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
          labelColor="white"
          margin="10px 0 0 0"
        />
        <Button
          form="admin-login-form"
          type="submit"
          margin="30px 0 0 0"
          width="200px"
          name="Submit"
          isDisabledMessage={!password ? 'Please enter password' : undefined}
        />
      </Form>
    </div>
  );
}
