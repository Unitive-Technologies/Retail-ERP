import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const DropDownServiceAll = {
  getMaterialTypes: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.MATERIAL_TYPE_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getVendors: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VENDORS_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getSubcategories: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SUBCATEGORY_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getCategories: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.CATEGORY_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getBranches: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getGrns: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.GRNS_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getSchemeType: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.SCHEME_MASTER}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getAllStates: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.STATE_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getAllCountry: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.COUNTRY_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getAllVarients: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.VARIENT_TYPES}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getDuration: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DURATION}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getPaymentFrequency: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.PAYMENT_FREQUENCY}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getRedemption: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.REDEMPTION}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getAllDistricts: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getOfferPlans: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFER_PLANS_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },
  getOfferApplicableTypes: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.OFFER_APPLICABLE_TYPES_DROPDOWN}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  getAll: async () => {
    return Promise.all([
      DropDownServiceAll.getMaterialTypes(),
      DropDownServiceAll.getVendors(),
      DropDownServiceAll.getSubcategories(),
      DropDownServiceAll.getCategories(),
      DropDownServiceAll.getBranches(),
      DropDownServiceAll.getGrns(),
      DropDownServiceAll.getSchemeType(),
      DropDownServiceAll.getAllStates(),
      DropDownServiceAll.getAllCountry(),
      DropDownServiceAll.getDuration(),
      DropDownServiceAll.getPaymentFrequency(),
      DropDownServiceAll.getRedemption(),
      DropDownServiceAll.getAllDistricts(),
    ]);
  },
};
