import { LOGIN_URL, LOGOUT_URL } from '_constants/api';
import axios from './axios';

export const login = (token) => {
  return axios
    .post(LOGIN_URL, { token })
    .then((res) => ({ res: res.data, ok: true }))
    .catch((err) => ({ res: err.response, ok: false }));
};

export const logout = () => {
  return axios
    .post(LOGOUT_URL)
    .then((res) => ({ res: res.data, ok: true }))
    .catch((err) => ({ res: err.response, ok: false }));
};
