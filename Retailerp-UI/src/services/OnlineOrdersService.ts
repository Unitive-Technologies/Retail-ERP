import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';
import { CreateWishlistItemRequest } from 'response';

export const OnlineOrdersService = {
  getWishlistOrCart: async (
    params?: Record<string, unknown>,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.USER_ITEMS}`,
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

  createWishlistOrAddCart: async (request: CreateWishlistItemRequest) => {
    const { successMessage, failureMessage, ...data } = request;
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.USER_ITEMS}`,
      method: 'post',
      data,
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

  updateWishlistItem: async (
    product_id: number,
    user_id: number,
    is_wishlisted: boolean,
    product_item_id?: number,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.USER_ITEMS}/wish-list/${product_id}`,
      method: 'put',
      data: {
        user_id,
        product_id,
        product_item_id,
        is_wishlisted,
      },
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

  updateAddToCart: async (
    product_id: number,
    user_id: number,
    is_in_cart: boolean,
    product_item_id?: number,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.USER_ITEMS}/add-to-cart/${product_id}`,
      method: 'put',
      data: {
        user_id,
        product_id,
        product_item_id,
        is_in_cart,
      },
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
