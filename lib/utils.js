"use strict";

exports.__esModule = true;
exports.isBrowser = exports.isNode = void 0;
var isNode = typeof global !== 'undefined';
exports.isNode = isNode;
var isBrowser = typeof window !== 'undefined' || isNode && typeof global.window !== 'undefined';
exports.isBrowser = isBrowser;