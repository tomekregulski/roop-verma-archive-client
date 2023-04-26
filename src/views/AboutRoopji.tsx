import React, { useContext, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { isValidJwt } from '../Utils/isValidJwt';

const AboutRoopji = () => {
    const { isAuth, userData } = useAuthContext();

    // let navigate = useNavigate();

    // useEffect(() => {
    //     if (!isValidJwt) {
    //         setUserData({});
    //         setIsAuth(false);
    //         document.cookie =
    //             'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    //         navigate('/');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div>
            <h1>Info About Roopji</h1>
        </div>
    );
};

export default AboutRoopji;
