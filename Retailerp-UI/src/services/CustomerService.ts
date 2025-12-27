import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type CustomerData = {
  customer_code: string;
  customer_name: string;
  mobile_number: string;
  address: string;
  country_id: number;
  state_id: number;
  district_id: number;
  pin_code: string;
};

type CustomerProp = {
  data: CustomerData;
  successMessage?: string;
  failureMessage?: string;
};

type CustomerCodeParams = {
  prefix: string;
//   fy: string;
};

export const CustomerService = {
  // Create customer
  create: async ({ data, successMessage, failureMessage }: CustomerProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS}`,
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

  // Generate customer code
  generateCustomerCode: async (params: CustomerCodeParams) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS_CODE}`,
      method: 'post',
      params: params,
    });
    return apiRequest(options);
  },

  // Get customer by ID
  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Get all customers
  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  // Update customer
  update: async (
    id: number,
    { data, successMessage, failureMessage }: CustomerProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS}/${id}`,
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

  // Delete customer
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
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_DETAILS}/${id}`,
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