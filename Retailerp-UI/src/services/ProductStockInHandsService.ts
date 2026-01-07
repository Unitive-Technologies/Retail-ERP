import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const ProductStockInHandsService = {
  getAll: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PRODUCT_STOCK_IN_HANDS}`,
      method: 'get',
      params,
    });

    return apiRequest(options);
  },
};
