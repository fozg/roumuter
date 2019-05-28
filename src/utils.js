const isNode = typeof global !== 'undefined';

const isBrowser =
  typeof window !== 'undefined' ||
  (isNode && typeof global.window !== 'undefined');

export { isNode, isBrowser };
