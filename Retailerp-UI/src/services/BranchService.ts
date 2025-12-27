import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
// import { SERVICE_URL } from @constants;
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export type branchData = {
  branch_no: string;
  branch_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  address: string;
  state_id: number | string | null;
  district_id: number | string | null;
  pin_code: string;
  gst_no: string;
  signature_url?: string;
  status: string;
  bank_account: {
    account_holder_name: string;
    bank_name: string;
    ifsc_code: string;
    account_number: string;
    bank_branch_name: string;
  };
  kyc_documents: Array<{
    doc_type: string;
    doc_number: string;
    file_url: string;
  }>;
  login: {
    email: string;
    password_hash: string;
    role_id?: number;
  };
};

type branchProp = {
  data: branchData;
  successMessage?: string;
  failureMessage?: string;
};

export const BranchService = {
  create: async ({ data, successMessage, failureMessage }: branchProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}`,
      method: 'post',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  getAllById: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  updateBranch: async (
    id: number,
    { data, successMessage, failureMessage }: branchProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}/${id}`,
      method: 'put',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  deleteBranch: async (
    id: number,
    {
      successMessage,
      failureMessage,
    }: {
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS}/${id}`,
      method: 'delete',
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage,
      },
      failure: {
        message: failureMessage,
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  autoBranchNoGenerator: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.BRANCH_DETAILS_CODE}`,
      method: 'post',
      params: params,
    });
    return apiRequest(options);
  },
};
