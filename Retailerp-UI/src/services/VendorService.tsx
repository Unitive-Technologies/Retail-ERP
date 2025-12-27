import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type vendorData = {
  vendor_image_url: string;
  vendor_code: any;
  vendor_name: string;
  proprietor_name: string;
  email: string;
  mobile: string;
  pan_no: string;
  gst_no: string;
  address: string;
  country?: string;
  state?: string;
  district?: string;
  country_id?: number | string;
  state_id?: number | string;
  district_id?: number | string;
  pin_code: string;
  opening_balance: number;
  opening_balance_type: string;
  payment_terms: string;
  material_type_ids: number[];
  visibilities?: number[];
  visibilities_names_detailed?: { id: number; name: string }[];
  status?: string;
};

type vendorProp = {
  data: vendorData;
  successMessage?: string;
  failureMessage?: string;
};

export const VendorService = {
  create: async ({ data, successMessage, failureMessage }: vendorProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VENDOR_DETAILS}`,
      method: 'post',
      data: data,
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
      url: `${Config.BASE_URL}${SERVICE_URL.VENDOR_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAllVendor: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VENDOR_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

    updateVendor: async (
      id: number,
      { data, successMessage, failureMessage }: vendorProp
    ) => {
      const options = await apiOptions({
        url: `${Config.BASE_URL}${SERVICE_URL.VENDOR_DETAILS}/${id}`,
        method: 'put',
        data: data,
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

    autoCodeGenerator: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VENDOR_DETAILS_CODE}`,
      method: 'post',
      params: params,
    });
    return apiRequest(options);
  },

  //   deleteBranch: async (
  //     id: number,
  //     {
  //       successMessage,
  //       failureMessage,
  //     }: {
  //       successMessage?: string;
  //       failureMessage?: string;
  //     }
  //   ) => {
  //     const options = await apiOptions({
  //       url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}/${id}`,
  //       method: 'delete',
  //     });
  //     const toastMessageConfig: any = {
  //       success: {
  //         message: successMessage,
  //       },
  //       failure: {
  //         message: failureMessage,
  //       },
  //     };
  //     return apiRequest(options, toastMessageConfig);
  //   },
};
