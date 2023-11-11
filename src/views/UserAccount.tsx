// import axios from 'axios';

// import Button from '../Components/Button/Button';
// import AlertCard from '../Components/Modal/AlertCard';
import './styles/userAccountStyles.css';

import { useAuthContext } from '../context/AuthContext';

export function UserAccount() {
  const { isAuth, userData } = useAuthContext();

  // const key = process.env.REACT_APP_API_KEY;

  // let navigate = useNavigate();

  // const handleLogout = async () => {
  //     await axios
  //         .post(
  //             `${process.env.REACT_APP_API_ORIGIN}/api/v1/auth/logout/${key}`
  //         )
  //         .then(() => {
  //             setUserData({});
  //             setIsAuth(false);
  //             document.cookie =
  //                 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  //             navigate('/');
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //             setMessage(error.response.data.error.message);
  //         });
  // };

  if (isAuth && userData) {
    return (
      <div className="account--container">
        <p>Hello {userData.firstName}!</p>
      </div>
    );
  }
  return <div>loading user data.....</div>;
}
