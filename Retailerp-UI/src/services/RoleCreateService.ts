import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type CreateRolePayload = {
  role_name: string;
  department_id: number;
  permissions: {
    module_id: number;
    access_level_id: number;
  }[];
};

export const RoleCreateService = {
  // CREATE ROLE WITH PERMISSIONS
  create: async (payload: CreateRolePayload) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}`,
      method: 'post',
      data: payload,
    });
    return apiRequest(options);
  },

  // UPDATE ROLE
  update: async (id: number, payload: Partial<CreateRolePayload>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}/${id}`,
      method: 'put',
      data: payload,
    });
    return apiRequest(options);
  },

  // GET ALL ROLES
  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}`,
      method: 'get',
      params: { _ts: Date.now(), ...params },
    });
    return apiRequest(options);
  },

  // GET ROLE BY ID
  getById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}/${id}`,
      method: 'get',
      params: { _ts: Date.now() },
    });
    return apiRequest(options);
  },

  // DELETE ROLE
  delete: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.ROLE_CREATE}/${id}`,
      method: 'delete',
    });
    return apiRequest(options);
  },
};

export default RoleCreateService;
