import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type Role = {
  id: number;
  name: string;
};

export type EmployeeRoleDropdownResponse = {
  statusCode: number;
  message: string;
  data: {
    roles: Role[];
  };
};

type EmployeeRoleDropdownParams = {
  department_id: number;
};

export const EmployeeRoleDropdownService = {
  getDropdown: async (params: EmployeeRoleDropdownParams) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_ROLE_DROPDOWN}`,
      method: 'get',
      params: {
        department_id: params.department_id,
      },
    });

    return apiRequest(options);
  },
};

