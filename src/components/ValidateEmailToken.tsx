import axios from 'axios';
import { useEffect } from 'react';

export function ValidateEmailToken() {
    useEffect(() => {
        // grab token from url
        const url = window.location.href;
        const token = url.split('token=')[1];
        // send to endpoint for validation

        const handleLoginlKey = async () => {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/validate-email-token`,
                {
                    token,
                }
            );
            console.log(res);
        };
        handleLoginlKey();
        // set jwt
    });
    return (
        <>
            <div>
                <h1>Validate email token</h1>
            </div>
        </>
    );
}
