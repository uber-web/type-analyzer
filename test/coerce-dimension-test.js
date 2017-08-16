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

test('Analyzer: force dimension via rules', function t(assert) {

  var arr = [];
  var mapArr = function mapArr(d) {
    return {col: d, batmang: (d + 1)};
  };

  arr = [1, 0, 1, 0, 1, 0].map(mapArr);
  var ruleSet = [{regex: /col/, dataType: 'STRING'}];
  var colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'STRING',
    'correctly forces data to be read as strings');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  ruleSet = [{regex: /col/, dataType: 'NUMBER'}];
  colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'NUMBER',
    'correctly forces data to be read as numbers');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  ruleSet = [{regex: /col/, dataType: 'BOOLEAN'}];
  colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'BOOLEAN',
    'correctly forces data to be read as booleans');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  assert.end();
});

test('Analyzer: force dimension via rules - string match', function t(assert) {

  var arr = [];
  var mapArr = function mapArr(d) {
    return {col: d, batmang: (d + 1)};
  };

  arr = [1, 0, 1, 0, 1, 0].map(mapArr);
  var ruleSet = [{name: 'col', dataType: 'STRING'}];
  var colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'STRING',
    'correctly forces data to be read as strings');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  ruleSet = [{name: 'col', dataType: 'NUMBER'}];
  colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'NUMBER',
    'correctly forces data to be read as numbers');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  ruleSet = [{name: 'col', dataType: 'BOOLEAN'}];
  colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[0].type, 'BOOLEAN',
    'correctly forces data to be read as booleans');
  assert.equal(colMeta[1].type, 'INT',
    'leaves the non matching column alone and analyzes as normal');

  assert.end();
});

test('Analyzer: passing invalid rules', function t(assert) {

  var arr = [];
  var mapArr = function mapArr(d) {
    return {col: d, batmang: (d + 1)};
  };

  arr = [1, 0, 1, 0, 1, 0].map(mapArr);
  var ruleSet = [{key: 'col', dataType: 'STRING'}];
  var colMeta = Analyzer.computeColMeta(arr, ruleSet);
  assert.equal(colMeta[1].type, 'INT',
    'Ignores the invalid rules and analyzes as normal');

  assert.end();
});
