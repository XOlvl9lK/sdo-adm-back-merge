export const forEachAsync = async <T>(array: T[], callback: (value: T) => Promise<void>) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i])
  }
}