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

import {NULL, DATA_TYPES, BOOLEAN_TRUE_VALUES, BOOLEAN_FALSE_VALUES} from './constant';
import RegexList from './regex-list';

/* eslint-disable max-len*/
/**
* Given an array of regexes to union, build a string of them
* @param {Array} arr - an array of regexes to be unioned
* @return {String} the unioned dstring
*/
function union(arr) {
  return '(' + arr.join('|') + ')';
}

// GENERATE ALL OF THE TIME REGEXES
const HH = '\\d{1,2}';
const H = '\\d{1,2}';
const h = '\\d{1,2}';
const m = '\\d{1,2}';
const s = '\\d{1,2}';
const ss = '\\d{2}';
const SSSS = '(\\.\\d{1,6})';
const mm = '\\d{2}';
const Z = '(\\+|-)\\d{1,2}:\\d{1,2}';
const ZZ = '(\\+|-)(\\d{4}|\\d{1,2}:\\d{2})';
const a = '(am|pm)';

// 1513629453477
const X = '\\b\\d{12,13}\\b';

// 123456789 123456789.123
const x = '\\b\\d{9,10}(\\.\\d{1,3})?\\b';

const TIME_FORMAT_STRINGS = [
  'X',
  'x',
  'H:m',
  'HH:mmZ',
  'h:m a',
  'H:m:s',
  'h:m:s a',
  'HH:mm:ssZZ',
  'HH:mm:ss.SSSS',
  'HH:mm:ss.SSSSZZ'
].reverse();
// the reverse is important to put the more specific regexs higher in the order
const TIME_FORMAT_REGEX_STRINGS = [
  X,
  x,
  H + ':' + m,
  HH + ':' + mm + Z,
  h + ':' + m + ' ' + a,
  H + ':' + m + ':' + s,
  H + ':' + m + ':' + s + ' ' + a,
  HH + ':' + mm + ':' + ss + ZZ,
  HH + ':' + mm + ':' + ss + SSSS,
  HH + ':' + mm + ':' + ss + SSSS + ZZ
].reverse();

// something like:
// {'(\d{2)....': 'M-D-YYYY'}
const TIME_FORMAT_REGEX_MAP = TIME_FORMAT_STRINGS
  .reduce(function generateRegexMap(timeFormats, str, index) {
    timeFormats[TIME_FORMAT_REGEX_STRINGS[index]] = str;
    return timeFormats;
  }, {});

const ALL_TIME_FORMAT_REGEX_STR = union(Object.keys(TIME_FORMAT_REGEX_MAP));
const ALL_TIME_FORMAT_REGEX = new RegExp('^' + ALL_TIME_FORMAT_REGEX_STR + '$', 'i');

// GENERATE ALL DATE FORMATS
const YYYY = '\\d{2,4}';
const M = '\\d{1,2}';
const MMM = union([
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]);
const MMMM = union([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]);
const D = '\\d{1,2}';
const DD = '\\d{2}';
const Do = '\\d{1,2}(st|nd|rd|th)';

const dateFormatRegexStrings = [
  YYYY + '-' + M + '-' + D,
  M + '\\/' + D + '\\/' + YYYY,
  MMMM + ' ' + DD + ', ' + YYYY,
  MMM + ' ' + DD + ', ' + YYYY,
  MMMM + ' ' + Do + ', ' + YYYY,
  MMM + ' ' + Do + ', ' + YYYY
];
const dateFormatStrings = [
  'YYYY-M-D',
  'M/D/YYYY',
  'MMMM DD, YYYY',
  'MMM DD, YYYY',
  'MMMM Do, YYYY',
  'MMM Do, YYYY'
];
const DATE_FORMAT_REGEX = new RegExp('^' + union(dateFormatRegexStrings) + '$', 'i');

// something like:
// {'(\d{2)....': 'M-D-YYYY'}
const DATE_FORMAT_REGEX_MAP = dateFormatStrings
  .reduce(function generateRegexMap(dateFormats, str, index) {
    dateFormats[dateFormatRegexStrings[index]] = str;
    return dateFormats;
  }, {});

// COMPUTE THEIR CROSS PRODUCT

// {'SOME HELLISH REGEX': 'YYYY HH:MM:SS'}
const DATE_TIME_MAP = Object.keys(DATE_FORMAT_REGEX_MAP)
  .reduce(function reduceDate(dateTimes, dateRegex) {
    const dateStr = DATE_FORMAT_REGEX_MAP[dateRegex];
    Object.keys(TIME_FORMAT_REGEX_MAP).forEach(function loopAcrosTimes(timeRegex) {
      const timeStr = TIME_FORMAT_REGEX_MAP[timeRegex];
      dateTimes[dateRegex + ' ' + timeRegex] = dateStr + ' ' + timeStr;
      dateTimes[dateRegex + 'T' + timeRegex] = dateStr + 'T' + timeStr;
      dateTimes[timeRegex + 'T' + dateRegex] = timeStr + 'T' + dateStr;
      dateTimes[timeRegex + ' ' + dateRegex] = timeStr + ' ' + dateStr;
    });
    return dateTimes;
  }, {});
const ALL_DATE_TIME_REGEX = new RegExp(union(Object.keys(DATE_TIME_MAP)));

/**
* Generate a function to discover which time format a value is
* @param {Regex} formatRegex - the filter to be checked and processed
* @param {Object} regexMap - Map between regex and associated format
* @return {Func} to the format checker
*/
function whichFormatGenerator(formatRegex, regexMap) {
  return function whichFormat(value: string) {
    if (formatRegex.test(value)) {
      const regexes = Object.keys(regexMap);
      for (let i = 0; i < regexes.length; i++) {
        const regex = regexes[i];
        const format = regexMap[regex];
        const newRegex = new RegExp(regex);
        if (newRegex.test(value)) {
          return format;
        }
      }
    }
    return false;
  };
}

export const whichFormatTime = whichFormatGenerator(ALL_TIME_FORMAT_REGEX, TIME_FORMAT_REGEX_MAP);
export const whichFormatDate = whichFormatGenerator(DATE_FORMAT_REGEX, DATE_FORMAT_REGEX_MAP);
export const whichFormatDateTime = whichFormatGenerator(ALL_DATE_TIME_REGEX, DATE_TIME_MAP);

export function buildRegexCheck(regexId: $Keys<typeof RegexList>) {
  return function check(value: string) {
    return RegexList[regexId].test(value.toString());
  };
}

export function detectTimeFormat(value: string, type: $Values<typeof DATA_TYPES>) {
  switch (type) {
  case DATA_TYPES.DATETIME:
    return whichFormatDateTime(value);
  case DATA_TYPES.DATE:
  default:
    return whichFormatDate(value);
  case DATA_TYPES.TIME:
    return whichFormatTime(value);
  }
}

export function findFirstNonNullValue(data: Object[], column) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][column] !== null && data[i][column] !== NULL) {
      return data[i][column];
    }
  }
  return null;
}

export function isBoolean(value: mixed) {
  return BOOLEAN_TRUE_VALUES
    .concat(BOOLEAN_FALSE_VALUES)
    .indexOf(String(value).toLowerCase()) > -1;
}

export function isGeographic(value: mixed) {
  return Boolean(value) && typeof value === 'object' && value !== null &&
      value.hasOwnProperty('type') && value.hasOwnProperty('coordinates');
}

export function isString(value: mixed) {
  return typeof value === 'string';
}

/* eslint-enable max-len*/
