import axios from 'axios';

import { REFRESH_TOKEN_URL } from '_constants/api';

const BASE_API_URL = `${process.env.REACT_APP_BASE_API_URL}`;

const customAxios = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

const refreshToken = () => {
  customAxios.post(REFRESH_TOKEN_URL);
};

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config && error.response?.status === 401) {
      return refreshToken().then(() => {
        return axios.request(error.config);
      });
    }
    return Promise.reject(error);
  },
);

export default customAxios;
