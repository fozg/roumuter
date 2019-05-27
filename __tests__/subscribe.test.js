const RouterMute = require('../index');

test('the subcribe should return {} when init', () => {
  function callback(data) {
    expect(data).toEqual({});
  }

  const RouterM = new RouterMute({});
  RouterM.subscribe(callback);
});

test('Test navigate', () => {
  // navigate
  function callbackWhenNavigate(data) {
    expect(data).toEqual({ sort: 'Created', order: 'ASC' });
  }

  const RouterN = new RouterMute({ path: '', params: ['sort', 'order'] });
  RouterN.subscribe(callbackWhenNavigate);
  RouterN.navigate({ sort: 'Created', order: 'ASC' });
});
