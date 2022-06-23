function test(title, func, callback) {
  try {
    callback();
    console.log(`${title} - PASS`);
  } catch (error) {
    console.error(`${title} - FAIL`);
    console.error(func);
    console.error(error);
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
  };
}

export { test, expect };
