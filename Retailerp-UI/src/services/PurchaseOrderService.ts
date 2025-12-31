import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type PurchaseOrderItem = {
  id: number;
  po_no: string;
  date: string;
  status_id: number;
  vendor_id: number;
  vendor_name: string;
  vendor_image_url?: string;
  created_by: number;
};

export const PurchaseOrderService = {
  getAll: async (params?: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}`,
      method: 'get',
      params,
    });

    return apiRequest(options);
  },

  getById: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}/${id}`,
      method: 'get',
    });

    return apiRequest(options);
  },

  getByView: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}/${id}/view`,
      method: 'get',
    });

    return apiRequest(options);
  },

  create: async (
    data: any,
    successMessage?: string,
    failureMessage?: string
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}`,
      method: 'post',
      data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage || 'Purchase order created successfully' },
      failure: { message: failureMessage || 'Failed to create purchase order' },
    };

    return apiRequest(options, toastMessageConfig);
  },

  update: async (
    id: number | string,
    data: any,
    successMessage?: string,
    failureMessage?: string
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}/${id}`,
      method: 'put',
      data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage || 'Purchase order updated successfully' },
      failure: { message: failureMessage || 'Failed to update purchase order' },
    };

    return apiRequest(options, toastMessageConfig);
  },

  delete: async (
    id: number | string,
    successMessage?: string,
    failureMessage?: string
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PURCHASE_ORDERS}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: successMessage || 'Purchase order deleted successfully' },
      failure: { message: failureMessage || 'Failed to delete purchase order' },
    };

    return apiRequest(options, toastMessageConfig);
  },
};
