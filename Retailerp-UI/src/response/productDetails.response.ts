export interface ProductDetails {
  product: ProductList;
  item_details: ProductItemDetails[];
  addon_products: [];
  variant_details: VariantDetails[];
}

export interface ProductList {
  id: number;
  product_code?: number;
  ref_no_id: number;
  product_name: string;
  description: string;
  is_published: boolean;
  image_urls: string[];
  qr_image_url: number;
  vendor_id: number;
  material_type_id: number;
  category_id: number;
  subcategory_id: number;
  grn_id: number;
  branch_id: number;
  sku_id: string;
  hsn_code: string;
  purity: string;
  product_type: string;
  variation_type: string;
  product_variations: ProductVariation[];
  is_addOn: boolean;
  total_grn_value: string;
  total_products: number;
  remaining_weight: string;
  status: string;
  material_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  material_type_name: string;
}

export interface ProductVariation {
  variation: string;
  valueInput: string;
  values: string[];
  editingValue: number | null;
}

export interface ProductItemDetails {
  id: number;
  product_id: number;
  sku_id: string;
  variation: string;
  gross_weight: string;
  net_weight: string;
  actual_stone_weight: string;
  stone_weight: string;
  stone_value: string;
  is_visible: boolean;
  quantity: number;
  making_charge_type: string;
  making_charge: string;
  wastage_type: string;
  wastage: string;
  website_price_type: number;
  website_price: number;
  rate_per_gram: string;
  base_price: string;
  measurement_details: number;
  tag_url: string;
  item_price: number;
  is_wishlisted?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: number;
  additional_details: [];
  price_details: {
    material_rate_per_gram: number;
    material_contribution: number;
    making_charge: number;
    wastage: number;
    stone_value: number;
    additional_details_value: number;
    selling_price: number;
  };
}

export interface VariantDetails {
  variant_id: number;
  variant_type: string;
  values: [
    {
      id: number;
      value: string;
    },
  ];
}
