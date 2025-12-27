import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type loginData = {
  email: string,
  password_hash: string,
  entity_type: string,
  entity_id: number,
  role_id?: number
};

type loginProp = {
  data: loginData;
  successMessage?: string;
  failureMessage?: string;
};

export const LoginService = {
  create: async ({ data, successMessage, failureMessage }: loginProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LOGIN_DETAILS}`,
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

  getAllById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LOGIN_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LOGIN_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  updateLoginDetails: async (
    id: number,
    { data, successMessage, failureMessage }: loginProp
  ) => {
    
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LOGIN_DETAILS}/${id}`,
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
