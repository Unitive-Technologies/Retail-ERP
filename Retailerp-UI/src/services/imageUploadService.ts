import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

export const ImageUploadService = {
  uploadImage: async (
    data: FormData,
    successMessage?: any,
    failureMessage?: any
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.IMAGE_UPLOAD}`,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
  delete: async (fileName: string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.IMAGE_UPLOAD}/${fileName}`,
      method: 'delete',
    });
    return apiRequest(options);
  },
};
