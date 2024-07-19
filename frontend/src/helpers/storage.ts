export const getStorage = () => {
  return navigator.cookieEnabled ? window.localStorage : null;
};
