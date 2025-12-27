import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type RoleListParams = {
  department_id?: number | string;
  search?: string;
  role?: string;
};

export const RoleService = {
  getListDetails: async (params?: RoleListParams) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_ROLE}`,
      method: 'get',
      params,
    });
    return apiRequest(options);
  },
};