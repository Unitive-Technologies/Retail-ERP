import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type GrnItem = {
  ref_no: string;
  material_type_id: number;
  purity: string; // ENUM("92.5", "99.9", "91.75", "100")
  material_price_per_g: number;
  category_id: number;
  subcategory_id: number;
  type: string; // "Piece" | "Weight"
  quantity: number;
  gross_wt_in_g: number;
  stone_wt_in_g: number;
  others: string;
  others_wt_in_g: number;
  others_value: number;
  net_wt_in_g: number;
  rate_per_g: number;
  total_amount: number;
  purchase_rate: number;
  stone_rate: number;
  making_charge: number;
  comments?: string;
};

export type GrnData = {
  grn_no: string;
  grn_date: string;
  po_id: number;
  vendor_id: number;
  order_by_user_id: number;
  reference_id: string;
  gst_no: string;
  billing_address: string;
  shipping_address: string;
  subtotal_amount: number;
  sgst_percent: number;
  cgst_percent: number;
  discount_percent: number;
  total_amount: number;
  remarks: string;
  status_id: number;
  grn_info_ids?: number[];
  items: GrnItem[];
};

type GrnProps = {
  data: GrnData;
  successMessage?: string;
  failureMessage?: string;
};

export const GrnService = {
  create: async ({ data, successMessage, failureMessage }: GrnProps) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}`,
      method: 'post',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  update: async (
    id: number | string,
    { data, successMessage, failureMessage }: GrnProps
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}/${id}`,
      method: 'put',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getById: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}/${id}`,
      method: 'get',
    });

    return apiRequest(options);
  },

  getAll: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}`,
      method: 'get',
      params,
    });

    return apiRequest(options);
  },

  delete: async (
    id: number | string,
    messages?: { successMessage?: string; failureMessage?: string }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: messages?.successMessage },
      failure: { message: messages?.failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getCode: async (prefix: string = 'GRN') => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN_CODE}`,
      method: 'post',
      params: { prefix },
    });

    return apiRequest(options);
  },

  view: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRN}/${id}/view`,
      method: 'get',
    });

    return apiRequest(options);
  },
};

