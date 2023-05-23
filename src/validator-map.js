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

var CONSTANT = require('./constant');
var Utils = require('./utils');

var DATA_TYPES = CONSTANT.DATA_TYPES;
var VALIDATOR_MAP = {};

// geometry
VALIDATOR_MAP[DATA_TYPES.GEOMETRY] = Utils.isGeographic;
VALIDATOR_MAP[DATA_TYPES.GEOMETRY_FROM_STRING] =
  Utils.buildRegexCheck('isStringGeometry');
VALIDATOR_MAP[DATA_TYPES.PAIR_GEOMETRY_FROM_STRING] = Utils.buildRegexCheck(
  'isPairwisePointGeometry'
);

// basic boolean: true/false, 0/1
VALIDATOR_MAP[DATA_TYPES.BOOLEAN] = Utils.isBoolean;
VALIDATOR_MAP[DATA_TYPES.DATE_OBJECT] = Utils.isDateObject;

// prefix/postfix rules: '$30.00', '10.05%'
VALIDATOR_MAP[DATA_TYPES.CURRENCY] = Utils.buildRegexCheck('isCurrency');
VALIDATOR_MAP[DATA_TYPES.PERCENT] = Utils.buildRegexCheck('isPercentage');

// basic
VALIDATOR_MAP[DATA_TYPES.ARRAY] = Utils.isArray;
VALIDATOR_MAP[DATA_TYPES.OBJECT] = Utils.isObject;
// times
VALIDATOR_MAP[DATA_TYPES.DATETIME] = Utils.buildRegexCheck('isDateTime');

VALIDATOR_MAP[DATA_TYPES.DATE] = Utils.buildRegexCheck('isDate');
VALIDATOR_MAP[DATA_TYPES.TIME] = Utils.buildRegexCheck('isTime');

// VALIDATOR_MAP[DATA_TYPES.DATETIME] = Utils.whichFormatDateTime;
//
// VALIDATOR_MAP[DATA_TYPES.DATE] = Utils.whichFormatDate;
// VALIDATOR_MAP[DATA_TYPES.TIME] = Utils.whichFormatTime;

// numbers:
// 1, 2, 3, +40, 15,121
const intRegexCheck = Utils.buildRegexCheck('isInt');
function isInt(value) {
  if (intRegexCheck(value) || value == '0') {
    var asNum = parseInt(value.toString().replace(/(\+|,)/g, ''), 10);
    return asNum > Number.MIN_SAFE_INTEGER && asNum < Number.MAX_SAFE_INTEGER;
  }

  return false;
}
VALIDATOR_MAP[DATA_TYPES.INT] = isInt;

// 1.1, 2.2, 3.3
const floatRegexCheck = Utils.buildRegexCheck('isFloat');
function isFloat(value) {
  return floatRegexCheck(value) || isInt(value);
}
VALIDATOR_MAP[DATA_TYPES.FLOAT] = isFloat;

// 1, 2.2, 3.456789e+0
const zeroPaddedNumCheck = Utils.buildRegexCheck('isZeroPaddedNumber');

VALIDATOR_MAP[DATA_TYPES.NUMBER] = function isNumeric(row) {
  return (
    (!isNaN(row) && !zeroPaddedNumCheck(row)) || isInt(row) || isFloat(row)
  );
};

// strings: '94101-10', 'San Francisco', 'Name'
VALIDATOR_MAP[DATA_TYPES.ZIPCODE] = Utils.buildRegexCheck('isZipCode');
VALIDATOR_MAP[DATA_TYPES.STRING] = Utils.isString;

module.exports = VALIDATOR_MAP;
