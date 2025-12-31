const SERVICE_URL = {
  BRANCH_DETAILS: 'api/v1/branch',
  BRANCH_DETAILS_CODE: 'api/v1/branch/code',
  INVOICE_DETAILS: 'api/v1/invoice-settings',
  BANK_DETAILS: 'api/v1/bank-account',
  KYC_DETAILS: 'api/v1/kyc-document',
  IMAGE_UPLOAD: 'api/v1/upload',
  MATERIAL_TYPE: 'api/v1/material-type',
  LOGIN_DETAILS: 'api/v1/user',
  CATEGORY: 'api/v1/category',
  SUBCATEGORY: 'api/v1/subcategory',
  VARIANT: 'api/v1/variant',
  LIST_VARIANTS: 'api/v1/variants',
  USER_ITEMS: 'api/v1/user-items',
  CUSTOMER_ADDRESS: 'api/v1/customer-addresses',
ORDER: 'api/v1/orders',

  VENDOR_DETAILS: 'api/v1/vendors',
  VENDOR_DETAILS_CODE: 'api/v1/vendors/code',
  SPOC_DETAILS: 'api/v1/vendor-SpocDetails',

  // Product
  PRODUCT: 'api/v1/products',
  PRODUCT_LIST: 'api/v1/products/list-details',
  PRODUCT_SKU_ID: 'api/v1/products/generateSku',
  PRODUCT_SEARCH: 'api/v1/products/addon-list',
  PRODUCT_ADDON: 'api/v1/product-addons',
  PRODUCT_VARIANT_BULK: 'api/v1/product-variants/bulk',
  PRODUCT_GRN_INFOS: 'api/v1/product-grn-infos',

  //Scheme Master
  SCHEME_MASTER: 'api/v1/schemes',
  // Scheme Master DropDown
  SCHEME_TYPE: 'api/v1/dropdown/scheme-types',
  DURATION: 'api/v1/dropdown/scheme-durations',
  PAYMENT_FREQUENCY: 'api/v1/dropdown/payment-frequencies',
  REDEMPTION: 'api/v1/dropdown/redemption-types',
  //Drop down
  MATERIAL_TYPE_DROPDOWN: 'api/v1/material-type/dropdown',
  VENDORS_DROPDOWN: 'api/v1/vendors/dropdown',
  SUBCATEGORY_DROPDOWN: 'api/v1/subcategory/dropdown',
  CATEGORY_DROPDOWN: 'api/v1/category/dropdown',
  BRANCH_DROPDOWN: 'api/v1/branch/dropdown',
  GRNS_DROPDOWN: 'api/v1/grns/dropdown',
  GRN: 'api/v1/grns',
  GRN_CODE: 'api/v1/grns/code',
  UOM: 'api/v1/uoms',
  LEDGER_GROUP: 'api/v1/ledger-groups',
  LEDGER: 'api/v1/ledgers',
  VARIENT_TYPES: 'api/v1/variants/detailed',

  // Employee
  EMPLOYEE_DETAILS: 'api/v1/employees',
  EMP_DESIGNATION: 'api/v1/employees/designations/dropdown',
  EMP_CODE_AUTO_GENERATE: 'api/v1/employees/code',
  EMP_DEPARTMENT_DROPDOWN: 'api/v1/employees/departments/dropdown',
  EMPLOYEE_INCENTIVES: 'api/v1/employee-incentives',
  EMPLOYEE_ROLE: 'api/v1/role-permissions/list-details',
  EMPLOYEE_ROLE_SELECT: 'api/v1/modules',
  EMPLOYEE_ROLE_ADD: 'api/v1/roles',
  EMPLOYEE_DEP_ADD: 'api/v1/employee-departments',
  ROLE_CREATE: 'api/v1/role-permissions',
  EMPLOYEE_PERMISSIONS: 'api/v1/employee-permissions',
  EMPLOYEE_ROLE_DROPDOWN: 'api/v1/roles/dropdown',
  //State
  STATE_DROPDOWN: 'api/v1/state/dropdown',
  // Country
  COUNTRY_DROPDOWN: 'api/v1/country/dropdown',
  // District
  DISTRICT_DROPDOWN: 'api/v1/district/dropdown',
  //Super Admin Profile
  SUPER_ADMIN_PROFILE: 'api/v1/superadmin-profiles',

  COUNTRY: 'api/v1/country',
  DISTRICT: 'api/v1/district',
  STATE: 'api/v1/state',

  // Customer
  CUSTOMER_DETAILS: 'api/v1/customers',
  CUSTOMER_DETAILS_CODE: 'api/v1/customers/code',

  // Orders
  ORDERS: 'api/v1/orders',

  // Holidays
  HOLIDAYS: 'api/v1/holidays',

  // Purchase Orders
  PURCHASE_ORDERS: 'api/v1/purchase-orders',
};

export { SERVICE_URL };
