// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
'use strict';

var CONSTANT = {
  DATA_TYPES: {
    // date time formats
    DATE: 'DATE',
    TIME: 'TIME',
    DATETIME: 'DATETIME',

    // number formats
    NUMBER: 'NUMBER',
    INT: 'INT',
    FLOAT: 'FLOAT',
    CURRENCY: 'CURRENCY',
    PERCENT: 'PERCENT',

    // string types:
    STRING: 'STRING',
    ZIPCODE: 'ZIPCODE',

    // boolean type
    BOOLEAN: 'BOOLEAN',

    // geometry
    GEOMETRY: 'GEOMETRY',
    GEOMETRY_FROM_STRING: 'GEOMETRY_FROM_STRING',
    PAIR_GEOMETRY_FROM_STRING: 'PAIR_GEOMETRY_FROM_STRING',

    // object format
    NONE: 'NONE',
    ARRAY: 'ARRAY',
    DATE_OBJECT: 'DATE_OBJECT',
    OBJECT: 'OBJECT'
  },

  CATEGORIES: {
    GEOMETRY: 'GEOMETRY',
    TIME: 'TIME',
    DIMENSION: 'DIMENSION',
    MEASURE: 'MEASURE'
  },

  BOOLEAN_TRUE_VALUES: ['true', 'yes'],
  BOOLEAN_FALSE_VALUES: ['false', 'no'],

  // Common in databases like MySQL: https://dev.mysql.com/doc/refman/8.0/en/null-values.html
  DB_NULL: '\\N',
  NULL: 'NULL'
};

CONSTANT.POSSIBLE_TYPES = {};

CONSTANT.POSSIBLE_TYPES[CONSTANT.CATEGORIES.GEOMETRY] = [
  CONSTANT.DATA_TYPES.GEOMETRY_FROM_STRING,
  CONSTANT.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING,
  CONSTANT.DATA_TYPES.GEOMETRY
];

CONSTANT.POSSIBLE_TYPES[CONSTANT.CATEGORIES.TIME] = [
  CONSTANT.DATA_TYPES.DATETIME,
  CONSTANT.DATA_TYPES.DATE,
  CONSTANT.DATA_TYPES.TIME
];

CONSTANT.POSSIBLE_TYPES[CONSTANT.CATEGORIES.DIMENSION] = [
  CONSTANT.DATA_TYPES.STRING,
  CONSTANT.DATA_TYPES.BOOLEAN,
  CONSTANT.DATA_TYPES.ZIPCODE
];

CONSTANT.POSSIBLE_TYPES[CONSTANT.CATEGORIES.MEASURE] = [
  CONSTANT.DATA_TYPES.NUMBER,
  CONSTANT.DATA_TYPES.INT,
  CONSTANT.DATA_TYPES.FLOAT,
  CONSTANT.DATA_TYPES.CURRENCY,
  CONSTANT.DATA_TYPES.PERCENT
];

CONSTANT.TYPES_TO_CATEGORIES = Object.keys(CONSTANT.POSSIBLE_TYPES).reduce(
  function generateTypeToCategoryMap(res, category) {
    CONSTANT.POSSIBLE_TYPES[category].forEach(function loopAcrossTypes(type) {
      res[type] = category;
    });
    return res;
  },
  {}
);

// NOTE: the order of validator is important.
// the ancestor validator used to be the subset of next validator
// here's trying to determine a more accuraet data type of the column.
// later on, users still can override the data type.
// this will affect how we trasnform(aggregation), formating the data.
CONSTANT.VALIDATORS = [
  // geometry
  CONSTANT.DATA_TYPES.GEOMETRY,
  CONSTANT.DATA_TYPES.GEOMETRY_FROM_STRING,
  CONSTANT.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING,

  // true/false, 0/1
  CONSTANT.DATA_TYPES.BOOLEAN,
  CONSTANT.DATA_TYPES.ARRAY,
  CONSTANT.DATA_TYPES.DATE_OBJECT,
  CONSTANT.DATA_TYPES.OBJECT,

  // prefix/postfix rules
  CONSTANT.DATA_TYPES.CURRENCY,
  CONSTANT.DATA_TYPES.PERCENT,

  // times
  CONSTANT.DATA_TYPES.DATETIME,
  CONSTANT.DATA_TYPES.DATE,
  CONSTANT.DATA_TYPES.TIME,

  // numbers
  CONSTANT.DATA_TYPES.INT,
  CONSTANT.DATA_TYPES.FLOAT,
  CONSTANT.DATA_TYPES.NUMBER,

  // strings
  CONSTANT.DATA_TYPES.ZIPCODE,
  CONSTANT.DATA_TYPES.STRING
];

CONSTANT.TIME_VALIDATORS = [
  CONSTANT.DATA_TYPES.DATETIME,
  CONSTANT.DATA_TYPES.DATE,
  CONSTANT.DATA_TYPES.TIME
];

module.exports = CONSTANT;
