import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type SubCategoryProp = {
  data: {
    materialType_id: string;
    category_id: string;
    subcategory_image_url: string;
    subcategory_name: string;
    reorder_level: number;
    // making_charges: number;
    // margin: number;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const SubCategoryService = {
  create: async ({ data, successMessage, failureMessage }: SubCategoryProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  replace: async (
    id: number,
    { data, successMessage, failureMessage }: SubCategoryProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY}/${id}`,
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
