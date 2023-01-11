export function millisecondsToTime(ms: number) {
  function pad(n: number, z?: number) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  let milliseconds = ms % 1000;
  ms = (ms - milliseconds) / 1000;
  let secs = ms % 60;
  ms = (ms - secs) / 60;
  let mins = ms % 60;
  let hrs = (ms - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}
