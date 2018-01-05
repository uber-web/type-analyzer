// @flow
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

export const DATA_TYPES = {
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
  CITY: 'CITY',
  ZIPCODE: 'ZIPCODE',

  // boolean type
  BOOLEAN: 'BOOLEAN',

  // geometry
  GEOMETRY: 'GEOMETRY',
  GEOMETRY_FROM_STRING: 'GEOMETRY_FROM_STRING',
  PAIR_GEOMETRY_FROM_STRING: 'PAIR_GEOMETRY_FROM_STRING',

  NONE: 'NONE'
};

export const CATEGORIES: $ReadOnly<typeof CATEGORIES> = {
  GEOMETRY: 'GEOMETRY',
  TIME: 'TIME',
  DIMENSION: 'DIMENSION',
  MEASURE: 'MEASURE'
};

export const BOOLEAN_TRUE_VALUES = ['true', 'yes', '1'];
export const BOOLEAN_FALSE_VALUES = ['false', 'no', '0'];

export const NULL = 'NULL';

export const POSSIBLE_TYPES = {
  [CATEGORIES.GEOMETRY]: [
    DATA_TYPES.GEOMETRY_FROM_STRING,
    DATA_TYPES.PAIR_GEOMETRY_FROM_STRING,
    DATA_TYPES.GEOMETRY
  ],

  [CATEGORIES.TIME]: [
    DATA_TYPES.DATETIME,
    DATA_TYPES.DATE,
    DATA_TYPES.TIME
  ],

  [CATEGORIES.DIMENSION]: [
    DATA_TYPES.STRING,
    DATA_TYPES.BOOLEAN,
    DATA_TYPES.CITY,
    DATA_TYPES.ZIPCODE
  ],

  [CATEGORIES.MEASURE]: [
    DATA_TYPES.NUMBER,
    DATA_TYPES.INT,
    DATA_TYPES.FLOAT,
    DATA_TYPES.CURRENCY,
    DATA_TYPES.PERCENT
  ]
};

export const TYPES_TO_CATEGORIES = Object.keys(POSSIBLE_TYPES)
  .reduce(function generateTypeToCategoryMap(res, category) {
    POSSIBLE_TYPES[category].forEach(function loopAcrossTypes(type) {
      res[type] = category;
    });
    return res;
  }, {});

// NOTE: the order of validator is important.
// the ancestor validator used to be the subset of next validator
// here's trying to determine a more accuraet data type of the column.
// later on, users still can override the data type.
// this will affect how we trasnform(aggregation), formating the data.
export const VALIDATORS = [
  // geometry
  DATA_TYPES.GEOMETRY,
  DATA_TYPES.GEOMETRY_FROM_STRING,
  DATA_TYPES.PAIR_GEOMETRY_FROM_STRING,

  // true/false, 0/1
  DATA_TYPES.BOOLEAN,

  // prefix/postfix rules
  DATA_TYPES.CURRENCY,
  DATA_TYPES.PERCENT,

  // times
  DATA_TYPES.DATETIME,
  DATA_TYPES.DATE,
  DATA_TYPES.TIME,

  // numbers
  DATA_TYPES.INT,
  DATA_TYPES.FLOAT,
  DATA_TYPES.NUMBER,

  // strings
  DATA_TYPES.ZIPCODE,
  DATA_TYPES.CITY,
  DATA_TYPES.STRING
];

export const TIME_VALIDATORS = [
  DATA_TYPES.DATETIME,
  DATA_TYPES.DATE,
  DATA_TYPES.TIME
];
