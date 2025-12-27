import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const EmpDesignationDropdownService = {
  getDesignations: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMP_DESIGNATION}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
};
