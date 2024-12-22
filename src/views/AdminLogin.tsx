import { ChangeEvent, useState } from 'react';

import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { useAdminContext } from '../context/AdminContext';

export function AdminLogin() {
  const [password, setPassword] = useState('');

  const { checkIsAdmin } = useAdminContext();

  return (
    <div style={{ width: '500px' }}>
      <p>This site is under development and is only available to admin users.</p>
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
        callback={password ? () => checkIsAdmin(password) : undefined}
        margin="30px 0 0 0"
        width="200px"
        name="Submit"
        isDisabledMessage={!password ? 'Enter password' : undefined}
      />
    </div>
  );
}
