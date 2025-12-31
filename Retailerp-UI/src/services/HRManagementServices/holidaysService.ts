import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';
import { Dayjs } from 'dayjs';

export interface HolidaysParams {
  month?: number;
  year?: number;
}

export interface HolidayData {
  holiday_date: Dayjs  | null;
  holiday_name: string;
  description?: string;
}

export interface HolidayProp {
  data?: HolidayData;
  successMessage?: string;
  failureMessage?: string;
}

export const HolidaysService = {
  // Get holidays list
  getHolidays: async (params?: HolidaysParams) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.HOLIDAYS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  // Create holiday
  create: async ({ data, successMessage, failureMessage }: HolidayProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.HOLIDAYS}`,
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

  // Update holiday
  updateHoliday: async (id: string, data: HolidayData, successMessage?: string, failureMessage?: string) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.HOLIDAYS}/${id}`,
      method: 'put',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Holiday updated successfully',
      },
      failure: {
        message: failureMessage || 'Failed to update holiday',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

};
