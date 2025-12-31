// PDF Title Constants
export const PDF_TITLE = {
  branchList: 'Branch List',
  expenseList: 'Expense List',
  vendorList: 'Vendor List',
  categoryList: 'Category List',
  subCategoryList: 'Sub Category List',
  variantList: 'Variant List',
  materialTypeList: 'Material Type List',
  productList: 'Product List',
};

export const BRANCH_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'Branch No': 'branch_no',
  'Branch Name': 'branch_name',
  Location: 'location',
  'Contact Person': 'contact_person',
  'Contact Number': 'mobile',
  Status: 'status',
};

export const BRANCH_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Branch No', key: 'branch_no' },
  { header: 'Branch Name', key: 'branch_name' },
  { header: 'Location', key: 'location' },
  { header: 'Contact Person', key: 'contact_person' },
  { header: 'Contact Number', key: 'mobile' },
  { header: 'Status', key: 'status' },
];

export const VENDOR_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  Vendor: 'vendor_name',
  'Vendor Code': 'vendor_code',
  'Material Type': 'material_type',
  'Contact Person': 'contact_person',
  'Contact Number': 'contact_number',
  'Created By': 'created_by',
};

export const VENDOR_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Vendor', key: 'vendor_name' },
  { header: 'Vendor Code', key: 'vendor_code' },
  { header: 'Material Type', key: 'material_type' },
  { header: 'Contact Person', key: 'contact_person' },
  { header: 'Contact Number', key: 'contact_number' },
  { header: 'Created By', key: 'created_by' },
];

// Category List PDF Constants
export const CATEGORY_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'Material Type': 'material_type',
  'Category Name': 'category_name',
};

export const CATEGORY_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Material Type', key: 'material_type' },
  { header: 'Category Name', key: 'category_name' },
];

// Sub Category List PDF Constants
export const SUB_CATEGORY_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'Material Type': 'material_type',
  Category: 'category_name',
  'Sub Category': 'sub_category_name',
  'Reorder Level': 'reorder_level',
};

export const SUB_CATEGORY_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Material Type', key: 'material_type' },
  { header: 'Category', key: 'category_name' },
  { header: 'Sub Category', key: 'sub_category_name' },
  { header: 'Reorder Level', key: 'reorder_level' },
];

// Variant List PDF Constants
export const VARIANT_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'Variant Type': 'variant_type',
  Values: 'values',
};

export const VARIANT_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Variant Type', key: 'variant_type' },
  { header: 'Values', key: 'values' },
];

// Material Type List PDF Constants
export const MATERIAL_TYPE_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'Material Type': 'material_type',
  'Material Price /g': 'material_price',
};

export const MATERIAL_TYPE_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'Material Type', key: 'material_type' },
  { header: 'Material Price /g', key: 'material_price' },
];

// Product List PDF Constants
export const PRODUCT_LIST_COLUMN_MAPPING: { [key: string]: string } = {
  'S.No': 's_no',
  'SKU ID': 'sku_id',
  'HSN Code': 'hsn_code',
  'Product Name': 'product_name',
  Purity: 'purity',
  Variation: 'variation',
  Quantity: 'total_quantity',
  Weight: 'total_weight',
};

export const PRODUCT_LIST_PDF_HEADERS = [
  { header: 'S.No', key: 's_no' },
  { header: 'SKU ID', key: 'sku_id' },
  { header: 'HSN Code', key: 'hsn_code' },
  { header: 'Product Name', key: 'product_name' },
  { header: 'Purity', key: 'purity' },
  { header: 'Variation', key: 'variation' },
  { header: 'Quantity', key: 'total_quantity' },
  { header: 'Weight', key: 'total_weight' },
];
