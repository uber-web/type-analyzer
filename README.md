# type-analyzer

Infer data types from CSV columns.

## Overview

This package provides a single interface for generating the datatype for a given
row-column formatted dataset. We support the following datatypes:

* **DATE**
* **TIME**
* **DATETIME**
* **NUMBER**
* **INT**
* **FLOAT**
* **CURRENCY**
* **PERCENT**
* **STRING**
* **ZIPCODE**
* **BOOLEAN**
* **GEOMETRY**
* **GEOMETRY_FROM_STRING**
* **PAIR_GEOMETRY_FROM_STRING**
* **NONE**

## Installation

    npm install type-analyzer

## Usage

### `Analyzer.computeColMeta(data, rules, options)` (Function)

**Parameters**

-  `data` **Array**  _required_ An array of row object
-  `rules` **Array**  _optional_ An array of custom regex rules
-  `options` **Object**  _optional_ Option object
-  `options.ignoreDataTypes` **Array**  _optional_ Data types to ignore

```js
var Analyzer = require('type-analyzer').Analyzer;
var data = [
    {
        "ST_AsText": "MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))",
        "name": "san_francisco",
        "lat": "37.7749295",
        "lng": "-122.4194155",
        "launch_date": "2010-06-05",
        "added_at": "2010-06-05 12:00"
    },
    {
        "ST_AsText": "MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))",
        "name": "paris",
        "lat": "48.856666",
        "lng": "2.3509871",
        "launch_date": "2011-12-04",
        "added_at": "2010-06-05 12:00"
    },
]
var colMeta = Analyzer.computeColMeta(data);
```
- **`rules`**

You can pass in an array of custom rules. For example. if you want to ensure that a column full of ids represented as numbers is identified as a column of strings. Rules can be matched with either exact `name` of the column, or `regex` used to match names. Note: Analyzer prefers rules using name over regex since better performance.

```js
var Analyzer = require('type-analyzer').Analyzer;

var colMeta = Analyzer.computeColMeta(data, [{name: 'id', dataType: 'STRING'}]);
// or
var colMeta = Analyzer.computeColMeta(data, [{regex: /id/, dataType: 'STRING'}]);
```

- **`options.ignoreDataTypes`**

You can also pass in `ignoreDataTypes` to ignore certain types. This will improve your type checking performance.

```js
var DATA_TYPES = require('type-analyzer').DATA_TYPES;

var colMeta = Analyzer.computeColMeta(arr, [], {ignoredDataTypes: DATA_TYPES.CURRENCY})[0].type,
```

And it will short cut around the usual analysis system and give
you back the column formatted as you'd expect.

### `DATA_TYPES`

You can import all availale types as a constant.


## Update
Breaking changes with v1.0.0: Regex has moved into src, but can more easily be
accessed from the module.exports from the root. As part of a larger clean up
many extraneous util files were removed.
