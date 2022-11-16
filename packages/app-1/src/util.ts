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

type StringOrAny = string | string[] | { [key: string]: StringOrAny };
interface NestedObject extends String {
  [key: string]: StringOrAny;
}
type Valueof<T> = T[keyof T];

export const SEARCH_KEYWORD_SEPARATORS = [',', ' '];

export const deepFilter = (list: Array<NestedObject>, str: string) => {
  const included = (obj: Valueof<NestedObject>, str: Valueof<typeof o>) => {
    if (typeof str !== 'string') {
      return false;
    }
    if (str === '') {
      return true;
    }
    if (typeof obj === 'string') {
      const splits =
        str?.match(
          new RegExp(`[^${SEARCH_KEYWORD_SEPARATORS.join('')}[\\w\\d]]+|[\\w\\d]+`, 'ig')
        ) ?? [];
      return splits?.some((x) => obj.toLocaleLowerCase().includes(x));
    }
    if (typeof obj === 'number') {
      return included(obj, str);
    }
    if (Array.isArray(obj)) {
      return obj.some((x) => included(x, str));
    }
    if (typeof obj === 'object') {
      return Object.keys(obj).some((k: keyof typeof obj) => included(obj[k], str));
    }
    return false;
  };
  return list?.filter((d) => included(d, str)) as T as const;
};
