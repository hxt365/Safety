import {
  LIST_WARNINGS_URL,
  getWarningDetailURL,
  getListWarningsURLWithParams,
  getUpvoteWarningURL,
  getDevoteWarningURL,
  getCommentsOfWarningURL,
} from '_constants/api';
import axios from './axios';

export const getWarnings = ({ distance = 500, inHours = 1, fromFollowees = false }) => {
  const url = getListWarningsURLWithParams(distance, inHours, fromFollowees);
  return axios
    .get(url)
    .then((res) => ({ warnings: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const getDetailWarning = (wid) => {
  const url = getWarningDetailURL(wid);
  return axios
    .get(url)
    .then((res) => ({ warning: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const createWarning = (data) => {
  return axios
    .post(LIST_WARNINGS_URL, data)
    .then((res) => ({ warning: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const deleteWarning = (wid) => {
  const url = getWarningDetailURL(wid);
  return axios
    .delete(url)
    .then((res) => ({ msg: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const upvoteWarning = (wid) => {
  const url = getUpvoteWarningURL(wid);
  return axios
    .post(url)
    .then((res) => ({ warning: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const devoteWarning = (wid) => {
  const url = getDevoteWarningURL(wid);
  return axios
    .post(url)
    .then((res) => ({ warning: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const getCommentsOfWarning = (url) => {
  return axios
    .get(url)
    .then((res) => ({ comments: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};

export const commentWarning = (wid, comment) => {
  const url = getCommentsOfWarningURL(wid);
  return axios
    .post(url, comment)
    .then((res) => ({ comment: res.data, ok: true }))
    .catch((err) => ({ msg: err.response, ok: false }));
};
