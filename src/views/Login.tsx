import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import { Input } from '../components/Input/Input';

export function Login() {
    const [email, setEmail] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target?.value;
        setEmail(value);
    };

    const handleSignIn = () => {
        console.log('signing in...');
    };

    return (
        <>
            <Input
                label="Email"
                value={email}
                type="email"
                callback={handleChange}
                name="email"
                labelColor="white"
                margin="10px 0 0 0"
                id="email-login-input"
            />
            <Button
                callback={handleSignIn}
                margin="30px 0 0 0"
                width="100%"
                name="Log in"
            />
            <span>or</span>
            <Link to="/signup">
                <Button
                    callback={() => {}}
                    margin="10px 0 0 0"
                    width="100%"
                    name="Sign up"
                />
            </Link>
        </>
    );
}
