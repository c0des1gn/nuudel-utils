export const USER_KEY = 'USER_KEY';
export const USER_ID = 'USER_ID';
export const USER_TOKEN = 'USER_TOKEN';
export const USER_LANG = 'USER_LANG';
export const NOTI_TOKEN = 'NOTI_TOKEN';
export const CURRENT_INVOICE = 'CURRENT_INVOICE';
export const INIT_DATE = 'INIT_DATE';
export const INIT_DATA = 'INIT_DATA';
export const STOCK_TYPE = 'STOCK_TYPE';
export const GUEST_USER_ID = '1234567890abcd0987654321';
//export const IS_MULTI_TENANT = false;

export interface ICONF {
  minVersion: string;
  site_title?: string;
  site_description?: string;
  posts_per_page: number;
  active?: boolean;
  site_keywords?: string[];
  logo?: any;
  phone: string;
  location?: string;
  web?: string;
  base_url: string;
  account?: any;
  _fee: number;
  _limit: number;
  shipping?: any;
  tax?: any;
  cookie?: any;
  store?: string[];
}

export var CONF: ICONF = {
  minVersion: '1.0.0',
  site_title: '',
  site_description: '',
  posts_per_page: 10,
  base_url: '',
  active: false,
  site_keywords: [],
  logo: {
    uri: '',
    width: 100,
    height: 100,
  },
  phone: '',
  location: '',
  web: 'www.codesign.mn',
  account: {
    account: '5070442134',
    bank: 'Khanbank',
    recipient: 'Mart',
    currency: 'MNT',
  },
  _fee: 0,
  _limit: 0,
  shipping: { USD: 14, EUR: 10 },
  tax: { US: 9.5, MN: 10 },
  cookie: {
    token: '',
    expired: '1970-01-01 12:00:00',
    sessionId: '',
    sessionIdTime: '',
    ubidMain: '',
    sessionToken: '',
  },
  store: ['Ebay', 'Amazon'],
};

export const setConf = (Conf: any) => {
  CONF = Conf;
};

export const AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36';

export const domainFixer = (
  domain: string = '',
  allowed_domains: string[] = ['allmart.mn', 'dino.mn']
) => {
  domain = domain.toLowerCase();
  if (allowed_domains.includes(domain)) {
    domain = 'app.' + domain;
  }
  return domain;
};

export const pathname: string = 'api/graphql';

let hostname: string = 'localhost';
let protocol: string = 'http';
let port: string = ':8080';

export const setOrigin = (
  _hostname: string,
  _protocol: string = 'https',
  _port: string = '',
  DEV: boolean = false
) => {
  hostname = _hostname;
  protocol = _protocol;
  port = _port;
};

export var HOST: string = CONF.base_url || `${protocol}://${hostname}${port}`;
export var URL: string = `${HOST}/${pathname}`; // grapql API url

export const setHost = (
  host: string = CONF?.base_url || `${protocol}://${hostname}${port}`
) => {
  HOST = host;
  URL = `${HOST}/${pathname}`;
  return host;
};

export var RATES: any[] = [];
export const setRates = (rates: any[]) => {
  RATES = rates;
};
