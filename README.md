# type-analyzer

> Infer types from CSV columns.

## Overview

This package provides a single interface for generating the datatype for a given
row-column formatted dataset. We support the following datatypes:

* Geo-JSON,
* WKT Geometry,
* Boolean,
* Currency,
* Percent,
* DateTime,
* Date,
* Time,
* Int,
* Float,
* Number,
* Zipcode,
* City,
* String

## Installation

    npm install type-analyzer

## Usage

Usage is super simple, simply call computeColMeta on your data like so

```js
var Analyzer = require('type-analyzer').Analyzer;

var colMeta = Analyzer.computeColMeta(data);
```

But imagine you want to ensure that a column full of ids represented as numbers
is identified as a column of strings, type-analyzer's got you. Simply pass an
array of rules:

```js
var Analyzer = require('type-analyzer').Analyzer;

var colMeta = Analyzer.computeColMeta(data, [{name: 'id', dataType: 'STRING'}]);
// or
var colMeta = Analyzer.computeColMeta(data, [{regex: /id/, dataType: 'STRING'}]);

Note: Analyzer prefers rules using name over regex since better performance.
```

And it will short cut around the usual analysis system and give
you back the column formatted as you'd expect.


## Update
Breaking changes with v1.0.0: Regex has moved into src, but can more easily be
accessed from the module.exports from the root. As part of a larger clean up
many extraneous util files were removed.
