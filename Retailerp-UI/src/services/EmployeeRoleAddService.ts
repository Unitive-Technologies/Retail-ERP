import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const EmployeeRoleAddService = {
  create: async (payload: Record<string, any>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_ROLE_ADD}`,
      method: 'post',
      data: payload,
    });

    return apiRequest(options);
  },
};

export default EmployeeRoleAddService;
