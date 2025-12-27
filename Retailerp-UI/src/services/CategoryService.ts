import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type CategoryTypeProp = {
  data: {
    material_type: string;
    category_image_url: string;
    category_name: string;
    material_type_id: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const CategoryService = {
  create: async ({
    data,
    successMessage,
    failureMessage,
  }: CategoryTypeProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  replace: async (
    id: number,
    { data, successMessage, failureMessage }: CategoryTypeProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}/${id}`,
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
