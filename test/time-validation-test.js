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

var whichFormatDate = require('../src/utils').whichFormatDate;
var whichFormatDateTime = require('../src/utils').whichFormatDateTime;

test('#whichFormatDate', function t(assert) {
  assert.equals(whichFormatDate('2015-1-1'), 'YYYY-M-D');
  assert.equals(whichFormatDate('2012-1-10'), 'YYYY-M-D');
  assert.equals(whichFormatDate('1/10/2012'), 'M/D/YYYY');
  assert.equals(whichFormatDate('January 02, 2012'), 'MMMM DD, YYYY');
  assert.equals(whichFormatDate('Jan 02, 2012'), 'MMM DD, YYYY');
  assert.equals(whichFormatDate('January 3rd, 2012'), 'MMMM Do, YYYY');
  assert.equals(whichFormatDate('Jan 2nd, 2012'), 'MMM Do, YYYY');
  assert.equals(whichFormatDate('Jan 22nd, 2012'), 'MMM Do, YYYY');
  assert.end();
});

test('#whichFormatDateTime', function t(assert) {
  assert.equals(whichFormatDateTime('1967/07/19 20:49:08.07'), 'YYYY/M/D HH:mm:ss.SSSS');
  assert.end();
});
