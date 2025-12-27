import {
  MaterialIcon,
  SafetyIcon,
  ShippingIcon,
  StampadIcon,
} from '@assets/Images';

const CONFIRM_MODAL = {
  delete: 'delete',
  cancel: 'cancel',
  create: 'create',
  edit: 'edit',
  logout: 'logout',
  done: 'done',
  reject: 'reject',
  view: 'view',
  warning: 'warning',
  downloadReplace: 'downloadReplace',
  compare: 'compare',
};

const types = {
  [CONFIRM_MODAL.create]: {
    handleType: 1,
  },
  [CONFIRM_MODAL.edit]: {
    handleType: 2,
  },
};

const HTTP_STATUSES = {
  OK: 200,
  SUCCESS: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
};

const AND_SEPARATOR = ';';
const OR_SEPARATOR = ',';
const ASSIGNMENT_SEPARATOR = '=';
const TOAST_DURATION = 2000;

const STATUS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

export {
  CONFIRM_MODAL,
  types,
  HTTP_STATUSES,
  AND_SEPARATOR,
  OR_SEPARATOR,
  ASSIGNMENT_SEPARATOR,
  TOAST_DURATION,
  STATUS,
};

export const NAVIGATION_MENU = {
  ALL_JEWELLERY: 'All Jewellery',
  GOLD: 'Gold',
  SILVER: 'Silver',
  PENDANTS: 'Pendants',
  EARRINGS: 'Earrings',
  NECKLACE: 'Necklace',
  BANGLES: 'Bangles',
  RINGS: 'Rings',
  MANGALSUTRA: 'Mangalsutra',
};

export const JEWELLERY_CATEGORIES = {
  // ALL_JEWELLERY: {
  //   title: 'All Jewellery',
  //   path: '/home/all',
  //   options: ['Gold', 'Silver', 'Pendants', 'Earrings', 'Necklace', 'Bangles', 'Rings', 'Mangalsutra'],
  // },
  EARRINGS: {
    title: 'Earrings',
    path: '/home/earrings',
    options: ['Drops & Danglers', 'Studs', 'Jhumkas', 'Hoops'],
  },
  NECKLACE: {
    title: 'Necklace',
    path: '/home/necklace',
    options: ['Pendant', 'Choker', 'Long Necklace', 'Short Necklace'],
  },
  BANGLES: {
    title: 'Bangles',
    path: '/home/bangles',
    options: ['Chain Bangle', 'Cuff Bangle', 'Star Bangles'],
  },
  RINGS: {
    title: 'Rings',
    path: '/home/rings',
    options: ['Plain Rings', 'Engagement Ring', 'Casual Ring'],
  },
  MANGALSUTRA: {
    title: 'Mangalsutra',
    path: '/home/mangalsutra',
    options: ['Traditional', 'Modern', 'Designer'],
  },
  GOLD: {
    title: 'Gold',
    path: '/home/gold',
    options: ['Chains', 'Coins', 'Bars'],
  },
  SILVER: {
    title: 'Silver',
    path: '/home/silver',
    options: ['Coins', 'Anklets', 'Bracelets'],
  },
  PENDANTS: {
    title: 'Pendants',
    path: '/home/pendants',
    options: ['Heart Pendants', 'Lockets', 'Alphabet Pendants'],
  },
};

export const featureList = [
  {
    icon: StampadIcon,
    title: '92.5',
    subtitle: 'Stamped',
  },
  {
    icon: MaterialIcon,
    title: '1000+',
    subtitle: 'Designs',
  },
  {
    icon: ShippingIcon,
    title: 'Shipping',
    subtitle: 'Globally',
  },
  {
    icon: SafetyIcon,
    title: 'Safety',
    subtitle: '& Secure',
  },
];
export const FILTER_OPTIONS = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
];
export const sortByOptions = [
  { value: 'Best Seller', label: 'Best Seller' },
  { value: 'Price Low to High', label: 'Price Low to High' },
  { value: 'Price High to Low', label: 'Price High to Low' },
  { value: 'Newest First', label: 'Newest First' },
];

export const BranchType = [
  {
    value: 1,
    label: 'Prefix',
  },
  {
    value: 2,
    label: 'Suffix',
  },
];

export const docNames = [
  { label: 'PAN Card', value: 1 },
  { label: 'GST', value: 2 },
  { label: 'MSME', value: 3 },
  { label: 'Aadhar Card', value: 4 },
];

export const MakingChageType = [
  {
    value: 'Percentage',
    label: 'Percentage',
  },
  {
    value: 'Amount',
    label: 'Amount',
  },
  {
    value: 'Per Gram',
    label: 'Per Gram',
  },

];

export const MeasurementType = [
  {
    value: 'Inches',
    label: 'Inches',
  },
  {
    value: 'mm',
    label: 'mm',
  },
  {
    value: 'cm',
    label: 'cm',
  },
];

export const PRODUCT_TYPE = {
  WEIGHT: 'Weight Based',
  PIECE: 'Piece Rate',
};

export const VARIATION_TYPE = {
  WITHOUT: 'Without Variations',
  WITH: 'With Variations',
};

// Define accepted MIME types for image uploads
export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];
