# routermute
Support push state to history without navigate.

## usage
import lib:
```js
import RouterMute from 'routermute'
```
create RouterMute store and subcrice
```js
var RouterMute = new RouterMute({
  path: '', // optional
  params: ["sort", "order"] // support object, arrays of string key
})

// subcrice changed
RouterMute.subcrice(params => {
  // => params: {sort: "..", order: ".."}
  // all search query string u define at `params` of RouterMute.
})
```

navigate
```js
RouterMute.navigate({sort: "Created", order: "ASC"});
// or
RouterMute.navigateTo(path, {sort: "Created", order: "ASC"});
```

// unsubcrice
```js
RouterMute.unsubcrice();
```
