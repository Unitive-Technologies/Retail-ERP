import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const OrderService = {
  getOrder: async (
    params?: Record<string, unknown>,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ORDERS}`,
      method: 'get',
      params: params,
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

  getCustomerAddress: async (
    params?: Record<string, unknown>,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_ADDRESS}`,
      method: 'get',
      params: params,
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

  createCustomerAddress: async (
    request: any, // Now expects { addresses: [...] }
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_ADDRESS}`,
      method: 'post',
      data: request,
    });

    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Address created successfully',
      },
      failure: {
        message: failureMessage || 'Failed to create address',
      },
    };

    return apiRequest(options, toastMessageConfig);
  },

  updateCustomerAddress: async (
    request: any, 
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_ADDRESS}/bulk`,
      method: 'put',
      data: request,
    });

    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Address updated successfully',
      },
      failure: {
        message: failureMessage || 'Failed to update address',
      },
    };

    return apiRequest(options, toastMessageConfig);
  },

  deleteCustomerAddress: async (
    addressId: number,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CUSTOMER_ADDRESS}/${addressId}`,
      method: 'delete',
    });

    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Address deleted successfully',
      },
      failure: {
        message: failureMessage || 'Failed to delete address',
      },
    };

    return apiRequest(options, toastMessageConfig);
  },

  createOrder: async (
    request: any,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ORDER}`,
      method: 'post',
      data: request,
    });

    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Order created successfully',
      },
      failure: {
        message: failureMessage || 'Failed to create order',
      },
    };

    return apiRequest(options, toastMessageConfig);
  },
};
