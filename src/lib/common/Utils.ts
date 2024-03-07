import moment from 'moment';
import { MarketType, Permission, ILookupItem } from '../common/ControlMode';
import { RATES, CONF, ICONF } from '../config';
import * as crypto from 'crypto-js';

export class Utils {
  /**
   * Returns formated date string
   */
  public GetFormatedDate(dateValue: any, length: number = 16): string {
    let date: string = '';
    if (typeof dateValue === 'string') {
      let convertedDate: Date = new Date(dateValue);
      date = convertedDate.toLocaleString().substring(0, length);
    } else if (dateValue instanceof Date) {
      date = dateValue.toLocaleString().substring(0, length);
    }
    return date || dateValue;
  }

  /**
   * Returns formated date string
   */
  public GetDateOnly(dateString: string): string {
    let shortDate = '';
    if (dateString) {
      let dateItems = dateString.split(' ');
      if (dateItems.length > 1) {
        shortDate = dateItems[0];
      }
    }
    let convertedDate: Date = new Date(dateString);
    return shortDate;
  }
  /**
   * Returns the file name by spliting the file url
   */
  public GetFileName(fileAbsoluteUrl: string): string {
    if (fileAbsoluteUrl) {
      let items = fileAbsoluteUrl.split('/');
      return items[items.length - 1];
    }
    return '';
  }
}

export const titleShorter = (title: string = '', length = 30): string => {
  if (!title) {
    return '';
  }
  if (title.length > length) {
    title = title.substring(0, length) + '...';
  }
  return title;
};

export const formatPrice = (value: any, fixed: number = 0) => {
  if (!isNaN(value)) {
    value = typeof value !== 'number' ? Number(value) : value;
    const multi: number = fixed < 0 ? 1 : Math.pow(10, fixed);
    value = fixed > 1 ? value.toFixed(fixed) : Math.ceil(value * multi) / multi;
    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return value;
};

export const currency_symbol: object = {
  MNT: { pre: '', post: '₮' },
  TRY: { pre: '', post: '₺' },
  INR: { pre: '', post: '₹' },
  USD: { pre: '$', post: '' },
  EUR: { pre: '€', post: '' },
  CNY: { pre: '', post: '¥' },
  RUB: { pre: '', post: '₽' },
  JPY: { pre: '', post: '¥' },
  GBP: { pre: '£', post: '' },
  CHF: { pre: '', post: 'CHF' },
  KRW: { pre: '', post: '₩' },
  HKD: { pre: '', post: '$' },
  AUD: { pre: '$', post: '' },
  CAD: { pre: '$', post: '' },
  SGD: { pre: '', post: '$' },
  SEK: { pre: '', post: 'kr' },
};

export const getCurrency = (): any => {
  //const { user } = store.getState();
  return 'MNT'; // user.currency ||
};

export const getCurrencySymbol = (currency: string = getCurrency()): any => {
  return Object.keys(currency_symbol).indexOf(currency) >= 0
    ? { currency, ...currency_symbol[currency] }
    : { currency, pre: '', post: '' };
};

export const withSymbol = (
  value: any,
  currency: string = getCurrency(),
  fixed: number = 0
): string => {
  const symbol = getCurrencySymbol(currency);
  return symbol.pre + formatPrice(value, fixed) + symbol.post;
};

export const getSymbol = (currency?: string): string => {
  const symbol = getCurrencySymbol(currency);
  return !symbol.pre ? symbol.post : symbol.pre;
};

export const convertCurrency = (
  price: number,
  currency: string,
  showzero: boolean = false
): string => {
  let rate: number = getRate(currency);
  const converted_currency = rate === 1 ? currency : getCurrency();
  const symbol =
    Object.keys(currency_symbol).indexOf(converted_currency) >= 0
      ? currency_symbol[converted_currency]
      : { pre: '', post: '' };
  const value = formatPrice(price * rate);
  return value === '0' && !showzero ? '' : symbol.pre + value + symbol.post;
};

export const getRate = (currency: string = getCurrency()): number => {
  //const { user } = store.getState();
  let rate: number = 1;
  let rt: any[] = [];

  if (currency === 'MNT') {
    return rate;
  }

  //if (user.rates.length > 0) {
  //  rt = user.rates.filter((item) => item.currency === currency);
  //} else {
  rt = RATES;
  //}

  if (rt && rt.length > 0) {
    rate = rt[0].rate;
  }
  return rate;
};

export const convertValue = (price: number, currency: string): number => {
  return price * getRate(currency);
};

export const exchangeValue = (price: number, currency: string): number => {
  return price / getRate(currency);
};

export const getMinLeft = (expired: any) => {
  let min: number = 0;
  if (!(expired && moment(expired).isValid())) {
    return min;
  }
  let deadline = moment(expired);
  let now = moment();

  if (!now.isAfter(deadline)) {
    min = deadline.diff(now, 'minutes');
  }
  return min;
};

export const estimateDay = (
  created: any,
  minDays: number = 1,
  maxDays: number = 7
) => {
  if (!(created && moment(created).isValid())) {
    return created;
  }
  const estimate_start = moment(moment(created).add(minDays, 'd')).format(
    'YYYY/MM/DD'
  );
  const estimate_end = moment(
    moment(created).add(minDays + maxDays, 'd')
  ).format('MM/DD');
  return estimate_start + ' ~ ' + estimate_end;
};

export const estimate = (start: any, end: any, hasTime: boolean = false) => {
  const estimate_start = dateToString(start, 'YY/MM/DD');
  const estimate_end = dateToString(end, 'YY/MM/DD');

  if (estimate_start === estimate_end) {
    if (hasTime)
      return (
        dateToString(start, 'YY/MM/DD HH:mm') +
        ' ~ ' +
        dateToString(end, 'HH:mm')
      );
    else return dateToString(start, 'YY/MM/DD');
  }
  return (
    dateToString(start, hasTime ? 'YY/MM/DD HH:mm' : 'YY/MM/DD') +
    ' ~ ' +
    dateToString(end, hasTime ? 'MM/DD HH:mm' : 'MM/DD')
  );
};

export const traverse = (data: any, parent: string = ''): any => {
  let nodes = {};
  for (let [key, value] of Object.entries(data)) {
    let internalName = !!parent ? parent + '.' + key : key;
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Array) &&
      Object.keys(value as object).indexOf('uri') < 0
    )
      nodes = { ...nodes, ...traverse(value, internalName) };
    else nodes[internalName] = value;
  }
  return nodes;
};

export const zeroPad = (value: number | string, size: number): string => {
  let s: string = value.toString();
  //while (s.length < (size || 2)) { s = '0' + s; }
  s = s.padStart(size, '0');
  return s;
};

export const getGqlString = (doc: any) => {
  return doc.loc && doc.loc.source.body;
};

// remove duplicate elements from an array [duplicate]
export const getUnique = (arr, comp): any[] => {
  let unique = arr
    .map((e) => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
};

export const getAddress = (
  address: any,
  withPhone = true,
  withCountry = false,
  withCode = false,
  isReserse = false
) => {
  let location: string[] = [];
  if (!address) {
    return location;
  }

  if (withPhone && (address.phone || address.mobile)) {
    location.push(
      ...(!isReserse
        ? [address.phone, address.mobile]
        : [address.mobile, address.phone]
      ).filter(Boolean)
    );
  }

  if (!!address.other && withCode) location.push(address.other);

  if (!!address.address) location.push(address.address);
  else if (!!address.address1) {
    location.push(address.address1);
    if (!!address.address2 && withCode) location.push(address.address2);
  }
  if (!!address.street) location.push(address.street);
  if (!!address.district) location.push(address.district);
  else if (!!address.disrict) location.push(address.disrict);
  if (!!address.city && withCountry)
    location.push(
      address.city + (!address.zipcode ? '' : ' ' + address.zipcode)
    );
  if (!!address.country && withCountry) location.push(address.country);

  location = location.filter(Boolean);

  return !isReserse ? location : location.reverse();
};

/**
 * @deprecated The method should not be used
 */
export const getAdress = getAddress;

export const isHTML = RegExp.prototype.test.bind(
  /(<\/[^>]*?>)|(<[^>]*?\/>)/m // <(\S*?)[^>]*>(.|\n)*?<\/\1>
);

export const getTax = (
  market: MarketType,
  config: any | ICONF = CONF
): number => {
  let tax: number = 0;
  switch (market) {
    case MarketType.Mart:
      tax = config.tax.MN;
      break;
    default:
      tax = config.tax.US;
      break;
  }
  return tax;
};

export const shipping = (product: any): number => {
  return (
    (product.shipping?.value || 0) *
    product.qty *
    product.rate *
    (product.taxincluded && product.shippingtaxed === false
      ? (100 + product.tax) / 100
      : 1)
  );
};

export const tax = (product: any): number => {
  return (
    ((product.cost.value +
      (product.shippingtaxed === false ? product.shipping.value : 0)) *
      product.qty *
      product.rate *
      (product.taxincluded ? 0 : product.tax)) /
    100
  );
};

export const subtotal = (product: any): number => {
  return (
    product.cost.value * product.qty * product.rate +
    tax(product) +
    product.fee * fee(product)
  );
};

export const fee = (
  product: any,
  limit: number = CONF?._limit || 0
): number => {
  return product.cost?.value * product.rate < limit ? 1 : product.qty;
};

export const uuid = (): string => {
  let uid = crypto.lib.WordArray.random(32 / 2).toString();
  uid =
    uid.substring(0, 8) +
    '-' +
    uid.substring(8, 12) +
    '-' +
    uid.substring(12, 16) +
    '-' +
    uid.substring(16, 20) +
    '-' +
    uid.substring(20);
  return uid;
};

export const base64enc = (data: string, encoding: string = 'Utf8'): string => {
  if (!data) {
    return '';
  }
  return crypto.enc.Base64.stringify(crypto.enc[encoding].parse(data));
};

export const base64dec = (data: string, encoding: string = 'Utf8'): string => {
  if (!data) {
    return '';
  }
  return crypto.enc.Base64.parse(data).toString(crypto.enc[encoding]);
};

export const isServer: boolean = typeof window === 'undefined';

export const formatDate = (isoDateString: string): string => {
  const date = moment(isoDateString);
  const currentDate = moment();
  const daysAgo = date.diff(currentDate, 'days');
  const hoursAgo = date.diff(currentDate, 'hours');
  const minutesAgo = date.diff(currentDate, 'minutes');
  const secondsAgo = date.diff(currentDate, 'seconds');

  if (secondsAgo <= 2) {
    return `just now`;
  }
  if (minutesAgo < 1) {
    return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
  }
  if (hoursAgo < 1) {
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  }
  if (daysAgo < 1) {
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  }
  if (daysAgo <= 30) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  }
  return date.format('MMM do, yyyy');
};

export const formateDateForInput = (
  isoDateString: string,
  format: string = 'yyyy-MM-dd'
): string => {
  if (isoDateString && moment(isoDateString).isValid()) {
    return moment(isoDateString).format(format);
  }
  return isoDateString;
};

export const capitalizeFirstLetter = (word: string) => {
  if (!word) {
    return '';
  }
  word = word.toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getPermission = (
  listname: string,
  user: any,
  permission: Permission = Permission.Read,
  data?: any
): Permission => {
  if (!user) {
    return Permission.Read;
  }

  if (user.type === 'Admin' || (!!data?._userId && data._userId === user._id)) {
    return Permission.Remove;
  }

  let _permissions: any[] = user.permission || [];
  let defaultIndex: number = _permissions.findIndex(
      (p) => p.listname === 'Default'
    ),
    index: number = _permissions.findIndex((p) => p.listname === listname);
  if (index < 0) {
    index = defaultIndex;
  }

  if (index >= 0) {
    if (_permissions[index]?.permission) {
      return _permissions[index].permission;
    } else if (
      index !== defaultIndex &&
      _permissions[defaultIndex]?.permission
    ) {
      return _permissions[defaultIndex].permission;
    }
  }
  return permission;
};

export const getPlural = (listname: string, post = 's') => {
  if (post !== 's') {
    return listname;
  }
  return `${
    listname.endsWith('s') ||
    listname.endsWith('sh') ||
    listname.endsWith('ch') ||
    listname.endsWith('x') ||
    listname.endsWith('z')
      ? listname + 'e'
      : listname.endsWith('y')
      ? listname.substring(0, listname.length - 1) + 'ie'
      : listname.endsWith('f') || listname.endsWith('fe')
      ? listname.substring(
          0,
          listname.length - (listname.endsWith('fe') ? 2 : 1)
        ) + 've'
      : listname
  }`;
};

export const dateToISOString = (date: any, length = 24, defaultValue = '') => {
  if (!moment(date).isValid()) {
    return defaultValue;
  }
  return moment(date).toISOString().substring(0, length);
};

export const dateToString = (
  date: any = new Date(),
  format = 'YYYY-MM-DDTHH:mm',
  defaultValue = ''
) => {
  if (!date || !moment(date).isValid()) {
    return defaultValue;
  }
  return moment(date).format(format);
};

export const toDate = (
  date: any, //string | undefined | null | Date | number
  defaultValue = ''
): Date => {
  if (date instanceof Date) {
    return date;
  }
  if (!date || !moment(date).isValid()) {
    return !defaultValue ? new Date() : new Date(defaultValue);
  }
  return moment(date).toDate();
};

export const decodeHTML = (str: string) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str?.replace(/&#([0-9]{1,3});/gi, (match, num) => {
    return String.fromCharCode(parseInt(num));
  });
};

export const convertHtmlToPlain = (html: string): string => {
  return html?.replace(/<[^>]+>/g, '') || '';
};

export const getPath = (
  listname: string,
  customLists: string[] = [
    'Address',
    'Category',
    'Delivery',
    'Merchant',
    'Product',
    'Stock',
    'User',
    'Post',
    'Page',
  ]
) => {
  if (customLists.findIndex((l) => l === listname) >= 0) {
    return 'User' === listname
      ? '/admin/signup'
      : '/admin/' + listname.toLowerCase();
  }
  return '/forms/' + listname.toLowerCase();
};

export const closeDialog = (refresh: boolean = false): void => {
  try {
    window.frameElement['cancelPopUp'](refresh);
  } catch {
    window.parent.document.getElementById('closealldialogordrawer')?.click();
  }
};

export const clearText = (
  value: string | null,
  lowercase: boolean = false
): string => {
  value = !value ? '' : value.replace(/\s+/g, '');
  return lowercase ? value.toLowerCase() : value;
};

export const lookupFormater = (data: any[], name: string) => {
  let list: ILookupItem[] = [];
  if (data) {
    list = data.map((item) => ({
      _id: item._id,
      name: item[name],
    }));
  }
  return list;
};

export const query_string = (query: string = ''): object => {
  let query_string: object = {};
  if (!query) return query_string;
  let vars: string[] = decodeURIComponent(query)
    .replace(/^\?|^\%3(F|f)/, '')
    .split('&');

  for (let i: number = 0; i < vars.length; i++) {
    let pair = vars[i].split('=', 2);
    let key: string = decodeURIComponent(pair[0] || '');
    if (!key) {
      continue;
    }
    let value: string = decodeURIComponent(pair[1] || '');
    // If first entry with this name
    if (typeof query_string[key] === 'undefined') {
      query_string[key] = value;
      // If second entry with this name
    } else if (typeof query_string[key] === 'string') {
      let arr = [query_string[key], value];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(value);
    }
  }
  return query_string;
};

export const parse_params = (path: string) => {
  let params: object = {};
  try {
    let url: string = path.match(
      /^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*))?$/
    )
      ? new URL(path).search
      : path;
    let params = new URLSearchParams(url);
    params.forEach((key, value) => {
      params[key] = value;
    });
  } catch {
    params = {};
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      match: RegExpExecArray;
    while ((match = regex.exec(path))) {
      params[match[1]] = match[2] || '';
    }
  }
  return params;
};

export const stringify_params = (obj: any, prefix: string = ''): string => {
  let URIComponent = !obj
    ? ''
    : Object.entries<string>(obj)
        .map(
          ([key, val]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(val || '')}`
        )
        .join('&');

  return (!URIComponent ? '' : prefix) + URIComponent;
};

export const MathCeil = (
  value: number | string = 0,
  fractionDigits: number = 2
): number => {
  if (null === value) {
    return 0;
  } else if (typeof value === 'string') {
    value = parseFloat(value);
  }
  fractionDigits = Math.abs(
    typeof fractionDigits === 'number' ? fractionDigits : 2
  );
  let pow: number = Math.pow(10, fractionDigits);
  return Math.ceil(parseFloat((value * pow).toFixed(fractionDigits))) / pow;
};

export const getHash = (
  divider: number = 100000,
  length: number = 0
): string => {
  let now: number = Date.now();
  let qid: number = Math.ceil(now / divider);
  let after = Math.ceil((now + 30000) / divider); // add 30 sec
  if (qid !== after) {
    qid = after;
  }
  const hash: string = crypto.SHA256(qid.toString()).toString();
  return length > 0 ? hash.substring(0, length) : hash;
};

/**
 * Takes an object and converts it to an array of its own properties.
 */
export function objectToArray<Key extends string, PropType>(
  importObject: Record<Key, PropType>
): PropType[] {
  const keys = Object.getOwnPropertyNames(importObject);

  // ES6 / TypeScript exports contain a __esModule property. Don't include that.
  return keys
    .filter((key) => key.indexOf('__') !== 0)
    .map((key) => importObject[key]);
}

// bearer token extract open data
export function tokenObj(token: string) {
  let obj: any = null;
  if (token?.includes('.')) {
    let arr: string[] = token.split('.', 3);
    try {
      obj = JSON.parse(base64dec(arr[1]));
    } catch {}
  }
  return obj;
}

export function sanitize_slug(slug: string) {
  slug = (slug || '').trim().toLowerCase();
  slug = slug
    .replace(/\%/g, '')
    //.replace(/%c2%a0|%e2%80%93|%e2%80%94/g, '-')
    .replace(/&nbsp;|&#160;|&ndash;|&#8211;|&mdash;|&#8212;/g, '-')
    .replace(/\//g, '-')
    .replace(/&.+?;/g, '')
    .replace(/\./g, '-')
    .replace(/[^%a-z0-9 _-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\-+/g, '-');
  return slug;
}
