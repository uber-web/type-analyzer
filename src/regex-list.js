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

'use strict';

export const RegexList = {
  // accepts: 10, 2.3, +4,000, -5,023.234, 2.3e+2, 4,234.56e-2, $23,203, 23.45%
  isNumber: /^(\+|\-)?\$?[\d,]*\.?\d+((e|E)(\+|\-)\d+)?%?$/,

  // accepts: 12, +123, -12,234
  isInt: /^(\+|\-)?[\d,]+$/,

  // accepts: 1.1234, -.1234, +2.34
  isFloat: /^(\+|\-)?[\d,]*\.\d+?$/,

  // accepts: $1 $0.12 $1.12 $1,000.12 $1,000.12
  isCurrency: /(?=.)^\$(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?$/,

  // accepts: 34%, -23.45%, +2,234.23%
  isPercentage: /^(\+|\-)?[\d,]*\.?\d+%$/,

  // accepts:
  // US: 12345, 12345-1234
  // China: 123456, 123456-12
  // we can have more zipcode from different coyntries :
  // http://www.regxlib.com/Search.aspx?k=zipcode&c=-1&m=-1&ps=20
  isZipCode: /(^\d{5}$)|(^\d{5}-\d{4}$)|(^\d{6}$)|(^\d{6}-\d{2}$)/,

  // maybe we should import a list of cities we have.
  // reference: http://stackoverflow.com/a/25677072
  isCity: /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,

  // accepts: WKT string types
  // reference: https://en.wikipedia.org/wiki/Well-known_text
  isStringGeometry:
    /^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON)/,
  isPairwisePointGeometry:
    /(\+|\-)?\d*\.\d*,(\+|\-)?\d*\.\d*/
};
