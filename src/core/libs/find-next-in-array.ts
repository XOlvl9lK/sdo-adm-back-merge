export const findNextInArray = <T>(
  array: T[],
  fromIndex: number,
  direction: 'UP' | 'DOWN',
  conditionCallback: (element: T) => boolean,
): T => {
  if (direction === 'DOWN') {
    for (let i = fromIndex + 1; i < array.length; i++) {
      if (conditionCallback(array[i])) return array[i];
    }
  } else {
    for (let i = fromIndex - 1; i >= 0; i--) {
      if (conditionCallback(array[i])) return array[i];
    }
  }
};
