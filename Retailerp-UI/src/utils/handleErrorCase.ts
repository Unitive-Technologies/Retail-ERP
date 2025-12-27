import toast from 'react-hot-toast';

const reportIssue = (
  error: { response: { data: { message: any }; status: any }; code: any },
  url: any,
  toastMessage: { message: any } | null
) => {
  const errorObj = {
    message: error?.response?.data?.message,
    endpoint: url,
    error: true,
    code: error?.code,
    status: error?.response?.status,
    statusCode: error?.response?.status,
    errorBody:
      error?.response?.data?.message ||
      'An error occurred while updating or retrieving data',
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Network Error: ', errorObj);
  }
  const failureMessage = toastMessage?.message ?? errorObj.errorBody;
  if (failureMessage) {
    toast.error(failureMessage);
  }
  return errorObj;
};

export const handleErrorCase = ({
  error,
  request,
  toastMessage = null,
}: {
  error: any;
  request: any;
  toastMessage: any;
}) => {
  if (error?.response) {
    const { status } = error.response;

    if (status === 401) {
      console.log('------status----401-------');
      localStorage.clear();
      window.location.href = '/';
    }
  } else if (error?.request) {
    console.log(error.request, '-----error.request------');
  }

  return reportIssue(error, request.url, toastMessage);
};
