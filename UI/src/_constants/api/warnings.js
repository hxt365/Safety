export const LIST_WARNINGS_URL = '/warnings/';

export const getUserWarningsURL = (uid) => {
  return `${LIST_WARNINGS_URL}users/${uid}/`;
};

export const getWarningDetailURL = (wid) => {
  return `${LIST_WARNINGS_URL}${wid}/`;
};

export const getUpvoteWarningURL = (wid) => {
  return `/warnings/${wid}/upvote/`;
};

export const getDevoteWarningURL = (wid) => {
  return `/warnings/${wid}/devote/`;
};

export const getListWarningsURLWithParams = (distance, inHours, fromFollowees) => {
  return `${LIST_WARNINGS_URL}?distance=${distance}&in_hours=${inHours}&from_followees=${fromFollowees}`;
};

export const getCommentsOfWarningURL = (wid) => {
  return `/warnings/${wid}/comments/`;
};
