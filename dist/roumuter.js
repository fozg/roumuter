(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  var Store =
  /*#__PURE__*/
  function () {
    function Store(data) {
      this.cbs = [];
      this.data = data;
    }

    var _proto = Store.prototype;

    _proto.setData = function setData(newData) {
      this.data = newData;

      for (var i = this.cbs.length - 1; i >= 0; i--) {
        if (this.cbs[i]) this.cbs[i](newData);
      }
    };

    _proto.getData = function getData() {
      return this.data;
    };

    _proto.subscribe = function subscribe(cb) {
      this.cbs.push(cb);
    };

    _proto.unsubscribe = function unsubscribe(observer) {
      var index = this.cbs.indexOf(observer);

      if (~index) {
        this.cbs.splice(index, 1);
      }
    };

    _proto.unSubscribeAll = function unSubscribeAll() {
      this.cbs = [];
    };

    return Store;
  }();

  var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

  var token = '%[a-f0-9]{2}';
  var singleMatcher = new RegExp(token, 'gi');
  var multiMatcher = new RegExp('(' + token + ')+', 'gi');

  function decodeComponents(components, split) {
  	try {
  		// Try to decode the entire string first
  		return decodeURIComponent(components.join(''));
  	} catch (err) {
  		// Do nothing
  	}

  	if (components.length === 1) {
  		return components;
  	}

  	split = split || 1;

  	// Split the array in 2 parts
  	var left = components.slice(0, split);
  	var right = components.slice(split);

  	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }

  function decode(input) {
  	try {
  		return decodeURIComponent(input);
  	} catch (err) {
  		var tokens = input.match(singleMatcher);

  		for (var i = 1; i < tokens.length; i++) {
  			input = decodeComponents(tokens, i).join('');

  			tokens = input.match(singleMatcher);
  		}

  		return input;
  	}
  }

  function customDecodeURIComponent(input) {
  	// Keep track of all the replacements and prefill the map with the `BOM`
  	var replaceMap = {
  		'%FE%FF': '\uFFFD\uFFFD',
  		'%FF%FE': '\uFFFD\uFFFD'
  	};

  	var match = multiMatcher.exec(input);
  	while (match) {
  		try {
  			// Decode as big chunks as possible
  			replaceMap[match[0]] = decodeURIComponent(match[0]);
  		} catch (err) {
  			var result = decode(match[0]);

  			if (result !== match[0]) {
  				replaceMap[match[0]] = result;
  			}
  		}

  		match = multiMatcher.exec(input);
  	}

  	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
  	replaceMap['%C2'] = '\uFFFD';

  	var entries = Object.keys(replaceMap);

  	for (var i = 0; i < entries.length; i++) {
  		// Replace all decoded components
  		var key = entries[i];
  		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  	}

  	return input;
  }

  var decodeUriComponent = function (encodedURI) {
  	if (typeof encodedURI !== 'string') {
  		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
  	}

  	try {
  		encodedURI = encodedURI.replace(/\+/g, ' ');

  		// Try the built in decoder first
  		return decodeURIComponent(encodedURI);
  	} catch (err) {
  		// Fallback to a more advanced decoder
  		return customDecodeURIComponent(encodedURI);
  	}
  };

  var splitOnFirst = (string, separator) => {
  	if (!(typeof string === 'string' && typeof separator === 'string')) {
  		throw new TypeError('Expected the arguments to be of type `string`');
  	}

  	if (separator === '') {
  		return [string];
  	}

  	const separatorIndex = string.indexOf(separator);

  	if (separatorIndex === -1) {
  		return [string];
  	}

  	return [
  		string.slice(0, separatorIndex),
  		string.slice(separatorIndex + separator.length)
  	];
  };

  function encoderForArrayFormat(options) {
  	switch (options.arrayFormat) {
  		case 'index':
  			return key => (result, value) => {
  				const index = result.length;
  				if (value === undefined) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[', index, ']'].join('')];
  				}

  				return [
  					...result,
  					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
  				];
  			};

  		case 'bracket':
  			return key => (result, value) => {
  				if (value === undefined) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[]'].join('')];
  				}

  				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
  			};

  		case 'comma':
  			return key => (result, value, index) => {
  				if (value === null || value === undefined || value.length === 0) {
  					return result;
  				}

  				if (index === 0) {
  					return [[encode(key, options), '=', encode(value, options)].join('')];
  				}

  				return [[result, encode(value, options)].join(',')];
  			};

  		default:
  			return key => (result, value) => {
  				if (value === undefined) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, encode(key, options)];
  				}

  				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
  			};
  	}
  }

  function parserForArrayFormat(options) {
  	let result;

  	switch (options.arrayFormat) {
  		case 'index':
  			return (key, value, accumulator) => {
  				result = /\[(\d*)\]$/.exec(key);

  				key = key.replace(/\[\d*\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}

  				accumulator[key][result[1]] = value;
  			};

  		case 'bracket':
  			return (key, value, accumulator) => {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};

  		case 'comma':
  			return (key, value, accumulator) => {
  				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
  				const newValue = isArray ? value.split(',') : value;
  				accumulator[key] = newValue;
  			};

  		default:
  			return (key, value, accumulator) => {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }

  function encode(value, options) {
  	if (options.encode) {
  		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  	}

  	return value;
  }

  function decode$1(value, options) {
  	if (options.decode) {
  		return decodeUriComponent(value);
  	}

  	return value;
  }

  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	}

  	if (typeof input === 'object') {
  		return keysSorter(Object.keys(input))
  			.sort((a, b) => Number(a) - Number(b))
  			.map(key => input[key]);
  	}

  	return input;
  }

  function removeHash(input) {
  	const hashStart = input.indexOf('#');
  	if (hashStart !== -1) {
  		input = input.slice(0, hashStart);
  	}

  	return input;
  }

  function extract(input) {
  	input = removeHash(input);
  	const queryStart = input.indexOf('?');
  	if (queryStart === -1) {
  		return '';
  	}

  	return input.slice(queryStart + 1);
  }

  function parse(input, options) {
  	options = Object.assign({
  		decode: true,
  		arrayFormat: 'none'
  	}, options);

  	const formatter = parserForArrayFormat(options);

  	// Create an object with no prototype
  	const ret = Object.create(null);

  	if (typeof input !== 'string') {
  		return ret;
  	}

  	input = input.trim().replace(/^[?#&]/, '');

  	if (!input) {
  		return ret;
  	}

  	for (const param of input.split('&')) {
  		let [key, value] = splitOnFirst(param.replace(/\+/g, ' '), '=');

  		// Missing `=` should be `null`:
  		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  		value = value === undefined ? null : decode$1(value, options);

  		formatter(decode$1(key, options), value, ret);
  	}

  	return Object.keys(ret).sort().reduce((result, key) => {
  		const value = ret[key];
  		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
  			// Sort object keys, not values
  			result[key] = keysSorter(value);
  		} else {
  			result[key] = value;
  		}

  		return result;
  	}, Object.create(null));
  }

  var extract_1 = extract;
  var parse_1 = parse;

  var stringify = (object, options) => {
  	if (!object) {
  		return '';
  	}

  	options = Object.assign({
  		encode: true,
  		strict: true,
  		arrayFormat: 'none'
  	}, options);

  	const formatter = encoderForArrayFormat(options);
  	const keys = Object.keys(object);

  	if (options.sort !== false) {
  		keys.sort(options.sort);
  	}

  	return keys.map(key => {
  		const value = object[key];

  		if (value === undefined) {
  			return '';
  		}

  		if (value === null) {
  			return encode(key, options);
  		}

  		if (Array.isArray(value)) {
  			return value
  				.reduce(formatter(key), [])
  				.join('&');
  		}

  		return encode(key, options) + '=' + encode(value, options);
  	}).filter(x => x.length > 0).join('&');
  };

  var parseUrl = (input, options) => {
  	return {
  		url: removeHash(input).split('?')[0] || '',
  		query: parse(extract(input), options)
  	};
  };

  var queryString = {
  	extract: extract_1,
  	parse: parse_1,
  	stringify: stringify,
  	parseUrl: parseUrl
  };

  var isNode = typeof global !== 'undefined';
  var isBrowser = typeof window !== 'undefined' || isNode && typeof global.window !== 'undefined';

  var RouterMute =
  /*#__PURE__*/
  function () {
    function RouterMute(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          path = _ref.path,
          params = _ref.params;

      // super({});
      this.path = path;
      this.params = params || [];
      this.Store = new Store({});
    }

    var _proto = RouterMute.prototype;

    _proto.init = function init() {
      if (isBrowser) {
        // get current params when new RouterMute created
        var searchUrl = queryString.parse(window.location.search);
        this.Store.setData(this.filterParams(searchUrl));
      }
    };

    _proto.navigate = function navigate(navigateParams) {
      this.Store.setData(this.filterParams(navigateParams));
    };

    _proto.subscribe = function subscribe(cb) {
      this.Store.subscribe(cb);
    };

    _proto.filterParams = function filterParams(rawParams) {
      var _this = this;

      if (rawParams === void 0) {
        rawParams = {};
      }

      if (Array.isArray(this.params)) {
        var result = {};
        Object.keys(rawParams).filter(function (key) {
          return _this.params.includes(key);
        }).forEach(function (key) {
          result[key] = rawParams[key];
        });
        return result;
      } else {
        return {};
      }
    };

    return RouterMute;
  }();

  module.exports = RouterMute;

}));
