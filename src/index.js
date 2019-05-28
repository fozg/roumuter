import Store from './Store';
import querystring from 'query-string';
import { isBrowser } from './utils';

export default class Roumuter {
  constructor({ path, params } = {}) {
    // super({});
    this.path = path;
    this.params = params || [];
    this.Store = new Store({});
  }

  init() {
    if (isBrowser) {
      // get current params when new RouterMute created

      let searchUrl = querystring.parse(window.location.search);

      this.Store.setData(this.filterParams(searchUrl));
    }
  }

  navigate(navigateParams) {
    this.Store.setData(this.filterParams(navigateParams));
  }

  subscribe(cb) {
    this.Store.subscribe(cb);
  }

  filterParams(rawParams = {}) {
    if (Array.isArray(this.params)) {
      var result = {};
      Object.keys(rawParams)
        .filter(key => this.params.includes(key))
        .forEach(key => {
          result[key] = rawParams[key];
        });
      return result;
    } else if (typeof this.params === 'object') {
      if (Object.keys(rawParams).length !== 0) {
        var result = {};
        Object.keys(rawParams)
          .filter(key => Object.keys(this.params).includes(key))
          .forEach(key => {
            result[key] = rawParams[key];
          });
        return result;
      } else {       
        return this.params;
      }
    } else return {};
  }
}
