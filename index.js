import Store from './Store';
class RouterMute {
  constructor({ path, params } = {}) {
    // super({});
    this.path = path;
    this.params = params || [];
    this.Store = new Store(this.params);
  }

  navigate(navigateParams) {
    // this.setData(this.filterParams(params));
  }

  subscribe(cb) {
    this.Store.subscribe(cb);
  }

  filterParams(rawParams = {}) {
    if (true) {
      var result = {};
      Object.keys(rawParams)
        .filter(key => this.params.includes(key))
        .forEach(key => {
          result[key] = rawParams[key];
        });
      return result;
    } else {
      return {};
    }
  }
}

module.exports = RouterMute;
