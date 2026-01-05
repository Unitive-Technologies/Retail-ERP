import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type offerProp = {
  data: any;
  successMessage?: string;
  failureMessage?: string;
};

export const OfferService = {
  getOfferCode: async (params?: { prefix?: string }) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFERS_CODE}`,
      method: 'post',
      params: params,
    });
    return apiRequest(options);
  },
  create: async ({ data, successMessage, failureMessage }: offerProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFERS}`,
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
  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFERS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFERS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },
  update: async (
    id: number,
    { data, successMessage, failureMessage }: offerProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFERS}/${id}`,
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
};

