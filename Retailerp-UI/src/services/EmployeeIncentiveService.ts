import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type IncentiveData = {
  role_id: number;
  department_id: number;
  sales_target: number[];
  incentive_type: string;
  incentive_value: number ;
};

type IncentiveProp = {
  data: IncentiveData;
  successMessage?: string;
  failureMessage?: string;
};

export const EmployeeIncentiveService = {
  create: async ({ data, successMessage, failureMessage }: IncentiveProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_INCENTIVES}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_INCENTIVES}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_INCENTIVES}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  update: async (
    id: number,
    { data, successMessage, failureMessage }: IncentiveProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_INCENTIVES}/${id}`,
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
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_INCENTIVES}/${id}`,
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
