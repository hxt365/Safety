import { getCurrentUserID } from '_store';
import { getUserDetailURL, getFollowUserURL } from '_constants/api';
import axios from './axios';

export const getUser = (uid) => {
  const url = getUserDetailURL(uid);
  return axios
    .get(url)
    .then((res) => ({ user: res.data, ok: true }))
    .catch((err) => ({ res: err.response, ok: false }));
};

export const getCurrentUser = () => {
  const uid = getCurrentUserID();
  return getUser(uid);
};

export const follow = (uid) => {
  const url = getFollowUserURL(uid);
  return axios
    .post(url)
    .then((res) => ({ res: res.data, ok: true }))
    .catch((err) => ({ res: err.response, ok: false }));
};

export const updateCurrentUser = (data) => {
  const uid = getCurrentUserID();
  const url = getUserDetailURL(uid);
  return axios
    .patch(url, data)
    .then((res) => ({ user: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const updateUserLocation = (longitude, latitude) => {
  return updateCurrentUser({ location: `POINT(${longitude} ${latitude})` });
};

export const deleteAccount = () => {
  const uid = getCurrentUserID();
  const url = getUserDetailURL(uid);
  return axios
    .delete(url)
    .then((res) => ({ msg: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};
