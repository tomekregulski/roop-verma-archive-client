import jwt_decode from 'jwt-decode';

export function fetchJwt() {
  console.log('fetching jwt');
  const allCookies = document.cookie.split('; ');
  let cookies = {};

  for (let i = 0; i < allCookies.length; i++) {
    const currentCookie = allCookies[i].split('=');
    cookies[currentCookie[0]] = currentCookie[1];
  }

  const jwtKey = 'roop-verma-library';

  if (Object.keys(cookies).includes(jwtKey)) {
    let currentJwt = cookies[jwtKey];
    let decodedToken = jwt_decode(currentJwt);
    let currentDate = new Date();

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      console.log('Token expired.');
      return;
    } else {
      console.log('Valid token');
      const jwt = {
        headers: {
          jwt: currentJwt,
        },
      };
      return jwt;
    }
  } else {
    console.log('No JWT found');
    return false;
  }
}
