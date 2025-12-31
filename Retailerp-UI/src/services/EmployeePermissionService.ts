import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type ModulePermission = {
  id: number;
  module_id: number;
  module_name: string;
  module_group_id: number;
  module_group_name: string;
  access_level_id: number;
};

export type UpdateEmployeePermissionPayload = {
  department_id: number;
  role_name: string;
  permissions: Array<{
    module_id: number;
    access_level_id: number;
  }>;
};

export const EmployeePermissionService = {
  // UPDATE EMPLOYEE PERMISSIONS
  update: async (
    employeeId: string | number,
    payload: UpdateEmployeePermissionPayload
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_PERMISSIONS}/${employeeId}`,
      method: 'put',
      data: payload,
    });
    return apiRequest(options);
  },

  // GET EMPLOYEE PERMISSIONS
  get: async (employeeId: string | number): Promise<ModulePermission[]> => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_PERMISSIONS}`,
      method: 'get',
      params: {
        employee_id: employeeId,
        _ts: Date.now(),
      },
    });

    const response: any = await apiRequest(options);

    const modules: ModulePermission[] =
      response?.data?.data?.data?.modules ??
      response?.data?.data?.modules ??
      response?.data?.modules ??
      [];

    return modules;
  },
};

export default EmployeePermissionService;
