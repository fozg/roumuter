// const Store = require('./Store');
class RouterMute {
  constructor({ path, params } = {}) {
    // super({});
    this.path = path;
    this.params = params || [];
  }

  navigate(navigateParams) {
    // this.setData(this.filterParams(params));
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
