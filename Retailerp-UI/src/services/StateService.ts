import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type StateData = {
  state_name: string;
  state_code: string;
  country_short_name?: string;
  country_name?: string;
  country_id?: number;
};

type stateProp = {
  data: StateData;
  successMessage?: string;
  failureMessage?: string;
};

export const StateService = {
  create: async ({ data, successMessage, failureMessage }: stateProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getDropdown: async () => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}/dropdown`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  update: async (
    id: number,
    { data, successMessage, failureMessage }: stateProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.STATE}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },
};
