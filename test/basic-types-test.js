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
/* eslint-disable max-statements */

'use strict';

var test = require('./test-utils').test;

var Analyzer = require('../').Analyzer;
var EXAMPLE_STRING_NUMBER = require('./example-data').EXAMPLE_STRING_NUMBER;

function mapArr(d) {
  return {col: d};
}

test('Analyzer: basic functionality', function t(assert) {
  assert.deepEqual(
    Analyzer.computeColMeta([]),
    [],
    'doesnt freak out when you hand it empty data'
  );
  assert.deepEqual(
    Analyzer.computeColMeta(undefined),
    [],
    'doesnt freak out when you hand it nothing'
  );

  var arr = [1, null, '3', undefined, -5].map(mapArr);
  assert.deepEqual(
    Analyzer.computeColMeta(arr)[0].type,
    'INT',
    'doesnt freak out when you hand it nulls and undefineds'
  );

  assert.end();
});

test('Analyzer: boolean validator', function t(assert) {
  var arr = [];

  arr = [1, 0, 1, 0, 1, 0].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'INT',
    'Inteprets ones and zeros as int, not booleans'
  );

  arr = ['true', 'false', 'true', 'false', 'true', 'false'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'BOOLEAN',
    'Inteprets true and false strings as booleans'
  );

  arr = ['yes', 'no', 'yes', 'no', 'yes', 'no'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'BOOLEAN',
    'Inteprets yes and no strings as booleans'
  );

  assert.end();
});

test('Analyzer: array validator', function t(assert) {
  var arr = [];

  arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['1', 'b'], ['2', 3], ['he']].map(
    mapArr
  );
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'ARRAY',
    'Should interpret as Array, if data contain js array'
  );

  arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['1', 'b'], ['2', 3], ['he']]
    .map((v) => JSON.stringify(v))
    .map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'ARRAY',
    'Should interpret as Array, if data contain js stringify array'
  );

  assert.end();
});

test('Analyzer: object validator', function t(assert) {
  var arr = [];

  arr = [{a: 1}, [4, 5, 6], {b: 2}, {c: 3}, {d: 4}, {d: 5}].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'OBJECT',
    'Should interpret as Object, if data contain js object'
  );

  arr = [{a: 1}, [4, 5, 6], {b: 2}, {c: 3}, {d: 4}, {d: 5}]
    .map((v) => JSON.stringify(v))
    .map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'OBJECT',
    'Should interpret as Object, if data contain json string'
  );

  assert.end();
});

test('Analyzer: number validator', function t(assert) {
  var arr = [];

  arr = [1, '222,222', '-333,333,333', -4, '+5,000'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'INT',
    'Inteprets values as integers'
  );

  arr = [NaN, NaN, NaN, 1, '222,222', '-333,333,333', -4, '+5,000'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'INT',
    'Treats NaNs as nulls and inteprets values as integer'
  );

  arr = ['-.1111', '+.2', '+3,333.3333', 444.4444, '5,555,555.5'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'FLOAT',
    'Inteprets values as floats'
  );

  arr = [
    1,
    '222,222',
    '-333,333,333',
    -4,
    '+5,000',
    '-.1111',
    '+.2',
    '+3,333.3333',
    444.4444,
    '5,555,555.5'
  ].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'FLOAT',
    'Inteprets a mix of int and float values as floats'
  );

  arr = [
    NaN,
    NaN,
    NaN,
    '-.1111',
    '+.2',
    '+3,333.3333',
    444.4444,
    '5,555,555.5'
  ].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'FLOAT',
    'Treats NaNs as nulls still inteprets values as floats'
  );

  arr = ['$1', '$0.12', '$1.12', '$1,000.12', '$1,000.12'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'CURRENCY',
    'Inteprets values as currency'
  );
  arr = ['$1', '$0.12', '$1.12', '$1,000.12', '$1,000.12'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr, [], {ignoredDataTypes: 'CURRENCY'})[0].type,
    'STRING',
    'Inteprets values with ignoredDataType:CURRENCY as string'
  );

  arr = ['10.12345%', '-10.222%', '+1,000.33%', '10.4%', '10.55%'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'PERCENT',
    'Inteprets values as percents'
  );

  arr = [
    '\\N',
    '\\N',
    '\\N',
    '10.12345%',
    '-10.222%',
    '+1,000.33%',
    '10.4%',
    '10.55%'
  ].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'PERCENT',
    'Ignore database nulls, and inteprets values as percents'
  );

  [2.3, '+4,000', '-5,023.234', '2.3e+2', '$23,203', '23.45%'].forEach(
    function loopAcrossExamples(ex) {
      arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
      assert.equal(
        Analyzer.computeColMeta(arr)[0].category,
        'MEASURE',
        'Inteprets sci or money valeus, eg ' +
          ex +
          ' formatted values as numbers'
      );
    }
  );

  arr = EXAMPLE_STRING_NUMBER.map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'NUMBER',
    'Inteprets values as numbers'
  );
  assert.end();

  arr = ['182891173641581479', '2e53', '1e16', 182891173641581479].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'NUMBER',
    'Inteprets large numeric values as numbers'
  );

  arr = [
    1,
    '222,222',
    '-333,333,333',
    -4,
    '+5,000',
    '-.1111',
    '+.2',
    '+3,333.3333',
    444.4444,
    '5,555,555.5',
    '182891173641581479',
    '2e53',
    '1e16',
    182891173641581479
  ].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'NUMBER',
    'Inteprets a mix of numeric values as numbers'
  );
});

test('Analyzer: string validator', function t(assert) {
  var arr = [];

  ['Aasdaaaa', 'Bbdsabbb', 'Ccccc', 'Ddddd', 'EeeDe'].forEach(
    function loopAcrossExamples(ex) {
      arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
      assert.equal(
        Analyzer.computeColMeta(arr)[0].type,
        'STRING',
        'Interprets ' + ex + ' strings a string'
      );
    }
  );

  ['San Francisco', 'New York', 'Chicago', 'Austin', 'Los Angeles'].forEach(
    function loopAcrossExamples(ex) {
      arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
      assert.equal(
        Analyzer.computeColMeta(arr)[0].type,
        'STRING',
        'Interprets ' + ex + ' strings a string'
      );
    }
  );
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
      'Interprets ' + ex + ' strings a string'
    );
  });

  arr = ['\\N', '\\N', '\\N', '\\N', '\\N'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr, [], {keepUnknowns: true})[0].type,
    'STRING',
    'Interprets as a string'
  );

  assert.end();
});

test('Analyzer: Zipcode', function t(assert) {
  var arr = ['01059', '02280', '05003'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr, [], {keepUnknowns: true})[0].type,
    'ZIPCODE',
    'Interprets 0 padded zipcode a string'
  );

  assert.end();
});

test('Analyzer: FIPS', function t(assert) {
  // census tract
  var arr = ['01001020801', '01001020801'].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr, [], {keepUnknowns: true})[0].type,
    'STRING',
    'Interprets 0 padded fips a string'
  );

  assert.end();
});

test('Analyzer: handling of unknown types', function t(assert) {
  var arr = [];

  ['', null, undefined, ''].forEach(function loopAcrossExamples(ex) {
    arr = [ex, ex, ex, ex, ex, ex].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr, [], {
        keepUnknowns: true
      })[0].type,
      'STRING',
      'Interprets ' + ex + ' as a string'
    );
  });

  assert.end();
});
