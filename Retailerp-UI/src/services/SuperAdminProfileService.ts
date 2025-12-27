import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const SuperAdminProfileService = {
  getProfileById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUPER_ADMIN_PROFILE}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  createProfile: async (data: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUPER_ADMIN_PROFILE}`,
      method: 'post',
      data: data,
    });
    return apiRequest(options);
  },

  updateProfile: async (id: number, data: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUPER_ADMIN_PROFILE}/${id}`,
      method: 'put',
      data: data,
    });
    return apiRequest(options);
  },

  deleteProfile: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUPER_ADMIN_PROFILE}/${id}`,
      method: 'delete',
    });
    return apiRequest(options);
  },
};
