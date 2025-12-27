import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type SchemeMasterProp = {
  data: {
    material_type_id: number;
    scheme_name: string;
    scheme_type: string;
    duration: string;
    monthly_installments: number[];
    payment_frequency: string;
    min_amount: number;
    redemption: string;
    visible_to: number[];
    status: string;
    terms_and_conditions_url: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const SchemeMasterService = {
  create: async ({
    data,
    successMessage,
    failureMessage,
  }: SchemeMasterProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}`,
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

  getAll: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  replace: async (
    id: number,
    { data, successMessage, failureMessage }: SchemeMasterProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}/${id}`,
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

  delete: async (
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
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}/${id}`,
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
