/**
 * Determines the display mode of the given control or form.
 */
export enum ControlMode {
  Display = 1,
  Edit = 2,
  New = 3,
}

/**
 * Determines the display mode of the given control or form.
 */
export enum ScreenType {
  Display = 1,
  Edit = 2,
  New = 3,
  List = 4,
  Page = 5, //html
  Text = 6,
  Web = 7, //url
  Input = 8,
  Dynamic = 9,
  Component = 10,
  Link = 11, // open link
  Screen = 12,
  Click = 13,
}

/**
 * Determines the display type of the given control.
 */
export enum DisplayType {
  Requared = 1,
  Hidden = 2,
  Optional = 3,
  Disabled = 4,
}

/**
 * Query type.
 */
export enum QueryType {
  Add = 1,
  Edit = 2,
  Remove = 3,
  byId = 4,
  List = 5,
  View = 6,
  Many = 7,
}

/**
 * Market type.
 */
export enum MarketType {
  Mart = 'Mart',
  Ebay = 'Ebay',
  Amazon = 'Amazon',
  Apple = 'Apple',
  //Taobao = 'Taobao',
  //Tmall = 'Tmall',
  //Coupang = 'Coupang',
  //Gmarket = 'Gmarket',
  //Auction = 'Auction',
}

export enum UserRole {
  Admin = 'Admin',
  User = 'User', // харилцагч
  Manager = 'Manager', // нярав
  Viewer = 'Viewer', // жолооч
  Seller = 'Seller',
  Partner = 'Partner',
  Guest = 'Guest',
}

/**
 * Permission.
 */
export enum Permission {
  Read = 1,
  Add = 2,
  Edit = 3,
  Remove = 4,
}

/**
 * Language.
 */
export enum Language {
  English = 'en-US',
  Mongolian = 'mn-MN',
}

/**
 * Currency.
 */
export enum Currency {
  MNT = 'MNT',
  USD = 'USD',
}

/**
 * Theme.
 */
export type Theme = 'light' | 'dark';

export enum IDeliveryType {
  Delivery = 'Delivery',
  Pickup = 'Pickup',
}

/**
 * Determines the display mode of view on flatlist.
 */
export enum ViewMode {
  List = 1,
  Card = 2,
  CardList = 3,
  Calendar = 4,
}

/**
 * Order type.
 */
export enum OrderType {
  Current = 'Current',
  Complete = 'Complete',
  Waiting = 'Waiting',
}

export type ILookupItem = {
  _id: string;
  name?: string;
};
