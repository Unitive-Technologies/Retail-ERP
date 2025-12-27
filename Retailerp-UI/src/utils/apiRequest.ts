import axios, { AxiosRequestConfig, AxiosResponse, Cancel } from "axios";
import toast from "react-hot-toast";
import { handleErrorCase } from "./handleErrorCase";
import { HTTP_STATUSES } from "@constants/Constance";

const axiosInstance = axios.create({
  timeout: 30000,
});

const reportSuccess = (
  result: AxiosResponse<any, any>,
  url: any,
  toastMessage: { message: any }
) => {
  const obj = {
    endpoint: url,
    message: "Success",
    error: false,
    data: result?.data,
    statusCode: result?.status,
    response: result,
  };
  const successMessage = toastMessage?.message;

  if (successMessage) {
    toast.success(successMessage);
  }
  if (process.env.NODE_ENV !== "production") {
    console.log("Network Response: ", obj);
  }
};

const reportCancel = (error: Cancel, url: any) => {
  const obj = {
    endpoint: url,
    message: "Cancelled",
    error: false,
    data: null,
    statusCode: null,
    response: error,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("Request Canceled: ", obj);
  }
};

type ToastMessageConfig = {
  failure?: { message: string }; // Make this optional if it might not always exist
  success?: { message: string };
};

export const apiRequest = async (
  request: AxiosRequestConfig<any>,
  toastMessageConfig: ToastMessageConfig | null = null
) => {
  try {
    const result = await axiosInstance(request);

    if (result?.status < HTTP_STATUSES.BAD_REQUEST) {
      if (typeof toastMessageConfig === "string") {
        toastMessageConfig = {
          success: {
            message: toastMessageConfig,
          },
        };
      }
      const successMessage = toastMessageConfig?.success?.message;
      reportSuccess(result, request.url, { message: successMessage });
      return result;
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      reportCancel(error, request.url);
      return {
        canceled: true,
        request,
        message: "This request was cancelled",
      };
    }

    return handleErrorCase({
      error,
      request,
      toastMessage: toastMessageConfig?.failure,
    });
  }
};

export const isValidResponse = (response: any, status: number): response is AxiosResponse => {
  return response && typeof response.status === 'number' && response.status === status && response.data;
};