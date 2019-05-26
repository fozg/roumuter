const RouterMute = require('../index');

test('new RouterMute with path=/test and params=["sort","order"]', () => {
  const RouterM = new RouterMute({
    path: '/test',
    params: ['sort', 'order']
  });
  expect(RouterM).toHaveProperty('path', '/test');
  expect(RouterM).toHaveProperty('params', ['sort', 'order']);
});
