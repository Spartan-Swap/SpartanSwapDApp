export const withTimeout = (millis: number, promise: Promise<any> | undefined) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(
      () => reject(new Error(`Timed out after ${millis} ms.`)),
      millis
    );
  });
  return Promise.race([promise, timeout]);
};

/**
 * Check the status of a Promise.allSettled() item and return value or error message
 * @returns {uint} contract
 */
export const checkResolved = (settledItem: PromiseSettledResult<Response>, errorMsg:number) => {
  if (settledItem.status === 'fulfilled') {
    return settledItem.value
  }
  return errorMsg
}