const RouterMute = require("../index");

test('filter by params array should works', () => {
  const RouterM = new RouterMute({
    path: "/test",
    params: ["sort", "order"]
  });
  console.log( RouterM.filterParams({
    sort: "created",
    order: "asc",
    unuseParam: "testing"
  }))
  expect(
    RouterM.filterParams({
      sort: "created",
      order: "asc",
      unuseParam: "testing"
    })
  ).toEqual({
    sort: "created",
    order: "asc"
  });
});
