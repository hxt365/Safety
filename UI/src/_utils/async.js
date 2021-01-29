const timer = (t) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Time out'), t);
  });
};

export default timer;
