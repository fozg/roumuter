"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _Store = _interopRequireDefault(require("./Store"));

var _queryString = _interopRequireDefault(require("query-string"));

var _utils = require("./utils");

var Roumuter =
/*#__PURE__*/
function () {
  function Roumuter(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        path = _ref.path,
        params = _ref.params;

    // super({});
    this.path = path || (_utils.isBrowser ? window.location.pathname : "");
    this.params = params || [];
    this.Store = new _Store["default"]({});
  }

  var _proto = Roumuter.prototype;

  _proto.init = function init() {
    if (_utils.isBrowser) {
      // get current params when new RouterMute created
      var searchUrl = _queryString["default"].parse(window.location.search);

      this.Store.setData(this.filterParams(searchUrl));
    }
  };

  _proto.navigate = function navigate(navigateParams) {
    var currentParams = this.Store.getData();
    var newParams = (0, _extends2["default"])({}, currentParams, navigateParams);

    if (_utils.isBrowser) {
      window.history.pushState(null, null, this.path + "?" + _queryString["default"].stringify(newParams));
    }

    this.Store.setData(this.filterParams(newParams));
  };

  _proto.navigate_remove = function navigate_remove(objects, isArrayValue) {
    var _this = this;

    var currentParams = this.Store.getData();
    var newParams = Object.assign({}, currentParams);
    Object.keys(objects).forEach(function (key) {
      var value = objects[key];

      if (newParams.hasOwnProperty(key)) {
        if (isArrayValue) {
          var newValue = newParams[key].split(",");
          newValue.splice(newValue.findIndex(function (o) {
            return o === value;
          }), 1);
          newParams[key] = newValue.join(",");
        } else {
          newParams[key] = null;
        }
      }

      window.history.pushState(null, null, _this.path + "?" + _queryString["default"].stringify(newParams));

      _this.Store.setData(_this.filterParams(newParams));
    });
  };

  _proto.reset = function reset() {
    if (_utils.isBrowser) {
      window.history.pushState(null, null, this.path + "?" + _queryString["default"].stringify(this.params));
    }

    this.Store.setData(this.filterParams(this.params));
  };

  _proto.subscribe = function subscribe(cb) {
    this.Store.subscribe(cb);
  };

  _proto.getSearchParmas = function getSearchParmas() {
    return this.Store.data;
  };

  _proto.filterParams = function filterParams(rawParams) {
    var _this2 = this;

    if (rawParams === void 0) {
      rawParams = {};
    }

    if (Array.isArray(this.params)) {
      var result = {};
      Object.keys(rawParams).filter(function (key) {
        return _this2.params.includes(key);
      }).forEach(function (key) {
        result[key] = rawParams[key];
      });
      return result;
    } else if (typeof this.params === "object") {
      if (Object.keys(rawParams).length !== 0) {
        var result = {};
        Object.keys(rawParams).filter(function (key) {
          return Object.keys(_this2.params).includes(key);
        }).forEach(function (key) {
          result[key] = rawParams[key];
        });
        return result;
      } else {
        return this.params;
      }
    } else return {};
  };

  return Roumuter;
}();

exports["default"] = Roumuter;