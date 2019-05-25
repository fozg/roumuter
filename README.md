# mute-router
Support push state to history without navigate.

## usage
import lib:
```js
import MuteRouter from 'mute-router'
```
create MuteRouter store and subcrice
```js
var muteRouter = new MuteRouter({
  path: '', // optional
  params: ["sort", "order"] // support object, arrays of string key
})

// subcrice changed
muteRouter.subcrice(params => {
  // => params: {sort: "..", order: ".."}
  // all search query string u define at `params` of MuteRouter.
})
```

navigate
```js
muteRouter.navigate({sort: "Created", order: "ASC"});
// or
muteRouter.navigateTo(path, {sort: "Created", order: "ASC"});
```

// unsubcrice
```js
muteRouter.unsubcrice();
```
