export const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, carr) => [...a, carr[i]], [val]));
};

export const pluralize = (num, str) => {
  return num !== 1 ? `${str}s` : str;
};

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};
