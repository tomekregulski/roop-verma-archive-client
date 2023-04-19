import axios from 'axios';
import { useEffect } from 'react';

const key = import.meta.env.VITE_API_KEY;

export function LoginGate() {
    useEffect(() => {
        // currently firing twice
        const effect = async () => {
            const url = window.location.href;
            const params = url.split('?')[1].split('&');
            const emailKey = params[0].split('=')[1];
            const email = params[1].split('=')[1];
            console.log(email, emailKey);
            await axios
                .get(
                    `${
                        import.meta.env.VITE_API_ORIGIN
                    }/api/v1/auth/session-token/${key}/${email}/${emailKey}`
                )
                .then((response) => {
                    console.log(response);
                    const token = response.data.authToken;
                    document.cookie = `roop-verma-library=${token}`;
                    //   setIsAuth(true);
                    //   setUserData(response.data.userData);
                    //   navigate('/');
                    // console.log(cookie);
                });
        };
        effect();
    }, []);

    return (
        <>
            <div>Please wait a moment while we log you in...</div>
        </>
    );
}
