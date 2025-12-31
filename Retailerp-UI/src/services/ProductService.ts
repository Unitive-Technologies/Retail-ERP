import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type ProductItemDetail = {
  valueType?: string;
  sku_id: string;
  gross_weight: string | number;
  net_weight: string | number;
  stone_weight: string | number;
  quantity: string | number;
  measurement_type: string;
  width: string | number;
  length: string | number;
  height: string | number;
  stone_value: string | number;
  making_charge_type: number;
  making_charge: string | number;
  wastage_type: number;
  wastage: string | number;
  rate_per_gram: string | number;
  base_price: string | number;
  tag_url: string;
  additional_details: any[];
  variation?: string;
};

export type ProductVariation = {
  variation: string;
  valueInput: string;
  values: string[];
  editingValue: string | null;
};

export type ProductData = {
  vendor_id: string | number;
  grn_id: string | number;
  material_type_id: string | number;
  category_id: string | number;
  subcategory_id: string | number;
  branch_id: string | number;
  ref_prod_code: string;
  product_name: string;
  description: string;
  is_published: boolean;
  image_urls: { url: string; file?: File; id?: string }[];
  sku_id: string;
  purity: string;
  hsn_code: string;
  product_type: string; // PRODUCT_TYPE.WEIGHT | PRODUCT_TYPE.PIECE
  variation_type: string; // VARIATION_TYPE.WITHOUT | VARIATION_TYPE.WITH
  item_details: ProductItemDetail[];
  product_variations?: ProductVariation[];
  varient_details?: any[];
};

type ProductProps = {
  data: ProductData;
  successMessage?: string;
  failureMessage?: string;
};

type UpdateProductProps = {
  id: number;
  data: ProductData;
  successMessage?: string;
  failureMessage?: string;
};

export const ProductService = {
  create: async ({ data, successMessage, failureMessage }: ProductProps) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}`,
      method: 'post',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  UpdateProduct: async ({
    id,
    data,
    successMessage,
    failureMessage,
  }: UpdateProductProps) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}/${id}`,
      method: 'put',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getAll: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_LIST}`,
      method: 'get',
      params, // optional filters like pagination or search
    });

    return apiRequest(options);
  },

  getById: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}/${id}`,
      method: 'get',
    });

    return apiRequest(options);
  },

  delete: async (
    id: number | string,
    messages?: { successMessage?: string; failureMessage?: string }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: messages?.successMessage },
      failure: { message: messages?.failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getProductById: async (id: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}/${id}`,
      method: 'get',
    });

    return apiRequest(options);
  },

  generateSku: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_SKU_ID}`,
      method: 'post',
      params: params,
    });

    return apiRequest(options);
  },

  searchAddons: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_SEARCH}`,
      method: 'get',
      params: params,
    });

    return apiRequest(options);
  },

  getProductGrnInfos: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_GRN_INFOS}`,
      method: 'get',
      params: params,
    });

    return apiRequest(options);
  },

  createAddons: async (data: {
    product_id: number;
    addon_product_ids: number[];
  }) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_ADDON}`,
      method: 'post',
      data: data,
    });

    const toastMessageConfig: any = {
      failure: { message: 'Failed to link add-ons' },
    };

    return apiRequest(options, toastMessageConfig);
  },

  createProductVariants: async (data: {
    items: {
      product_id: number;
      variant_id: number;
      variant_type_ids: number[];
    }[];
  }) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_VARIANT_BULK}`,
      method: 'post',
      data,
    });

    const toastMessageConfig: any = {
      failure: { message: 'Failed to create product variants' },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getWebsiteDetails: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT}/list-website-details`,
      method: 'get',
      params,
    });

    return apiRequest(options);
  },
};
