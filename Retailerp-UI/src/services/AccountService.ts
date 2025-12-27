import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type LedgerGrpProp = {
  data: {
    ledger_group_id: string;
    ledger_group_name: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

type UpdateLedgerGrpProp = {
  id: number;
  data: {
    ledger_group_id: string;
    ledger_group_name: string;
  };
  successMessage?: string;
  failureMessage?: string;
};


type LedgerProp = {
  data: {
    ledger_group_id: string;
    ledger_name: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

type UpdateLedgerProp = {
  id: number;
  data: {
    ledger_group_id: string;
    ledger_name: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const AccountService = {
  createLedgerGrp: async ({
    data,
    successMessage,
    failureMessage,
  }: LedgerGrpProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}`,
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

  updateLedgerGrp: async ({
    id,
    data,
    successMessage,
    failureMessage,
  }: UpdateLedgerGrpProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}/${id}`,
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

  getByIdLedgerGrp: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAllLedgerGrp: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  deleteLedgerGrp: async (
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
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER_GROUP}/${id}`,
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

   createLedger: async ({
    data,
    successMessage,
    failureMessage,
  }: LedgerProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER}`,
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

  updateLedger: async ({
    id,
    data,
    successMessage,
    failureMessage,
  }: UpdateLedgerProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER}/${id}`,
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

  getByIdLedger: async (id: number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAllLedger: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  deleteLedger: async (
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
      url: `${Config.BASE_URL}${SERVICE_URL.LEDGER}/${id}`,
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
};
