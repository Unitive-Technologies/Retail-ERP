import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
// import { SERVICE_URL } from @constants;
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type bankData = {
  account_holder_name: string;
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  bank_branch_name: string;
  entity_type:string;
  entity_id: number;
};

type bankprop = {
  data: bankData;
  successMessage?: string;
  failureMessage?: string;
};

export const BankService = {
  create: async ({ data, successMessage, failureMessage }: bankprop) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BANK_DETAILS}`,
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

  getAllById: async (id: number,params?:any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BANK_DETAILS}/${id}`,
      method: 'get',
      params:params
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BANK_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

    updateBank: async (
      id: number,
      { data, successMessage, failureMessage }: bankprop
    ) => {
      const options = await apiOptions({
        url: `${Config.BASE_URL}${SERVICE_URL.BANK_DETAILS}/${id}`,
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

    deleteBank: async (
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
        url: `${Config.BASE_URL}${SERVICE_URL.BANK_DETAILS}/${id}`,
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
