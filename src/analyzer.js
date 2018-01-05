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

import CONSTANT from './constant';
import VALIDATOR_MAP from './validator-map';
import {
  findFirstNonNullValue,
  detectTimeFormat
} from './utils';

const NUMBER_OF_ALLOWED_HITS = 3;

const Analyzer = {};

function _category(colType) {
  return CONSTANT.TYPES_TO_CATEGORIES[colType] || CONSTANT.CATEGORIES.DIMENSION;
}

const VALIDATOR_CONSIDERS_EMPTY_STRING_NULL = {
  PAIR_GEOMETRY_FROM_STRING: true,
  GEOMETRY_FROM_STRING: true,
  NUMBER: true
};

/**
* Check if a given value is a null for a validator
* @param {String} value - value to be checked if null
* @param {String} validatorName - the name of the current validation function
* @return {Boolean} whether or not the current value is null
**/
function valueIsNullForValidator(value, validatorName) {
  if (value === null || value === CONSTANT.NULL) {
    return true;
  }

  if (value === '' && VALIDATOR_CONSIDERS_EMPTY_STRING_NULL[validatorName]) {
    return true;
  }

  return false;
}

function buildValidatorFinder(data, columnName) {
  return function findTypeFromValidators(validatorName) {
    // you get three strikes until we dont think you are this type
    const nonNullData = data.filter(function iterator(row) {
      const value = row[columnName];
      return !valueIsNullForValidator(value, validatorName);
    });
    const strikes = Math.min(NUMBER_OF_ALLOWED_HITS, nonNullData.length);
    const hits = 0;
    nonNullData.some(function iterateAcrossData(row) {
      const value = row[columnName];
      if (Boolean(VALIDATOR_MAP[validatorName](value)) === false) {
        strikes -= 1;
      } else {
        hits += 1;
      }
      if (strikes <= 0) {
        return true;
      }
      return false;
    });
    return strikes > 0 && hits > 0;
  };
}

function getTypeFromRules(analyzerRules, columnName) {
  return (analyzerRules || []).reduce(function checkClmns(newType, rule) {
    if (newType) {
      return newType;
    }
    if (rule.name && rule.name === columnName) {
      return rule.dataType;
    }
    if (rule.regex && rule.regex.test(columnName)) {
      return rule.dataType;
    }
    return newType;
  }, false);
}

/**
* Generate metadata about columns in a dataset
* @param {Object} data - data for which meta will be generated
* @param {Object} analyzerRules - regexs describing column overrides
* @return {Object} column metadata
**/
function computeColMeta(data: Object[], analyzerRules) {
  if (!data || Object.keys(data).length === 0) {
    return [];
  }
  const _columns = Object.keys(data[0]);
  /* eslint-disable max-statements */
  return _columns.reduce(function iterator(res, columnName) {
    let format = '';
    // First try to get the column from the rules
    let type = getTypeFromRules(analyzerRules, columnName);
    // If it's not there then try to infer the type
    if (!type) {
      type = CONSTANT.VALIDATORS.find(buildValidatorFinder(data, columnName));
    }
    // if theres still no type, dump this column
    const category = _category(type);
    if (!type) {
      return res;
    }
    // if its a time, detect and record the time
    if (type && CONSTANT.TIME_VALIDATORS.indexOf(type) !== -1) {
      // Find the first non-null value.
      const sample = findFirstNonNullValue(data, columnName);
      if (sample === null) {
        return res;
      }
      format = detectTimeFormat(sample, type);
    }

    const colMeta = {
      key: columnName,
      label: columnName,
      type: type,
      category: category,
      format: format
    };

    if (type === CONSTANT.DATA_TYPES.GEOMETRY) {
      const geoSample = findFirstNonNullValue(data, columnName);
      if (geoSample === null) {
        return res;
      }
      colMeta.geoType = geoSample.type.toUpperCase();
    }
    if (type === CONSTANT.DATA_TYPES.GEOMETRY_FROM_STRING) {
      const geoStringSample = findFirstNonNullValue(data, columnName);
      if (geoStringSample === null) {
        return res;
      }
      colMeta.geoType = geoStringSample.split(' ')[0].toUpperCase();
    }
    if (type === CONSTANT.DATA_TYPES.PAIR_GEOMETRY_FROM_STRING) {
      colMeta.geoType = 'POINT';
    }
    res.push(colMeta);
    return res;
  }, []);
};
/* eslint-enable max-statements */
