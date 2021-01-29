export const isAuthenticated = () => {
  return localStorage.getItem('authenticated') === '1';
};

export const getCurrentUserID = () => {
  return localStorage.getItem('uid');
};

export const setCurrentUserID = (uid) => {
  localStorage.setItem('uid', uid);
  localStorage.setItem('authenticated', '1');
};

export const clearCurrentUser = () => {
  localStorage.removeItem('uid');
  localStorage.removeItem('authenticated');
};
