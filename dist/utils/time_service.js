var times = {
  d: 24 * 60 * 60 * 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  s: 1000,
  ms: 1
};

// Create a type that represents the keys of `times`

/**
 * get time of string in milliseconds
 * @param {String} ts - from date [h, m, s, ms]
 * @param {String} to - to date [h, m, s, ms]
 * @returns {number} duration in milliseconds or specified string [h, m, s, ms]
 */
function parseTime(ts) {
  var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ms";
  var time = parseFloat(ts);
  if (ts.includes("d")) return time * times.d / times[to];else if (ts.includes("ms")) return time * times.ms / times[to];else if (ts.includes("m")) return time * times.m / times[to];else if (ts.includes("h")) return time * times.h / times[to];else if (ts.includes("s")) return time * times.s / times[to];else return parseInt(ts);
}
export { parseTime };