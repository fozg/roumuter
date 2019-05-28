# roumuter
Support push state to history without navigate.

## usage
import lib:
```js
import Roumuter from 'roumuter'
```
create Roumuter store and subscribe
```js
var Roumuter = new Roumuter({
  path: '', // optional
  params: ["sort", "order"] // support object, arrays of string key
})

// subscribe changed
Roumuter.subscribe(params => {
  // => params: {sort: "..", order: ".."}
  // all search query string u define at `params` of Roumuter.
})
```

navigate
```js
Roumuter.navigate({sort: "Created", order: "ASC"});
// or
Roumuter.navigateTo(path, {sort: "Created", order: "ASC"});
```

// unsubscribe
```js
Roumuter.unsubscribe();
```
