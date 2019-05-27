/**
 * @jest-environment jest-environment-jsdom-global
 */

const RouterMute = require('../index');

test('init should work', () => {
  jsdom.reconfigure({
    url: 'https://mock.com?test=1'
  });

  function callback(data) {
    expect(data).toEqual({test: "1"});
  }

  const RouterM = new RouterMute({ params: ['test'] });
  RouterM.subscribe(callback);
  RouterM.init();
});
