/** global window */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getTsNow = require('./getTsNow');
module.exports = (timeout = 10000, cb) => {
  if (typeof window === 'undefined') global.window = {}; //eslint-disable-line no-global-assign
  let start = window.__NOW__ || getTsNow(); // eslint-disable-line no-underscore-dangle
  let t;
  let measure = (...args) => {
    const timing = getTsNow() - start;
    clearTimeout(t);
    /* istanbul ignore if */
    if (window.__NOW__) {
      window.__NOW__ = 0; // eslint-disable-line no-underscore-dangle
    }
    /* istanbul ignore if */
    if (
      typeof cb === 'function' ||
      (typeof cb !== 'undefined' && cb.toString() === '[object Function]')
    ) {
      return cb.apply(null, [timing, ...args]);
    }
    return timing;
  };
  // clear out these potential memory leaks after 10s (we don't expect any operations to take that long)
  /* istanbul ignore next */
  t = setTimeout(() => {
    start = '';
    measure = '';
    /* istanbul ignore if */
    if (window.__NOW__) {
      window.__NOW__ = 0; // eslint-disable-line no-underscore-dangle
    }
  }, timeout);

  return measure;
};
