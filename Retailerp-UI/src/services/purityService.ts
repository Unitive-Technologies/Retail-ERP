import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const PurityService = {
  getAll: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}api/v1/purities`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
};
