import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type UomProp = {
  data: {
    uom_code: string;
    uom_name: string;
    short_code: string;
    status: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

type UpdateUomProp = {
  id: number;
  data: {
    uom_code?: string;
    uom_name?: string;
    short_code?: string;
    status: string;
  };
  successMessage?: string;
  failureMessage?: string;
};


export const UomService = {
  create: async ({ data, successMessage, failureMessage }: UomProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}`,
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
  }: UpdateUomProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}/${id}`,
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


   updateStatus: async ({
    id,
    data,
    successMessage,
    failureMessage,
  }: UpdateUomProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}/${id}/status`,
      method: 'patch',
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
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.UOM}/${id}`,
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
