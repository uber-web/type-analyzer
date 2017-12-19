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

var test = require('./test-utils').test;
var Analyzer = require('../').Analyzer;

/* eslint-disable max-statements*/
test('Analyzer: date validator', function t(assert) {

  var arr = [];
  var mapArr = function mapArr(d) {
    return {col: d};
  };
  var result;

  // date formats:
  arr = ['2015-1-1', '2015-1-2', '2015-1-3'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'YYYY-M-D'},
    'Inteprets dates formatted as YYYY-M-D correctly');

  arr = ['1/1/2015', '1/2/2015', '1/3/2015'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'M/D/YYYY'},
    'Inteprets dates formatted as M/D/YYYY correctly');

  arr = ['1/1/15', '11/2/98', '1/31/00', '12/31/17'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'M/D/YYYY'},
    'Inteprets dates formatted as M/D/YYYY correctly');

  arr = [
    'January 01, 2015', 'January 02, 2015', 'January 03, 2015'
  ].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'MMMM DD, YYYY'},
    'Inteprets dates formatted as MMMM DD, YYYY correctly');

  arr = ['Jan 01, 2015', 'Jan 02, 2015', 'Jan 03, 2015'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'MMM DD, YYYY'},
    'Inteprets dates formatted as MMM DD, YYYY correctly');

  arr = ['Jan 1st, 2015', 'Jan 2nd, 2015', 'Jan 3rd, 2015'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'MMM Do, YYYY'},
    'Inteprets dates formatted as MMM Do, YYYY correctly');

  arr = [
    'January 1st, 2015', 'January 2nd, 2015', 'January 3rd, 2015'
  ].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATE', format: 'MMMM Do, YYYY'},
    'Inteprets dates formatted as MMMM Do, YYYY correctly');

  // time formats:
  arr = ['1:1', '2:2', '3:3'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'TIME', format: 'H:m'},
    'Inteprets dates formatted as H:m correctly');

  arr = ['1:1:1', '2:2:2', '3:3:3'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'TIME', format: 'H:m:s'},
    'Inteprets dates formatted as H:m:s correctly');

  arr = ['1:10 am', '2:20 am', '3:30 am'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'TIME', format: 'h:m a'},
    'Inteprets dates formatted as h:m a correctly');

  arr = ['113629453.122', '1536294531', '113629453.12'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'TIME', format: 'x'},
    'Inteprets unix time in seconds formatted as x correctly');

  arr = ['1513629453477', '913629453477', '1313629453477'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'TIME', format: 'X'},
    'Inteprets unix time in milliseconds formatted as X correctly');

  // date time formats:
  arr = ['2015-1-1 1:1:1', '2015-1-2 2:2:2', '2015-1-3 3:3:3'].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATETIME', format: 'YYYY-M-D H:m:s'},
    'Inteprets dates formatted as YYYY-M-D H:m:s correctly');

  arr = [
    '2015-1-1 1:1:1 am', '2015-1-2 2:2:2 am', '2015-1-3 3:3:3 am'
  ].map(mapArr);
  result = Analyzer.computeColMeta(arr)[0];
  assert.deepEqual({type: result.type, format: result.format},
    {type: 'DATETIME', format: 'YYYY-M-D h:m:s a'},
    'Inteprets dates formatted as YYYY-M-D h:m:s a correctly');

  arr = [
    {col: '2016-07-24T19:53:38.000Z'},
    {col: '2016-07-24T12:55:36.000Z'},
    {col: '2016-07-24T19:55:36.000Z'}
  ];

  result = Analyzer.computeColMeta(arr);
  assert.equal(result[0].type, 'DATETIME', 'Interprets col as datetime correctly');

  assert.end();
});
/* eslint-enable max-statements*/
