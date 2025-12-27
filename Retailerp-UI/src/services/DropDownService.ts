import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

//TODO USE DROP DOWN ALL SERVICE API instead this
export const DropDownService = {
  getAllMaterialType: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getMaterialTypeById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },
  getAllCategoryType: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getCategoryById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAllLedgerGrpType:async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getLedgerGrpById: async (id: number) => {
      const options = await apiOptions({
        url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}/${id}`,
        method: 'get',
      });
      return apiRequest(options);
    },
};
