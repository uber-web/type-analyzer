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
var EXAMPLE_STRING_NUMBER = require('./example-data').EXAMPLE_STRING_NUMBER;

function mapArr(d) {
  return {col: d};
}

test('Analyzer: basic functionality', function t(assert) {
  assert.deepEqual(Analyzer.computeColMeta([]), [],
    'doesnt freak out when you hand it empty data');
  assert.deepEqual(Analyzer.computeColMeta(undefined), [],
    'doesnt freak out when you hand it nothing');

  var arr = [1, null, '3', undefined, -5].map(mapArr);
  assert.deepEqual(Analyzer.computeColMeta(arr)[0].type, 'INT',
    'doesnt freak out when you hand it nulls and undefineds');

  assert.end();
});

test('Analyzer: boolean validator', function t(assert) {
  var arr = [];

  arr = [1, 0, 1, 0, 1, 0].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'INT',
    'correctly inteprets ones and zeros as int, not booleans');

  arr = ['true', 'false', 'true', 'false', 'true', 'false'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'BOOLEAN',
    'correctly inteprets true and false strings as booleans');

  arr = ['yes', 'no', 'yes', 'no', 'yes', 'no'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'BOOLEAN',
    'correctly inteprets yes and no strings as booleans');

  assert.end();
});

test('Analyzer: number validator', function t(assert) {
  var arr = [];

  arr = [1, '222,222', '-333,333,333', -4, '+5,000'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'INT',
    'Inteprets values as integers');

  arr = ['-.1111', '+.2', '+3,333.3333', 444.4444, '5,555,555.5'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'FLOAT',
    'Inteprets values as floats');

  arr = ['$1', '$0.12', '$1.12', '$1,000.12', '$1,000.12'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'CURRENCY',
    'Inteprets values as currency');

  arr = ['10.12345%', '-10.222%', '+1,000.33%', '10.4%', '10.55%'].map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'PERCENT',
    'Inteprets values as percents');

  [
    2.3,
    '+4,000',
    '-5,023.234',
    '2.3e+2',
    '$23,203',
    '23.45%'
  ].forEach(function loopAcrossExamples(ex) {
    arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr)[0].category,
      'MEASURE',
      'Inteprets sci or money valeus, eg ' + ex + ' formatted values as numbers'
    );
  });

  arr = EXAMPLE_STRING_NUMBER.map(mapArr);
  assert.equal(Analyzer.computeColMeta(arr)[0].type, 'NUMBER',
    'Inteprets values as numbers');
  assert.end();
});

test('Analyzer: string validator', function t(assert) {
  var arr = [];

  [
    'Aasdaaaa',
    'Bbdsabbb',
    'Ccccc',
    'Ddddd',
    'EeeDe'
  ].forEach(function loopAcrossExamples(ex) {
    arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr)[0].type,
      'CITY',
      'Interprets ' + ex + ' strings a city'
    );
  });

  ['San Francisco', 'New York', 'Chicago', 'Austin', 'Los Angeles'
  ].forEach(function loopAcrossExamples(ex) {
    arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr)[0].type,
      'CITY',
      'Interprets ' + ex + ' strings a city'
    );
  });

  [
    '13 Domestic Whole',
    '11 Domestic New',
    '13 Domestic Whole',
    '11 Domestic New',
    '21 International New'
  ].forEach(function loopAcrossExamples(ex) {
    arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr)[0].type,
      'STRING',
      'Interprets ' + ex + ' as a string'
    );
  });

  assert.end();
});
