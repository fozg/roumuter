import Store from './Store';
import querystring from 'query-string';
import { isBrowser } from './utils';

var Roumuter =
/*#__PURE__*/
function () {
  function Roumuter(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        path = _ref.path,
        params = _ref.params;

    // super({});
    this.path = path;
    this.params = params || [];
    this.Store = new Store({});
  }

  var _proto = Roumuter.prototype;

  _proto.init = function init() {
    if (isBrowser) {
      // get current params when new RouterMute created
      var searchUrl = querystring.parse(window.location.search);
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

  return Roumuter;
}();

export { Roumuter as default };