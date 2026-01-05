import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type inVoiceData = {
  branch_id: number;
  sequence_name: string;
  invoice_prefix: string;
  invoice_suffix: string;
  invoice_start_no?: number;
  status_id?: number;
};

type loginProp = {
  data: any;
  successMessage?: string;
  failureMessage?: string;
};

export const InvoiceService = {
  updateBulk: async ({ data, successMessage, failureMessage }: loginProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.INVOICE_DETAILS}/bulk`,
      method: 'put',
      data,
    });
    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };
    return apiRequest(options, toastMessageConfig);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.INVOICE_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getSalesInvoiceBills: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SALES_INVOICE_BILLS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getSalesInvoiceBillById: async (id: number | string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SALES_INVOICE_BILLS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },
};
