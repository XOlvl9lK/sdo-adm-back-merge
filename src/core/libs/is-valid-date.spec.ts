import { isValidDate } from '@core/libs/is-valid-date';

const validDate = new Date();
const invalidDate = new Date('asd');

describe('isValidDate', () => {
  test('Should return true on valid date', () => {
    const result = isValidDate(validDate);

    expect(result).toBe(true);
  });

  test('Should return false on invalid date', () => {
    const result = isValidDate(invalidDate);

    expect(result).toBe(false);
  });
});
