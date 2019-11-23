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

// These help you test
// this file is not a test suite for app utils

var tapeTest = require('tape');

var testDurations = [];

function test(name, spec) {
  tapeTest(name, function onTest() {
    var start = Date.now();
    spec(...arguments);
    var duration = Date.now() - start;
    testDurations.push({name: name, duration: duration});
  });
}

module.exports = {
  test: test,

  report: function report() {
    testDurations.forEach(function loopAcrossDurations(t) {
      /* eslint-disable no-console, no-undef */
      console.log('Test "' + t.name + '" took ' + t.duration + ' ms');
      /* eslint-enable no-console, no-undef */
    });
  }
};
