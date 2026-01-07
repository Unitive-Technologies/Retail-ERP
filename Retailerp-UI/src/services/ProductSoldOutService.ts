import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const ProductSoldOutService = {
  getAll: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_OUT_OF_STOCK}`,
      method: 'get',
      params,
    });

    return apiRequest(options);
  },
};
