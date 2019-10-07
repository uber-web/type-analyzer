
# Change Log

All notable changes to kepler.gl will be documented in this file.

<!--
Each version should:
  List its release date in the above format.
  Group changes to describe their impact on the project, as follows:
  Added for new features.
  Changed for changes in existing functionality.
  Deprecated for once-stable features removed in upcoming releases.
  Removed for deprecated features removed in this release.
  Fixed for any bug fixes.
  Security to invite users to upgrade in case of vulnerabilities.
Ref: http://keepachangelog.com/en/0.3.0/
-->

#### [0.2.2] - Oct 07 2019 (b913061)
37de75d add eslint and prettier
0f10ab9 [Doc] Update README to add ignoredDataTypes
3e0134e remove TYPE city all together
2cf641b port internal type-analyzer commits over (currently at 1.5.0)

#### [0.2.1] - Jan 03 2019 (c6fb704)
4c2a767 Add CHANGELOG.md
f676778 Don't attempt to analyze missing columns.
94c97a9 Correct use of 'correctly'
7ea8360 Add tests, DRY up test util
460947e Fix: Don't attempt to analyze missing columns.

#### [0.2.0] - Apr 03 2018 (2eb75ca)
02989de 1 and 0 should be detected as int instead of boolean

#### [0.1.4] - Apr 03 2018 (f581c65)
fe0827b Added new date format regex: YYYY/M/D
40c1923 Added new date format regex

#### [0.1.3] - Feb 28 2018 (08741f6)
626a819 avoid detect time format in every type check

#### [0.1.2] - Jan 19 2018 (edcfcd9)
56810e3 recognize space in point pair, check geometry.type exist before calling .toUppercase

#### [0.1.1] Dec 18 2018 (e665758)
5376d1c add unix timestamp tests
c0734c9 added unix time format
a796a7b update readme, make year regex recognize 2 digit year
3d0fa1a from git@github.com:uber-web/type-analyzer.git


