const NANOSECONDS_PER_MILLISECOND = 1000000;
const MILLISECONDS_PER_SECOND = 1000;
const getTsNow = () => {
  try {
    if (typeof performance === "undefined") {
      performance = require("perf_hooks").performance; //eslint-disable-line no-global-assign
    }

    return performance.now(); // eslint-disable-line no-underscore-dangle
  } catch (e) {
    // Node older than 8.5 doesn't have perf_hooks so this should cover
    return process.hrtime()[0] * MILLISECONDS_PER_SECOND;
  }
};
getTsNow.NANOSECONDS_PER_MILLISECOND = NANOSECONDS_PER_MILLISECOND;
getTsNow.MILLISECONDS_PER_SECOND = MILLISECONDS_PER_SECOND;
module.exports = getTsNow;
