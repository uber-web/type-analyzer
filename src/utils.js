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
var RegexList = require('./regex-list');
var TimeRegex = require('./time-regex');
/* eslint-disable max-len*/

/**
 * Generate a function to discover which time format a value is
 * @param {Regex} formatRegex - the filter to be checked and processed
 * @param {Object} regexMap - Map between regex and associated format
 * @return {Func} to the format checker
 */
function whichFormatGenerator(formatRegex, regexMap) {
  return function whichFormat(value) {
    if (formatRegex.test(value)) {
      var regexes = Object.keys(regexMap);
      for (var i = 0; i < regexes.length; i++) {
        var regex = regexes[i];
        var format = regexMap[regex];
        var newRegex = new RegExp(regex);
        if (newRegex.test(value)) {
          return format;
        }
      }
    }
    return false;
  };
}

var whichFormatTime = whichFormatGenerator(
  TimeRegex.ALL_TIME_FORMAT_REGEX,
  TimeRegex.TIME_FORMAT_REGEX_MAP
);
var whichFormatDate = whichFormatGenerator(
  TimeRegex.DATE_FORMAT_REGEX,
  TimeRegex.DATE_FORMAT_REGEX_MAP
);
var whichFormatDateTime = whichFormatGenerator(
  TimeRegex.ALL_DATE_TIME_REGEX,
  TimeRegex.DATE_TIME_MAP
);

// is a json string
function tryParseJsonString(str) {
  let parsed;
  try {
    parsed = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return parsed;
}

function isString(value) {
  return typeof value === 'string';
}

function isObject(value) {
  return (
    value === Object(value) &&
    typeof value !== 'function' &&
    !Array.isArray(value)
  );
}

function isObjectString(str) {
  if (!isString(str)) {
    return false;
  }
  if (!RegexList.isObject.test(str)) {
    return false;
  }
  const parsed = tryParseJsonString(str);
  return Boolean(parsed && isObject(parsed));
}

function isArray(value) {
  return Array.isArray(value);
}

function isArrayString(str) {
  if (!isString(str)) {
    return false;
  }
  if (!RegexList.isArray.test(str)) {
    return false;
  }
  const parsed = tryParseJsonString(str);
  return Boolean(parsed && isArray(parsed));
}

var Utils = {
  buildRegexCheck: function buildRegexCheck(regexId) {
    return function check(value) {
      return RegexList[regexId].test(value.toString());
    };
  },

  detectTimeFormat: function detectTimeFormat(value, type) {
    switch (type) {
      case CONSTANT.DATA_TYPES.DATETIME:
        return whichFormatDateTime(value);
      case CONSTANT.DATA_TYPES.DATE:
      default:
        return whichFormatDate(value);
      case CONSTANT.DATA_TYPES.TIME:
        return whichFormatTime(value);
    }
  },

  findFirstNonNullValue: function findFirstNonNullValue(data, column) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][column] !== null && data[i][column] !== CONSTANT.NULL) {
        return data[i][column];
      }
    }
    return null;
  },

  isBoolean: function isBoolean(value) {
    return (
      CONSTANT.BOOLEAN_TRUE_VALUES.concat(
        CONSTANT.BOOLEAN_FALSE_VALUES
      ).indexOf(String(value).toLowerCase()) > -1
    );
  },

  isGeographic: function isGeographic(value) {
    return (
      Boolean(value) &&
      typeof value === 'object' &&
      value.hasOwnProperty('type') &&
      value.hasOwnProperty('coordinates')
    );
  },

  // string types
  isString: isString,

  isArray: function _isArray(value) {
    return Boolean(isArray(value) || isArrayString(value));
  },

  isDateObject: function isDateObject(value) {
    // Note: invalid Dates return true as well as valid Dates.
    return value instanceof Date;
  },

  isObject: function _isObject(value) {
    return Boolean(isObject(value) || isObjectString(value));
  },

  whichFormatTime: whichFormatTime,
  whichFormatDate: whichFormatDate,
  whichFormatDateTime: whichFormatDateTime
};

/* eslint-enable max-len*/

module.exports = Utils;
