# routermute
Support push state to history without navigate.

## usage
import lib:
```js
import RouterMute from 'routermute'
```
create RouterMute store and subscribe
```js
var RouterMute = new RouterMute({
  path: '', // optional
  params: ["sort", "order"] // support object, arrays of string key
})

// subscribe changed
RouterMute.subscribe(params => {
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

// unsubscribe
```js
RouterMute.unsubscribe();
```
