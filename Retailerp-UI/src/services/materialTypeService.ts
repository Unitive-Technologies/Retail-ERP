import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type MaterialTypeProp = {
  data: {
    material_type: string;
    material_image_url: string;
    material_price: number;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const MaterialTypeService = {
  create: async ({
    data,
    successMessage,
    failureMessage,
  }: MaterialTypeProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  replace: async (
    id: number,
    { data, successMessage, failureMessage }: MaterialTypeProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}/${id}`,
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
