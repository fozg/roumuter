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

export { Store as default };