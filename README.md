# Polybase-db
A wrapper for Firebase Realtime Database made in Polymer 3.
It auto-updates/fetch data in each update that Firebase notifies, also has methods for add/update/remove.

## Configuration
You should setup a configuration file with the settings attached below or set it after the import (of course, erase the import then).

```javascript
 var config = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com"
 }
 ````

## Methods

- toArray(): Yes, because Firebase will storage the data as a JSON and JSONs not are actually an array, so this element has a built-in translator that translates each key to a array position:
```json
{
    "one": {
        "name": "foo"
    },
    "two": {
        "name": "bar"
    }
}
```

will be

```javascript
[
    { id: "one", name: "foo" },
    { id: "two", name: "bar" }
] // keys name will be moved inside the property "id"
```

WIP...

---
License: MIT

2017 - Daniel Blanco Parla