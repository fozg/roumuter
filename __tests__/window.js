const RouterMute = require('../index');

global.window = {};
global.window.location = {};
global.window.location.search = '?test=abc&test2=ddd';

test('the subcribe should return {} when init', () => {
  function callback(data) {
    expect(data).toEqual({});
  }

  const RouterM = new RouterMute({params: 'test'});
  RouterM.subscribe(callback);
});
