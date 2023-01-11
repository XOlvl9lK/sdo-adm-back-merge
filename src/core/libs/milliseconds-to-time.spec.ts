import { millisecondsToTime } from '@core/libs/milliseconds-to-time';

const milliseconds = [1543006500, 15430065000, 15465000, 1005000];

describe('milliseconds-to-time', () => {
  test('Should return time in correct format', () => {
    const result = milliseconds.map(ms => millisecondsToTime(ms));

    expect(result).toEqual(['28:36:46', '86:07:45', '04:17:45', '00:16:45']);
  });
});
