export const checkJwt = () => {
  const allCookies = document.cookie.split('; ');
  let cookies = {};
  for (let i = 0; i < allCookies.length; i++) {
    const currentCookie = allCookies[i].split('=');
    cookies[currentCookie[0]] = currentCookie[1];
  }
  const jwtKey = 'roop-verma-library';
  let currentJwt;
  if (Object.keys(cookies).includes(jwtKey)) {
    currentJwt = cookies[jwtKey];
    return currentJwt;
  } else {
    return currentJwt;
  }
};
