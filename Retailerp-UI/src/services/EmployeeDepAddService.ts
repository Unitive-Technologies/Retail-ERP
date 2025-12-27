import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const EmployeeDepAddService = {
  create: async (payload: { department_name: string }) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DEP_ADD}`,
      method: 'post',
      data: payload,
    });

    return await apiRequest(options);
  },
};

export default EmployeeDepAddService;
