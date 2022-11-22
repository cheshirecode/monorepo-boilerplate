import { describe, expect, it } from 'vitest';

import {
  deepFilter,
  getPageSizeOptions,
  getRoundedToNearest,
  pascalToSeparatedWords,
  splitAlphanumeric,
  toCamel
} from './';

describe('@/utils', () => {
  it('pascalToSeparatedWords', () => {
    expect(pascalToSeparatedWords('')).toEqual('');
    expect(pascalToSeparatedWords({})).toEqual('[object-object]');
    expect(pascalToSeparatedWords('fontFamily')).toEqual('font-family');
    expect(pascalToSeparatedWords('fontFamilyExtra')).toEqual('font-family-extra');
    expect(pascalToSeparatedWords('FontFamily')).toEqual('font-family');
    expect(pascalToSeparatedWords('fontFamily', '_')).toEqual('font_family');
    expect(pascalToSeparatedWords('font-family', '_')).toEqual('font-family');
  });

  it('splitAlphanumeric', () => {
    expect(splitAlphanumeric('')).toEqual(null);
    expect(splitAlphanumeric([])).toEqual(null);
    expect(splitAlphanumeric({})).toEqual(['[object', 'Object]']);
    expect(splitAlphanumeric('Aa')).toEqual(['Aa']);
    expect(splitAlphanumeric('a1b2')).toEqual(['a', '1', 'b', '2']);
  });

  it('toCamel', () => {
    expect(toCamel('')).toEqual('');
    expect(toCamel('fooBar')).toEqual('fooBar');
    expect(toCamel('-moz-border-radius')).toEqual('MozBorderRadius');
    expect(toCamel('moz-border-radius')).toEqual('mozBorderRadius');
    expect(toCamel('snake_case')).toEqual('snakeCase');
    expect(toCamel('_snake_case')).toEqual('SnakeCase');
  });

  it('deepFilter', () => {
    expect(deepFilter([])).toEqual([]);
    expect(deepFilter([], '')).toEqual([]);
    expect(deepFilter(['123'], '12')).toEqual(['123']);
    expect(deepFilter(['123', '145', '2'], '1,4,')).toEqual(['123', '145']);
    expect(deepFilter(['123'], '124')).toEqual([]);
    expect(deepFilter(['123', ['1', '2', '3'], ['2', '3']], '1')).toEqual(['123', ['1', '2', '3']]);
    expect(
      deepFilter(
        [
          '123',
          ['1', '2', '3'],
          '23',
          {
            foo: '123'
          },
          {
            bar: ['1', '2', '3']
          },
          {
            deepFoo: {
              foo: '123'
            }
          }
        ],
        '1'
      )
    ).toEqual([
      '123',
      ['1', '2', '3'],
      {
        foo: '123'
      },
      {
        bar: ['1', '2', '3']
      },
      {
        deepFoo: {
          foo: '123'
        }
      }
    ]);

    expect(deepFilter(['oss-tech', 'oss', 'oss-linux'], 'oss-tech')).toEqual(['oss-tech']);
    expect(deepFilter(['oss-tech', 'oss', 'oss-linux'], 'oss, tech')).toEqual([
      'oss-tech',
      'oss',
      'oss-linux'
    ]);
  });

  it('getRoundedToNearest', () => {
    expect(getRoundedToNearest(12)).toEqual(20);
    expect(getRoundedToNearest(105)).toEqual(200);
    expect(getRoundedToNearest(105, 2)).toEqual(110);
    expect(getRoundedToNearest(105, 4)).toEqual(200);
    expect(getRoundedToNearest(105, 4, false)).toEqual(100);
    expect(getRoundedToNearest(105, null, false)).toEqual(100);
    expect(getRoundedToNearest(105)).toEqual(200);
    expect(getRoundedToNearest(-12, 2, false)).toEqual(-10);
  });

  it('getPageSizeOptions', () => {
    expect(getPageSizeOptions([1, 10, 20, 50], 11)).toEqual([1, 11]);
    expect(getPageSizeOptions([10, 20, 50], 11)).toEqual([11]);
    expect(getPageSizeOptions([1, 10, 20, 50, 100, 250], 51)).toEqual([10, 20, 51]);
    expect(getPageSizeOptions([1, 17, 20, 22, 50, 100, 250], 51)).toEqual([17, 22, 51]);
    expect(getPageSizeOptions([1, 10, 20, 50, 100, 250], 501)).toEqual([100, 250, 501]);
    expect(getPageSizeOptions([10, 20, 250], 501, 2)).toEqual([250, 501]);
    expect(getPageSizeOptions([10, 26, 27, 28, 29, 30, 31], 100)).toEqual([10, 31, 100]);
    expect(getPageSizeOptions([], 1)).toEqual([1]);
    expect(getPageSizeOptions([], 10)).toEqual([3, 5, 10]);
    expect(getPageSizeOptions([], 100)).toEqual([25, 50, 100]);
    expect(getPageSizeOptions([], 101)).toEqual([25, 50, 101]);
  });
});
