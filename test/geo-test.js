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
var ExampleData = require('./example-data');
var Example = require('./example.json');
var LargeData = require('./sample-time-series-data-1.json');

test('Analyzer: Geo check', function t(assert) {
  var arr = ExampleData.LINE_STRING_GEO;
  var arrMeta = Analyzer.computeColMeta(arr);
  var expectedForArr = [
    {
      key: 'wkt',
      label: 'wkt',
      type: 'GEOMETRY_FROM_STRING',
      category: 'GEOMETRY',
      format: '',
      geoType: 'LINESTRING'
    },
    {
      key: 'feature',
      label: 'feature',
      type: 'PAIR_GEOMETRY_FROM_STRING',
      category: 'GEOMETRY',
      format: '',
      geoType: 'POINT'
    },
    {
      key: 'geojson',
      label: 'geojson',
      type: 'PAIR_GEOMETRY_FROM_STRING',
      category: 'GEOMETRY',
      format: '',
      geoType: 'POINT'
    },
    {
      key: 'treatment_group_key',
      label: 'treatment_group_key',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    },
    {
      key: 'marketplace',
      label: 'marketplace',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    }
  ];

  assert.deepEqual(
    arrMeta,
    expectedForArr,
    'should get geometry from string correct'
  );

  var geoJsonArr = [
    {col1: {type: 'Point', coordinates: [102.0, 0.5]}},
    {
      col1: {
        type: 'LineString',
        coordinates: [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0]
        ]
      }
    },
    {
      col1: {
        type: 'Polygon',
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      }
    }
  ];

  var expectedGeoMeta = [
    {
      key: 'col1',
      label: 'col1',
      type: 'GEOMETRY',
      category: 'GEOMETRY',
      format: '',
      geoType: 'POINT'
    }
  ];

  var geoMeta = Analyzer.computeColMeta(geoJsonArr);
  assert.deepEqual(
    expectedGeoMeta,
    geoMeta,
    'should get geometry from geojson correct'
  );
  assert.end();
});

test('Analyzer: geo from string validator', function t(assert) {
  var arr = [];
  var mapArr = function mapArr(d) {
    return {col: d};
  };

  [
    'POINT (-74.0771771596 40.8093839419)',
    'LINESTRING (-81.5676390228 28.3827075019, -81.551517 28.377852)',
    'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))',
    'MULTIPOINT ((10 40), (40 30), (20 20), (30 10))',
    'MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))',
    /* eslint-disable max-len*/
    'MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))'
    /* eslint-enable max-len*/
  ].forEach(function mapAcrossAllTypes(exampleData) {
    arr = [exampleData, exampleData, exampleData].map(mapArr);
    assert.equal(
      Analyzer.computeColMeta(arr)[0].type,
      'GEOMETRY_FROM_STRING',
      'Interprets WKT formatted geo as geo'
    );
    var expectedType = exampleData.split(' ')[0];
    assert.equal(
      Analyzer.computeColMeta(arr)[0].geoType,
      expectedType,
      `correctly indentifies ${expectedType} as WKT ${expectedType}s`
    );
  });

  arr = [
    '-45.03, 168.66',
    '[-45.03,168.66]',
    '[-45.0304885022762, 168.660729378619]'
  ].map(mapArr);
  assert.equal(
    Analyzer.computeColMeta(arr)[0].type,
    'PAIR_GEOMETRY_FROM_STRING',
    'correctly finds geometry from string for pair wise points'
  );
  assert.equal(
    Analyzer.computeColMeta(arr)[0].geoType,
    'POINT',
    'correctly correctly indetifies those strings as pairs'
  );

  assert.end();
});

/* eslint-disable max-len */
test('Analyzer: integration test', function t(assert) {
  var known = [
    {
      key: 'city_id',
      label: 'city_id',
      type: 'INT',
      category: 'MEASURE',
      format: ''
    },
    {
      key: 'ST_AsText',
      label: 'ST_AsText',
      type: 'GEOMETRY_FROM_STRING',
      category: 'GEOMETRY',
      format: '',
      geoType: 'MULTIPOLYGON'
    },
    {
      key: 'slug',
      label: 'slug',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    },
    {key: 'lat', label: 'lat', type: 'FLOAT', category: 'MEASURE', format: ''},
    {key: 'lng', label: 'lng', type: 'FLOAT', category: 'MEASURE', format: ''},
    {
      key: 'country_name',
      label: 'country_name',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    },
    {
      key: 'launch_date',
      label: 'launch_date',
      type: 'DATE',
      category: 'TIME',
      format: 'YYYY-M-D'
    },
    {
      key: 'region',
      label: 'region',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    }
  ];

  var analyzed = Analyzer.computeColMeta(Example);
  assert.deepEqual(
    analyzed,
    known,
    'Example data generates from dim cities should generate good columns'
  );
  assert.end();
});

test('Analyzer: nulls', function t(assert) {
  var nullExample = [
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: 1.2, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null}
  ];

  var known = [
    {
      category: 'TIME',
      format: 'YYYY-M-D HH:mm:ss.SSSS',
      key: 'a',
      label: 'a',
      type: 'DATETIME'
    },
    {category: 'MEASURE', format: '', key: 'b', label: 'b', type: 'FLOAT'}
  ];
  var rules = [
    {regex: /c/, dataType: 'DATETIME'},
    {regex: /d/, dataType: 'GEOMETRY_FROM_STRING'}
  ];
  var analyzed = Analyzer.computeColMeta(nullExample, rules, {
    dropUnknowns: true
  });
  assert.deepEqual(analyzed, known, 'Analyzer handles null data well');

  var newCoordData = [];
  for (var i = 0; i < 100; i++) {
    newCoordData.push({coordinates: ''});
  }
  assert.deepEqual(
    Analyzer.computeColMeta(newCoordData),
    [
      {
        category: 'DIMENSION',
        format: '',
        key: 'coordinates',
        label: 'coordinates',
        type: 'STRING'
      }
    ],
    'Handles conditional nulls well'
  );
  assert.end();
});

test('Analyzer: nulls without dropping unknowns, and just intepreting as string', function t(assert) {
  var nullExample = [
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: 1.2, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null},
    {a: '2016-11-04 12:43:36.711458', b: null, c: null, d: null}
  ];

  var known = [
    {
      category: 'TIME',
      format: 'YYYY-M-D HH:mm:ss.SSSS',
      key: 'a',
      label: 'a',
      type: 'DATETIME'
    },
    {category: 'MEASURE', format: '', key: 'b', label: 'b', type: 'FLOAT'},
    {category: 'TIME', format: '', key: 'c', label: 'c', type: 'DATETIME'},
    {
      category: 'GEOMETRY',
      format: '',
      key: 'd',
      label: 'd',
      type: 'GEOMETRY_FROM_STRING'
    }
  ];
  var rules = [
    {regex: /c/, dataType: 'DATETIME'},
    {regex: /d/, dataType: 'GEOMETRY_FROM_STRING'}
  ];
  var analyzed = Analyzer.computeColMeta(nullExample, rules);
  assert.deepEqual(analyzed, known, 'Analyzer handles null data well');
  assert.end();
});

test('Analyzer: long test', function t(assert) {
  var analyzed = Analyzer.computeColMeta(LargeData);

  var knownAnalysis = [
    {
      key: 'ts',
      label: 'ts',
      type: 'DATETIME',
      category: 'TIME',
      format: 'YYYY-M-D H:m:s'
    },
    {
      key: 'city',
      label: 'city',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    },
    {
      key: 'country',
      label: 'country',
      type: 'STRING',
      category: 'DIMENSION',
      format: ''
    },
    {
      key: 'metrics1',
      label: 'metrics1',
      type: 'INT',
      category: 'MEASURE',
      format: ''
    },
    {
      key: 'metrics2',
      label: 'metrics2',
      type: 'FLOAT',
      category: 'MEASURE',
      format: ''
    },
    {
      key: 'metrics3',
      label: 'metrics3',
      type: 'FLOAT',
      category: 'MEASURE',
      format: ''
    },
    {
      key: 'metrics4',
      label: 'metrics4',
      type: 'PERCENT',
      category: 'MEASURE',
      format: ''
    }
  ];
  assert.deepEqual(analyzed, knownAnalysis, 'Analyzer handles null data well');
  assert.end();
});

var coordData = require('./coord-data.json');

test('Analyzer: coords', function t(assert) {
  var analyzed = Analyzer.computeColMeta(coordData);
  var expected = [
    {
      category: 'GEOMETRY',
      format: '',
      geoType: 'POINT',
      key: 'coordinates',
      label: 'coordinates',
      type: 'PAIR_GEOMETRY_FROM_STRING'
    }
  ];
  assert.deepEqual(
    expected,
    analyzed,
    'Handle data formatted as pairs of coordinates correctly'
  );
  assert.end();
});
/* eslint-enable max-len */
