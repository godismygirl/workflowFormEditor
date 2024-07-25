import React from 'react';

const useThrottle = (fn, delay = 500, dep = []) => {
  const { current } = React.useRef({ fn, timer: null });
  React.useEffect(
    function () {
      current.fn = fn;
    },
    [fn],
  );

  return React.useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
};

export default useThrottle;
