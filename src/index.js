import Store from "./Store";
import querystring from "query-string";
import { isBrowser } from "./utils";

export default class Roumuter {
  constructor({ path, params } = {}) {
    // super({});
    this.path = path || (isBrowser ? window.location.pathname : "");
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
    let currentParams = this.Store.getData();
    let newParams = { ...currentParams, ...navigateParams };
    if (isBrowser) {
      window.history.pushState(
        null,
        null,
        `${this.path}?${querystring.stringify(newParams)}`
      );
    }
    this.Store.setData(this.filterParams(newParams));
  }

  navigate_remove(objects, isArrayValue) {
    let currentParams = this.Store.getData();
    let newParams = Object.assign({}, currentParams);
    Object.keys(objects).forEach(key => {
      var value = objects[key];
      if (newParams.hasOwnProperty(key)) {
        if (isArrayValue) {
          let newValue = newParams[key].split(",");
          newValue.splice(newValue.findIndex(o => o === value), 1);
          newParams[key] = newValue.join(",");
        } else {
          newParams[key] = null;
        }
      }
      window.history.pushState(
        null,
        null,
        `${this.path}?${querystring.stringify(newParams)}`
      );
      this.Store.setData(this.filterParams(newParams));
    });
  }

  reset() {
    if (isBrowser) {
      window.history.pushState(
        null,
        null,
        `${this.path}?${querystring.stringify(this.params)}`
      );
    }
    this.Store.setData(this.filterParams(this.params));
  }

  subscribe(cb) {
    this.Store.subscribe(cb);
  }

  getSearchParmas() {
    return this.Store.data;
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
    } else if (typeof this.params === "object") {
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
