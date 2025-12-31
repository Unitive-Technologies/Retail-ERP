import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';

type EmployeeProp = {
  data: {
    profile_image_url?: string;
    employee_no: string;
    employee_name: string;
    department_id: number;
    role_id: number;
    joining_date: string;
    employment_type: string;
    gender: string;
    date_of_birth: string;
    branch_id: number;
    status: string;
    contact: {
      mobile_number: string;
      email_id: string;
      address: string;
      country_id: string;
      state_id: string;
      district_id: string;
      pin_code: string;
      emergency_contact_person: string;
      relationship: 'Father' | 'Mother' | 'Guardian';
      emergency_contact_number: string;
    };
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
    experiences: Array<{
      organization_name: string;
      role: string;
      duration_from: string;
      duration_to: string;
      location: string;
    }>;
    login: {
      email: string;
      password_hash: string;
      role_id: number;
    };
  };
  successMessage?: string;
  failureMessage?: string;
};

type EmployeeMessageProp = {
  successMessage?: string;
  failureMessage?: string;
};

export const EmployeeService = {
  // Create a new employee
  create: async ({ data, successMessage, failureMessage }: EmployeeProp) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}`,
      method: 'post',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee created successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to create employee',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Get all employees
  getAll: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  // Get employee by ID
  getById: async (id: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Update employee
  replace: async (
    id: string | number,
    { data, successMessage, failureMessage }: EmployeeProp
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'put',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee updated successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to update employee',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Delete employee
  delete: async (
    id: string | number,
    { successMessage, failureMessage }: EmployeeMessageProp = {}
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'delete',
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee deleted successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to delete employee',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Get employee dropdown
  getDropdown: async (params?: Record<string, unknown>) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}`,
      method: 'get',
      params: params,
    });
    return apiRequest(options);
  },

  // Employee Contact Details
  getContactDetails: async (employeeId: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${employeeId}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Employee Experience Details
  getExperienceDetails: async (employeeId: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${employeeId}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Bulk update employee experience
  bulkUpdateExperience: async (
    employeeId: string | number,
    {
      data,
      successMessage,
      failureMessage,
    }: {
      data: Array<{
        organization_name: string;
        role: string;
        duration_from: string;
        duration_to: string;
        location: string;
      }>;
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${employeeId}`,
      method: 'post',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee experience updated successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to update employee experience',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Employee Bank Details
  getBankDetails: async (employeeId: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${employeeId}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Employee KYC Details
  getKycDetails: async (employeeId: string | number) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${employeeId}`,
      method: 'get',
    });
    return apiRequest(options);
  },

  // Employee Transfer
  transfer: async (
    id: string | number,
    {
      data,
      successMessage,
      failureMessage,
    }: {
      data: {
        new_branch: string;
        new_department?: string;
        transfer_date: string;
        reason?: string;
      };
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'post',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee transferred successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to transfer employee',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Update employee permissions
  updatePermissions: async (
    id: string | number,
    {
      data,
      successMessage,
      failureMessage,
    }: {
      data: { roles: Array<string>; permissions: Array<string> };
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'put',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee permissions updated successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to update employee permissions',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },

  // Update employee status
  updateStatus: async (
    id: string | number,
    {
      data,
      successMessage,
      failureMessage,
    }: {
      data: { status: 'active' | 'inactive' | 'on_leave' };
      successMessage?: string;
      failureMessage?: string;
    }
  ) => {
    const options = await apiOptions({
      url: `${Config.BASE_URL}${SERVICE_URL.EMPLOYEE_DETAILS}/${id}`,
      method: 'patch',
      data: data,
    });
    const toastMessageConfig: any = {
      success: {
        message: successMessage || 'Employee status updated successfully!',
      },
      failure: {
        message: failureMessage || 'Failed to update employee status',
      },
    };
    return apiRequest(options, toastMessageConfig);
  },
};
