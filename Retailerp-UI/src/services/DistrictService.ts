import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type districtData = {
  district_name: string;
  state_id: number;
};

type districtProp = {
  data: districtData;
  successMessage?: string;
  failureMessage?: string;
};

export const DistrictService = {
  create: async ({ data, successMessage, failureMessage }: districtProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}`,
      method: 'post',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getDropdown: async () => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}/dropdown`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  update: async (
    id: number,
    { data, successMessage, failureMessage }: districtProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}/${id}`,
      method: 'put',
      data: data,
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },

  delete: async (
    id: number,
    {
      successMessage,
      failureMessage,
    }: { successMessage?: string; failureMessage?: string }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },
};
