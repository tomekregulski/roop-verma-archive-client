export const isValidJwt = () => {
  const allCookies = document.cookie.split('; ');
  const jwtKey = 'roop-verma-library';
  for (let i = 0; i < allCookies.length; i++) {
    const currentCookie = allCookies[i].split('=');
    if (currentCookie[0] === jwtKey) {
      return { foundJwt: true, jwt: currentCookie[1] };
    }
  }
  return;
};
