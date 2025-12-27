import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

// Flexible KYC payload typing
export type KycEntityType = 'branch' | 'vendor' | string;

export type KycDocumentCreate = {
  doc_type: string;
  doc_number: string;
  file_url?: string;
  entity_type?: KycEntityType;
  entity_id?: number;
};

export type KycCreatePayload = {
  documents: KycDocumentCreate[];
};

export type KycDocumentUpdate = {
  id: number;
  doc_type: string;
  doc_number: string;
  file_url?: string;
};

export type KycUpdatePayload = {
  entity_type: KycEntityType;
  entity_id: number;
  documents: KycDocumentUpdate[];
};

type kycCreateProp = {
  data: KycCreatePayload | KycDocumentCreate[];
  successMessage?: string;
  failureMessage?: string;
};

type kycUpdateProp = {
  data: KycUpdatePayload | KycDocumentCreate[];
  successMessage?: string;
  failureMessage?: string;
};

export const KycService = {
  create: async ({ data, successMessage, failureMessage }: kycCreateProp) => {
    const base: KycCreatePayload = Array.isArray(data)
      ? { documents: data }
      : data;
    const payload: KycCreatePayload = {
      documents: (base.documents || []).map((d: any) => ({
        doc_type: d.doc_type,
        doc_number: d.doc_number,
        file_url: d.document_url ?? d.file_url,
        entity_type: d.entity_type,
        entity_id: d.entity_id,
      })),
    };
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.KYC_DETAILS}`,
      method: 'post',
      data: payload,
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
      url: `${Config.BASE_URL}${SERVICE_URL.KYC_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  getAll: async (params?: any) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.KYC_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  updateKyc: async (
    { data, successMessage, failureMessage }: kycUpdateProp
  ) => {
    const payload: KycUpdatePayload = Array.isArray(data)
      ? {
          entity_type: (data[0] as any)?.entity_type,
          entity_id: (data[0] as any)?.entity_id,
          documents: data.map((d: any) => ({
            id: d.id,
            doc_type: d.doc_type,
            doc_number: d.doc_number,
            file_url: d.file_url,
          })),
        }
      : (data as KycUpdatePayload);

    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.KYC_DETAILS}/by-entity`,
      method: 'put',
      data: payload,
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

  deleteKyc: async (
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
      url: `${Config.BASE_URL}${SERVICE_URL.KYC_DETAILS}/${id}`,
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
