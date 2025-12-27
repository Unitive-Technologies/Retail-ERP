import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type spocData = {
  id?: number | string;
  vendor_id?: number | string;
  contact_name: string;
  designation: string;
  mobile: string;
};

type spocProp = {
  data: spocData[];
  successMessage?: string;
  failureMessage?: string;
};

export const SPOCService = {
  create: async ({ data, successMessage, failureMessage }: spocProp) => {
    const list = Array.isArray(data) ? data : [data];
    const payload = {
       vendor_id: list[0].vendor_id,
      contacts: list.map((d: any) => ({
        // id intentionally omitted for new contacts
        contact_name: d.contact_name,
        designation: d.designation,
        mobile: d.mobile,
      })),
    };
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SPOC_DETAILS}`,
      method: 'post',
      data: payload,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  getAllById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SPOC_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SPOC_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  updateSpoc: async ({ data, successMessage, failureMessage }: spocProp) => {
    const list = Array.isArray(data) ? data : [data];
    const payload = {
      vendor_id: list[0].vendor_id,
      contacts: list.map((d: any) => ({
        id: d.id,
        contact_name: d.contact_name,
        designation: d.designation,
        mobile: d.mobile,
      })),
    };

    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SPOC_DETAILS}`,
      method: 'put',
      data: payload,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  deleteSpoc: async (
    id: number,
    {
      successMessage,
      failureMessage,
    }: {
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SPOC_DETAILS}/${id}`,
      method: 'delete',
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },
};
