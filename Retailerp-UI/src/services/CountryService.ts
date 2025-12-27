import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type countryData = {
  country_name: string;
  short_name: string;
  currency_symbol: string;
  country_code: string;
  country_image_url: string;
};

type countryProp = {
  data: countryData;
  successMessage?: string;
  failureMessage?: string;
};

export const CountryService = {
  create: async ({ data, successMessage, failureMessage }: countryProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getDropdown: async () => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}/dropdown`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  update: async (
    id: number,
    { data, successMessage, failureMessage }: countryProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY}/${id}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: { message: successMessage },
      failure: { message: failureMessage },
    };

    return apiRequest(options, toastMessageConfig);
  },
};
