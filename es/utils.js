var isNode = typeof global !== 'undefined';
var isBrowser = typeof window !== 'undefined' || isNode && typeof global.window !== 'undefined';
export { isNode, isBrowser };