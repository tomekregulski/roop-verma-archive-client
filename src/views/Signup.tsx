import { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import { Input } from '../components/Input/Input';

import './styles/formStyles.css';

export function Signup() {
    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const [invalidEmail, setInvalidEmail] = useState('');
    const [invalidFirstName, setInvalidFirstName] = useState('');
    const [invalidLastName, setInvalidLastName] = useState('');
    console.log('sign up');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateEmail = () => {
        var validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (userInfo.email !== '') {
            if (userInfo.email.match(validRegex)) {
                setInvalidEmail('');
            } else {
                setInvalidEmail('Please enter a valid email address');
            }
        } else {
            setInvalidEmail('');
        }
    };

    useEffect(() => {
        validateEmail();
    }, [userInfo.email]);

    const handleSignUp = () => {
        if (
            Object.values(userInfo).every((v) => v !== '') &&
            invalidEmail === ''
        ) {
            console.log(userInfo);
            // axios.post(/signup)
            // send userInfo, validate, and create user record in DB
            // create stripe user
            // forward to /register
        } else {
            if (userInfo.first_name === '') {
                setInvalidFirstName('Please enter a first name');
            }
            if (userInfo.last_name === '') {
                setInvalidLastName('Please enter a last name');
            }
        }
    };

    return (
        <>
            <Input
                id="first-name-login-input"
                label="First Name"
                name="first_name"
                value={userInfo.first_name}
                type="text"
                callback={handleChange}
                labelColor="white"
                margin="10px 0 0 0"
            />
            {invalidFirstName !== '' && (
                <span className="form--alert">{invalidFirstName}</span>
            )}
            <Input
                id="last-name-login-input"
                label="Last Name"
                name="last_name"
                value={userInfo.last_name}
                type="text"
                callback={handleChange}
                labelColor="white"
                margin="20px 0 0 0"
            />
            {invalidLastName !== '' && (
                <span className="form--alert">{invalidLastName}</span>
            )}
            <Input
                label="Email"
                value={userInfo.email}
                type="email"
                callback={handleChange}
                name="email"
                labelColor="white"
                margin="10px 0 0 0"
                id="email-login-input"
            />
            {invalidEmail !== '' && (
                <span className="form--alert">{invalidEmail}</span>
            )}
            {/* <Button
                callback={handleSignUp}
                margin="30px 0 0 0"
                width="100%"
                name="Sign Up"
            /> */}
            <Link to="/register">
                <Button
                    callback={handleSignUp}
                    margin="10px 0 0 0"
                    width="100%"
                    name="Sign up"
                />
            </Link>
        </>
    );
}
