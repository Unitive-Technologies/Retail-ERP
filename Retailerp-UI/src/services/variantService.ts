import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type VariantProp = {
  data: {
    variant_type: string;
    values: string[];
  };
  successMessage?: string;
  failureMessage?: string;
};

type UpdateVariantProp = {
  id: number;
  data: {
    variant_type: string;
    values: string[];
  };
  successMessage?: string;
  failureMessage?: string;
};

export const VariantService = {
  create: async ({ data, successMessage, failureMessage }: VariantProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VARIANT}`,
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
  update: async ({
    id,
    data,
    successMessage,
    failureMessage,
  }: UpdateVariantProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VARIANT}/${id}`,
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
  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VARIANT}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },
  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LIST_VARIANTS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
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
      url: `${Config.BASE_URL}${SERVICE_URL.VARIANT}/${id}`,
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
