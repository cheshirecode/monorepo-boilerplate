import { describe, expect, it } from 'vitest';
import { pascalToSeparatedWords, splitAlphanumeric, toCamel, deepFilter } from './util';

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
    expect(deepFilter([{ os: 'nt', disttype: 'sw', distGroups: ['secserv'] }], 'nt,sw')).toEqual([
      { os: 'nt', disttype: 'sw', distGroups: ['secserv'] }
    ]);
  });
});
