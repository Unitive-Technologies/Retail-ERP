import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';
export type ModuleGroupResponse = {
  statusCode: number;
  message: string;
  data: {
    module_group: { id: number; module_group_name: string };
    modules: { id: number; module_group_id: number; module_name: string }[];
  };
};

export const RolePermissionService = {
  getModules: async (
    params?: Record<string, any> & { groupId?: number | string }
  ) => {
    const groupPath = params?.groupId ? `/${params.groupId}` : '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { groupId, ...restParams } = params || {};
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_ROLE_SELECT}${groupPath}`,
      method: 'get',
      params: { _ts: Date.now(), ...restParams },
    });
    return apiRequest(options);
  },

  getRolePermissions: async (params?: {
    department_id?: number | string;
    role_name?: string;
  }) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}`,
      method: 'get',
      params,
    });
    return apiRequest(options);
  },
};

export default RolePermissionService;
