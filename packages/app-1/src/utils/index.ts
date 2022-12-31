export const pascalToSeparatedWords = (str: unknown = '', sep = '-') =>
  String(str)
    .replace(' ', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .join(sep)
    .toLocaleLowerCase();

export const toCamel = (str = '') => str.replace(/[-_]([a-z])/g, (x) => x[1].toUpperCase());

export const splitAlphanumeric = (str: unknown = '') => String(str).match(/[^-_ \d]+|\d+/g);

export type StringOrAny = (string | number) | (string | number)[] | { [key: string]: StringOrAny };

export const SEARCH_KEYWORD_SEPARATORS = [',', ' '];
/**
 * Deeply filter a recursive array of arrays or objects by given keywords and
 * return the result. refer to tests for examples
 *
 * @param list Array<T> to filter by keyword(s)
 * @param str string representing 1..n keyword(s) as comma- or space-separated list. abc | ab-c | ab_c are all treated of 1 keyword. 'abc,cd' > abc | cd. 'abc cd' > abc | cd
 * @returns filtered list
 */
export const deepFilter = <T>(list: T[], str?: string) => {
  const included = (obj: StringOrAny, str1?: string): boolean => {
    if (typeof str1 !== 'string' || [undefined, null].includes(obj)) {
      return false;
    }
    if (str1 === '') {
      return true;
    }
    if (typeof obj === 'number') {
      return included(String(obj), str1);
    }
    if (Array.isArray(obj)) {
      return obj.some((x) => included(x, str1));
    }
    if (typeof obj === 'object') {
      return Object.keys(obj).some((k) => included(obj[k], str1));
    }
    if (typeof obj === 'string') {
      const splits =
        str1?.match(
          new RegExp(`[^${SEARCH_KEYWORD_SEPARATORS.join('')}[\\w\\-_\\d]]+|[\\w\\-_\\d]+`, 'ig')
        ) ?? [];
      return splits?.some((x) => obj.toLocaleLowerCase().includes(x));
    }
    return false;
  };

  return list?.filter((d) => included(d as StringOrAny, str));
};
/**
 * expect(getRoundedToNearest(12)).toEqual(20);
 * expect(getRoundedToNearest(105)).toEqual(200);
 * expect(getRoundedToNearest(105, 2)).toEqual(110);
 * expect(getRoundedToNearest(105, 4)).toEqual(200);
 * expect(getRoundedToNearest(105, 4, false)).toEqual(100);
 * expect(getRoundedToNearest(105, null, false)).toEqual(100);
 * expect(getRoundedToNearest(105)).toEqual(200);
 * expect(getRoundedToNearest(-12, 2, false)).toEqual(-10);
 *
 * @param n number to round
 * @param decimals how many digits (0 < d < digits of n excluding decimals)
 * @param isRoundedUp default to rounding up, false to round down
 * @returns rounded number
 */
export const getRoundedToNearest = (
  n: number,
  decimals: number = Number.MAX_SAFE_INTEGER,
  isRoundedUp = true
): number => {
  if (n !== ~~n) {
    // eslint-disable-next-line no-console
    console.error('getRoundedToNearest expect int for n. received', n);
    throw new TypeError('getRoundedToNearest - invalid n');
  }
  if (n === 0) {
    return 0;
  }
  const absN = Math.abs(n);
  const maxDigits = String(Math.ceil(absN)).length;
  const d = Math.min(
    maxDigits,
    decimals !== ~~decimals || decimals <= 0 ? Number.MAX_SAFE_INTEGER : decimals
  );
  const divisor = Math.pow(10, d - 1);
  return Math[isRoundedUp ? 'ceil' : 'floor'](absN / divisor) * divisor * (n / absN);
};

/**
 * clamped integer intervals between 0..n
 *
 * getIntervals([1, 10, 20, 50], 11) === [1, 11]
 * getIntervals([1, 10, 20, 50, 100, 250], 51) === [20, 51]
 * getIntervals([1, 10, 20, 50, 100, 250], 501) === [100, 250, 501]
 *
 * @param arr number[] - initial numbers. pass [] to seed automatically
 * @param maxSize number - default - 10. maximum size
 * @param n number - default - 3. how many entries inc. maximum size
 *
 * @returns number[] - range of numbers up to n
 */
export const getIntervals = (arr: number[], maxSize = 10, n = 3): number[] => {
  if (!Array.isArray(arr) || !arr.every((x) => x === ~~x)) {
    // eslint-disable-next-line no-console
    console.error('getIntervals - expect int[] for arr. received ', arr);
    throw new TypeError('getIntervals - invalid arr');
  }
  if (n < 0 || n !== ~~n) {
    // eslint-disable-next-line no-console
    console.error('getIntervals - expect int for n. received ', n);
    throw new TypeError('getIntervals - invalid n');
  }
  if (maxSize < 0 || maxSize !== ~~maxSize) {
    // eslint-disable-next-line no-console
    console.error('getIntervals - expect int for maxSize. received ', maxSize);
    throw new TypeError('getIntervals - invalid maxSize');
  }
  if (n === 1) {
    return [maxSize];
  }
  if (maxSize === 0) {
    return [];
  }
  let r;
  if (arr.length > 0) {
    const newArr = [...new Set(arr.concat(maxSize))];
    newArr.sort((a, b) => a - b);
    const currentMaxIndex = newArr.indexOf(maxSize);
    const filteredArr = newArr.filter((x, i) =>
      i <= currentMaxIndex - 1 ? x <= 0.9 * newArr[i + 1] : x <= maxSize
    );
    const index = filteredArr.indexOf(maxSize);
    r = filteredArr.slice(Math.max(0, index + 1 - n), index + 1);
    r = r.concat(filteredArr.slice(index + 1, index + 1 + n - r.length)).slice(-1 * n);
  } else {
    const niceMaxSize = getRoundedToNearest(maxSize, 0, false);
    r = getIntervals(
      Array(n - 1)
        .fill(0)
        .map((_x, i) => Math.ceil(niceMaxSize / Math.pow(2, n - 1 - i)))
        .concat(maxSize),
      maxSize,
      n
    );
  }
  return r;
};

export const addWord = (words = '', newWord = '') => {
  const splits = String(newWord)
    .split(' ')
    .filter((x) => x)
    .map((x) => x.trim());
  return [
    ...new Set(
      words
        .split(' ')
        .concat(splits)
        .map((x) => x.trim())
        .filter((x) => x)
    )
  ].join(' ');
};
export const removeWord = (words = '', wordToRemove = '') => {
  const splits = String(wordToRemove)
    .split(' ')
    .filter((x) => x)
    .map((x) => x.trim());
  const arr = [
    ...new Set(
      words
        .split(' ')
        .map((x) => x.trim())
        .filter((x) => x && splits.every((y) => x !== y))
    )
  ];
  return arr.join(' ');
};

export const isEmptyObject = (obj: Record<string, never>) =>
  typeof obj === 'object' && Object.keys(obj).every((x) => [undefined, null].includes(obj[x]));

const noOp = () => undefined;

export async function timeout(cb: () => void = noOp, ms = 1000) {
  await new Promise(() => {
    const wait = setTimeout(() => {
      cb();
      clearTimeout(wait);
    }, ms);
  });
}
