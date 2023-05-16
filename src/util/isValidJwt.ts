export const isValidJwt = () => {
  console.log('checking jwt...');
  const allCookies = document.cookie.split('; ');
  const jwtKey = 'roop-verma-library';
  for (let i = 0; i < allCookies.length; i++) {
    const currentCookie = allCookies[i].split('=');
    if (currentCookie[0] === jwtKey) {
      console.log('jwt found!');
      // TODO: check for expired
      return currentCookie[1];
    } else {
      console.log('no jwt found, please log in');
      return;
    }
  }
};
