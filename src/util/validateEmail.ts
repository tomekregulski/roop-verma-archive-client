export function validateEmail(email: string): string | false {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (email !== '') {
    if (email.match(validRegex)) {
      return false;
    } else {
      return 'Please enter a valid email address';
    }
  } else {
    return false;
  }
}
