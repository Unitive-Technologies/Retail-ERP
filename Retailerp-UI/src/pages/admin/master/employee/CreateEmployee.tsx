import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import { UploadPlusIcon } from '@assets/Images';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  handleValidatedChange,
  isPhoneNumber,
  isValidEmail,
  isValidGSTIN,
  isValidPAN,
  isValidAadhaar,
  isValidIFSC,
  isValidPinCode,
} from '@utils/form-util';
import { commonTextInputProps } from '@components/CommonStyles';
import EmployeeTabDetails from './EmployeeTabDetails';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { EmployeeService } from '@services/EmployeeService';
import { HTTP_STATUSES } from '@constants/Constance';
import { API_SERVICES } from '@services/index';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { EmployeeRoleDropdownService } from '@services/EmployeeRoleDropdownService';
import { EmpCodeAutoGenerationService } from '@services/EmpCodeAutoGenerationService';
import { EmpDepartmentService } from '@services/EmpDepartmentService';

const CreateEmployee = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchStatusMap, setBranchStatusMap] = useState<Record<string, string>>({});
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employmentTypeOptions] = useState([
    { label: 'Full Time', value: 'Full-Time' },
    { label: 'Part Time', value: 'Part-Time' },
    { label: 'Contract', value: 'Contract' },
  ]);
  const [genderOptions] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);
  const [statusOptions] = useState([
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ]);

  const params = new URLSearchParams(location.search);
  const queryType = params.get('type') || undefined;
  const queryRowId = params.get('rowId') || undefined;

  const locState = (location.state || {}) as any;
  const type = locState.type || queryType || 'create';
  const rowData = locState.rowData || {};
  const employeeId = locState.employeeId || queryRowId || undefined;

  const isReadOnly = type === 'view';
  const isEditMode = type === 'edit';
  const isCreateMode = type === 'create';
  const isViewMode = type === 'view';

  // Filter status options: only show Active during creation, show all during edit/view
  const availableStatusOptions = isCreateMode
    ? statusOptions.filter((option) => option.value === 'Active')
    : statusOptions;

  const ACCEPTED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const UserInitialValues = {
    employee_no: undefined,
    employee_name: rowData?.employee_name || '',
    department: rowData?.department || '',
    designation: rowData?.designation
      ? typeof rowData.designation === 'object'
        ? rowData.designation
        : null
      : null,
    joining_date: rowData?.joining_date ? dayjs(rowData.joining_date) : null,
    employment_type: rowData?.employment_type || '',
    gender: rowData?.gender || '',
    dob: rowData?.dob ? dayjs(rowData.dob) : null,
    branch: rowData?.branch || '',
    status: rowData?.status || (isCreateMode ? { label: 'Active', value: 'Active' } : null),
    image: rowData?.image || '',
    contact_details: {
      mobile_no: rowData?.contact_details?.mobile_no || '',
      email_id: rowData?.contact_details?.email_id || '',
      address: rowData?.contact_details?.address || '',
      country: rowData?.contact_details?.country || '',
      state: rowData?.contact_details?.state || '',
      district: rowData?.contact_details?.district || '',
      city: rowData?.contact_details?.city || '',
      pin_code: rowData?.contact_details?.pin_code || '',
    },
    emergency_contact: {
      person: rowData?.emergency_contact?.person || '',
      relationship: rowData?.emergency_contact?.relationship || '',
      number: rowData?.emergency_contact?.number || '',
    },
    experiences: rowData?.experiences || [],
    bank_details: {
      branch_name: '',
      account_holder_name: '',
      bank_name: '',
      account_no: '',
      ifsc_code: '',
    },
    kyc_details: [],
    login_details: {
      user_name: '',
      password: '',
    },
  };

  const edit = useEdit(UserInitialValues);

  const hasError = (specificError: boolean) => isError && specificError;

  const fieldErrors = {
    employee_no: !edit.allFilled('employee_no'),
    employee_name: !edit.allFilled('employee_name'),
    department: !edit.allFilled('department'),
    designation: !edit.allFilled('designation'),
    joining_date: !edit.getValue('joining_date'),
    employment_type: !edit.allFilled('employment_type'),
    gender: !edit.allFilled('gender'),
    dob: !edit.getValue('dob'),
    branch: !edit.allFilled('branch'),
    status: !edit.allFilled('status'),
    image: !edit.allFilled('image'),
  };

  const contactDetailsFieldErrors = {
    mobile_no:
      !edit.allFilled('contact_details.mobile_no') ||
      !isPhoneNumber(edit.getValue('contact_details.mobile_no')),
    email_id:
      !edit.allFilled('contact_details.email_id') ||
      !isValidEmail(edit.getValue('contact_details.email_id')),
    address: !edit.allFilled('contact_details.address'),
    country_id: !edit.getValue('country_id'),
    state_id: !edit.getValue('state_id'),
    district_id: !edit.getValue('district_id'),
    pin_code:
      !edit.allFilled('contact_details.pin_code') ||
      (!!edit.getValue('contact_details.pin_code') &&
        !isValidPinCode(edit.getValue('contact_details.pin_code'))),
    emergency_person: !edit.allFilled('emergency_contact.person'),
    emergency_relationship: !edit.allFilled('emergency_contact.relationship'),
    emergency_number:
      !edit.allFilled('emergency_contact.number') ||
      !isPhoneNumber(edit.getValue('emergency_contact.number')),
  };

  const accountNoRaw = String(edit.getValue('bank_details.account_no') || '');
  const isAccountNoInvalid = accountNoRaw.length > 0 && accountNoRaw.length < 9;

  // Bank details are optional - only show errors if any field is partially filled
  const hasAnyBankField =
    edit.getValue('bank_details.branch_name') ||
    edit.getValue('bank_details.account_holder_name') ||
    edit.getValue('bank_details.bank_name') ||
    edit.getValue('bank_details.account_no') ||
    edit.getValue('bank_details.ifsc_code');

  const bankDetailsFieldErrors = {
    branch_name: hasAnyBankField && !edit.allFilled('bank_details.branch_name'),
    account_holder_name:
      hasAnyBankField && !edit.allFilled('bank_details.account_holder_name'),
    bank_name: hasAnyBankField && !edit.allFilled('bank_details.bank_name'),
    account_no:
      hasAnyBankField &&
      (!edit.allFilled('bank_details.account_no') || isAccountNoInvalid),
    ifsc_code:
      hasAnyBankField &&
      (!edit.allFilled('bank_details.ifsc_code') ||
        (!!edit.getValue('bank_details.ifsc_code') &&
          !isValidIFSC(edit.getValue('bank_details.ifsc_code')))),
  };

  // Login details are optional - don't show field errors since they're not required
  const loginDetailsFieldErrors = {
    user_name: false,
    password: false,
  };

  const validateBasicDetails = () => {
    // During creation, validate that selected branch is Active
    if (isCreateMode) {
      const branchValue = edit.getValue('branch');
      const branchId = branchValue?.value ?? branchValue ?? null;
      
      if (branchId) {
        const branchStatus = branchStatusMap[branchId.toString()];
        if (branchStatus && branchStatus !== 'Active' && branchStatus !== 'active') {
          return false;
        }
      }

      // During creation, validate that employee status is Active
      const statusValue = edit.getValue('status');
      const status = statusValue?.value ?? statusValue ?? '';
      if (status && status !== 'Active' && status !== 'active') {
        return false;
      }
    }
    
    return !Object.values(fieldErrors).some((error) => error);
  };

  const validateContactDetails = () => {
    if (
      !edit.getValue('contact_details.mobile_no') ||
      !isPhoneNumber(edit.getValue('contact_details.mobile_no'))
    ) {
      toast.error('Please enter a valid mobile number');
      return false;
    }
    if (
      !edit.getValue('contact_details.email_id') ||
      !isValidEmail(edit.getValue('contact_details.email_id'))
    ) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!edit.getValue('contact_details.address')) {
      toast.error('Please enter address');
      return false;
    }
    if (!edit.getValue('country_id')) {
      toast.error('Please select country');
      return false;
    }
    if (!edit.getValue('state_id')) {
      toast.error('Please select state');
      return false;
    }
    if (!edit.getValue('district_id')) {
      toast.error('Please select district');
      return false;
    }
    const pinCode = edit.getValue('contact_details.pin_code');
    if (!pinCode) {
      toast.error('Please enter pin code');
      return false;
    }
    if (!isValidPinCode(pinCode)) {
      toast.error('Please enter a valid pin code');
      return false;
    }
    if (!edit.getValue('emergency_contact.person')) {
      toast.error('Please enter emergency contact person');
      return false;
    }
    if (!edit.getValue('emergency_contact.relationship')) {
      toast.error('Please select emergency contact relationship');
      return false;
    }
    if (
      !edit.getValue('emergency_contact.number') ||
      !isPhoneNumber(edit.getValue('emergency_contact.number'))
    ) {
      toast.error('Please enter a valid emergency contact number');
      return false;
    }
    return true;
  };

  const validatePreviousExp = () => {
    const prevExpList = edit.getValue('experiences') || [];

    const filledRows = prevExpList.filter(
      (row: any) => row.organization_name || row.role || row.location
    );

    if (!filledRows.length) {
      return true;
    }

    for (let i = 0; i < filledRows.length; i++) {
      const item = filledRows[i];
      if (!item.organization_name) {
        toast.error(
          `Please enter Organization Name for Row ${i + 1} in Previous Experience`
        );
        return false;
      }
      if (!item.role) {
        toast.error(
          `Please enter Role for Row ${i + 1} in Previous Experience`
        );
        return false;
      }
      if (!item.location) {
        toast.error(
          `Please enter Location for Row ${i + 1} in Previous Experience`
        );
        return false;
      }
    }

    return true;
  };

  const validateBankDetails = () => {
    // Bank details are optional - only validate if any field is filled
    const branchName = edit.getValue('bank_details.branch_name');
    const accountHolderName = edit.getValue('bank_details.account_holder_name');
    const bankName = edit.getValue('bank_details.bank_name');
    const accountNo = edit.getValue('bank_details.account_no');
    const ifscCode = edit.getValue('bank_details.ifsc_code');

    // If no bank details are filled, skip validation
    if (
      !branchName &&
      !accountHolderName &&
      !bankName &&
      !accountNo &&
      !ifscCode
    ) {
      return true;
    }

    // If any field is filled, validate all required fields
    if (!branchName) {
      toast.error('Please enter bank branch name');
      return false;
    }
    if (!accountHolderName) {
      toast.error('Please enter account holder name');
      return false;
    }
    if (!bankName) {
      toast.error('Please enter bank name');
      return false;
    }
    if (!accountNo) {
      toast.error('Please enter account number');
      return false;
    }
    const accountNoStr = String(accountNo || '');
    if (accountNoStr.length > 0 && accountNoStr.length < 9) {
      toast.error('Please enter a valid Account number');
      return false;
    }
    if (!ifscCode) {
      toast.error('Please enter IFSC code');
      return false;
    }
    if (!isValidIFSC(ifscCode)) {
      toast.error('Please enter a valid IFSC code');
      return false;
    }
    return true;
  };

  const validateKycDetails = () => {
    const kycList = edit.getValue('kyc_details') || [];

    // Accept rows with either file or document_url
    const filledRows = kycList.filter(
      (row: any) => row.docName || row.docNo || row.file || row.document_url
    );

    // KYC details are optional - if no rows are filled, skip validation
    if (!filledRows.length) {
      return true;
    }

    for (let i = 0; i < filledRows.length; i++) {
      const item = filledRows[i];
      if (!item.docName) {
        toast.error(
          `Please select Document Name for S.No ${i + 1} in KYC Details`
        );
        return false;
      }
      if (!item.docNo) {
        toast.error(
          `Please enter Document Number for S.No ${i + 1} in KYC Details`
        );
        return false;
      }
      // Accept either file or document_url
      if (!item.file && !item.document_url) {
        toast.error(
          `Please upload Document File for S.No ${i + 1} in KYC Details`
        );
        return false;
      }

      // Robust type detection and normalization for validation
      const docNameRaw = (item.docName && item.docName.value) ?? item.docName;
      const docNameLabel = String(
        (item.docName && item.docName.label) || item.docName || ''
      ).toLowerCase();
      const docNumberRaw = String(item.docNo || '');
      const docNumberUpper = docNumberRaw.trim().toUpperCase();
      const docNumberDigits = docNumberRaw.replace(/\s+/g, '');

      const isPANType =
        String(docNameRaw) === '1' || /\bpan\b/i.test(String(item.docName));
      const isGSTType =
        String(docNameRaw) === '2' ||
        /\bgst\b/i.test(String(item.docName)) ||
        docNameLabel.includes('gst');
      const isAadhaarType =
        String(docNameRaw) === '4' ||
        /aadhaar|aadhar/i.test(String(item.docName)) ||
        docNameLabel.includes('aadhaar') ||
        docNameLabel.includes('aadhar');

      if (isPANType) {
        if (!isValidPAN(docNumberUpper)) {
          toast.error(`Please enter PAN for S.No ${i + 1} in KYC Details`);
          return false;
        }
      }

      if (isGSTType) {
        if (!isValidGSTIN(docNumberUpper)) {
          toast.error(`Please enter  GST for S.No ${i + 1} in KYC Details`);
          return false;
        }
      }

      if (isAadhaarType) {
        if (!isValidAadhaar(docNumberDigits)) {
          toast.error(`Please enter Aadhaar for S.No ${i + 1} in KYC Details`);
          return false;
        }
      }
    }

    return true;
  };

  const validateLoginDetails = () => {
    // Login details are completely optional - always return true
    // No validation needed since login details are not mandatory
    return true;
  };

  const handleEditMode = () => {
    navigate('/admin/master/employee/form', {
      replace: true,
      state: {
        rowData: rowData,
        type: 'edit',
        employeeId: employeeId,
      },
    });
  };

  const handleCreateEmployee = async () => {
    const isValidBasicDetails = validateBasicDetails();
    const isValidContactDetails = validateContactDetails();
    const isValidPreviousExp = validatePreviousExp();
    const isValidBankDetails = validateBankDetails();
    const isValidKycDetails = validateKycDetails();
    const isValidLoginDetails = validateLoginDetails();

    // Log validation results and payload for debugging
    console.log('Validation Results:', {
      isValidBasicDetails,
      isValidContactDetails,
      isValidPreviousExp,
      isValidBankDetails,
      isValidKycDetails,
      isValidLoginDetails,
      contactDetailsFieldErrors,
      bankDetailsFieldErrors,
      loginDetailsFieldErrors,
      fieldErrors,
    });

    // Check if optional sections have data
    const hasBankDetails =
      edit.getValue('bank_details.account_holder_name') ||
      edit.getValue('bank_details.bank_name') ||
      edit.getValue('bank_details.ifsc_code') ||
      edit.getValue('bank_details.account_no') ||
      edit.getValue('bank_details.branch_name');

    const kycDocuments = (edit.getValue('kyc_details') || [])
      .filter(
        (row: any) =>
          row.docName &&
          row.docNo &&
          row.document_url &&
          typeof row.document_url === 'string' &&
          row.document_url.trim() !== ''
      )
      .map((row: any) => ({
        doc_type: row.docName,
        doc_number: row.docNo,
        file_url: row.document_url,
      }));

    const experiences = (edit.getValue('experiences') || [])
      .filter(
        (exp: any) =>
          exp.organization_name &&
          exp.role &&
          exp.location &&
          exp.duration_from &&
          exp.duration_to
      )
      .map((exp: any) => ({
        organization_name: exp.organization_name,
        role: exp.role,
        duration_from: exp.duration_from,
        duration_to: exp.duration_to,
        location: exp.location,
      }));

    // Extract required field values with proper type conversion
    const departmentValue = edit.getValue('department');
    const departmentId = departmentValue
      ? Number(departmentValue?.value ?? departmentValue)
      : null;

    const roleValue = edit.getValue('designation');
    const roleId = roleValue ? Number(roleValue?.value ?? roleValue) : null;

    const branchValue = edit.getValue('branch');
    const branchId = branchValue
      ? Number(branchValue?.value ?? branchValue)
      : null;

    const employeePayload: any = {
      employee_no: edit.getValue('employee_no') || '',
      employee_name: edit.getValue('employee_name') || '',
      department_id: departmentId,
      role_id: roleId,
      joining_date: edit.getValue('joining_date')?.format('YYYY-MM-DD') || '',
      employment_type:
        edit.getValue('employment_type')?.value ??
        edit.getValue('employment_type') ??
        '',
      gender: (
        edit.getValue('gender')?.value ??
        edit.getValue('gender') ??
        ''
      ).replace(/^./, (c: string) => c.toUpperCase()),
      date_of_birth: edit.getValue('dob')?.format('YYYY-MM-DD') || '',
      branch_id: branchId,
      status: (
        edit.getValue('status')?.value ??
        edit.getValue('status') ??
        ''
      ).replace(/^./, (c: string) => c.toUpperCase()),
      profile_image_url: edit.getValue('image') || '',
      contact: {
        mobile_number: edit.getValue('contact_details.mobile_no') || '',
        email_id: edit.getValue('contact_details.email_id') || '',
        address: edit.getValue('contact_details.address') || '',
        country_id: Number(edit.getValue('country_id')) || null,
        state_id: Number(edit.getValue('state_id')) || null,
        district_id:
          Number(
            edit.getValue('district_id')?.value ?? edit.getValue('district_id')
          ) || null,
        pin_code: edit.getValue('contact_details.pin_code') || '',
        emergency_contact_person:
          edit.getValue('emergency_contact.person') || '',
        relationship:
          edit.getValue('emergency_contact.relationship')?.value ??
          edit.getValue('emergency_contact.relationship') ??
          '',
        emergency_contact_number:
          edit.getValue('emergency_contact.number') || '',
      },
    };

    // Always include bank_account (API might require it)
    employeePayload.bank_account = {
      account_holder_name:
        edit.getValue('bank_details.account_holder_name') || '',
      bank_name: edit.getValue('bank_details.bank_name') || '',
      ifsc_code: edit.getValue('bank_details.ifsc_code') || '',
      account_number: edit.getValue('bank_details.account_no') || '',
      bank_branch_name: edit.getValue('bank_details.branch_name') || '',
    };

    // Always include arrays, even if empty (API might require them)
    employeePayload.kyc_documents = kycDocuments;
    employeePayload.experiences = experiences;

    const loginUserName = edit.getValue('login_details.user_name');
    const loginPassword = edit.getValue('login_details.password');

    if (loginUserName && loginPassword) {
      employeePayload.login = {
        email: loginUserName,
        password_hash: loginPassword,
        role_id: 4,
      };
    }

    // Additional validation: Check branch and employee status during creation
    if (isCreateMode) {
      const branchValue = edit.getValue('branch');
      const branchId = branchValue?.value ?? branchValue ?? null;
      
      if (branchId) {
        const branchStatus = branchStatusMap[branchId.toString()];
        if (branchStatus && branchStatus !== 'Active' && branchStatus !== 'active') {
          setIsError(true);
          return;
        }
      }

      // Validate employee status during creation
      const statusValue = edit.getValue('status');
      const status = statusValue?.value ?? statusValue ?? '';
      if (status && status !== 'Active' && status !== 'active') {
        setIsError(true);
        return;
      }
    }

    if (!isValidBasicDetails || !isValidContactDetails) {
      setIsError(true);
      toast.error('Please fill all required fields correctly');
      return;
    }

    // Optional validations - only validate if fields are filled
    if (
      !isValidPreviousExp ||
      !isValidBankDetails ||
      !isValidKycDetails ||
      !isValidLoginDetails
    ) {
      setIsError(true);
    }

    setIsError(false);

    try {
      let response;
      if (type === 'edit' && employeeId) {
        response = await EmployeeService.replace(employeeId, {
          data: employeePayload,
          successMessage: 'Employee updated successfully!',
          failureMessage: 'Failed to update employee',
        });
      } else {
        response = await EmployeeService.create({
          data: employeePayload,
          successMessage: 'Employee created successfully!',
          failureMessage: 'Failed to create employee',
        });
      }

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        navigate('/admin/master/employee');
      } else {
        toast.error(response?.message || 'Failed to create/update employee');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create/update employee');
    }
  };

  const handleGoBack = () => navigate(-1);

  const uploadSubCategoryImageError = hasError(fieldErrors.image);

  const onSubCategoryImageBrowse = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsDocumentUploading(true);

    const file = event?.target?.files?.[0];

    if (!file || !ACCEPTED_MIME_TYPES.includes(file.type)) {
      setIsDocumentUploading(false);
      toast.error(
        'Please upload a valid image file (JPEG, JPG, PNG, GIF, or WebP)'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIsDocumentUploading(false);
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    const updateData = (url: string) => {
      edit.update({ image: url });
    };

    try {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = async () => {
        const uploadImageRes =
          await API_SERVICES.ImageUploadService.uploadImage(
            formData,
            'Image uploaded successfully',
            'Image upload failed'
          );

        if (
          uploadImageRes?.status < HTTP_STATUSES.BAD_REQUEST &&
          (uploadImageRes as any)?.data?.data?.images?.length
        ) {
          const document_url =
            (uploadImageRes as any)?.data?.data?.images?.[0]?.Location ?? '';
          updateData(document_url);
        }

        setIsDocumentUploading(false);
      };

      img.onerror = () => {
        setIsDocumentUploading(false);
        toast.error('Invalid image file');
      };
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setIsDocumentUploading(false);
    }
  };

  const [employeeCodeLoading, setEmployeeCodeLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await EmpDepartmentService.getDepartmentsDropdown();
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res.data.data?.departments)
        ) {
          setDepartmentOptions(
            res.data.data.departments.map((dept: any) => ({
              label: dept.name, // ✅ correct key
              value: dept.id?.toString() ?? '',
            }))
          );
        }
      } catch (err) {
        setDepartmentOptions([]);
      }
    };

    const fetchBranches = async () => {
      try {
        const res = await DropDownServiceAll.getBranches();
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res?.data?.data?.branches)
        ) {
          // Create a map of branch ID to status for validation
          const statusMap: Record<string, string> = {};
          res.data.data.branches.forEach((branch: any) => {
            statusMap[branch.id?.toString() ?? ''] = branch.status || '';
          });
          setBranchStatusMap(statusMap);

          // Show all branches in dropdown (no filtering)
          setBranchOptions(
            res.data.data.branches.map((branch: any) => ({
              label: branch.branch_name,
              value: branch.id?.toString() ?? '',
            }))
          );
        }
      } catch (err) {
        setBranchOptions([]);
        setBranchStatusMap({});
      }
    };

    const fetchEmployeeCode = async () => {
      try {
        setEmployeeCodeLoading(true);

        const fy = '24-25';
        const params = { prefix: 'EMP', fy };

        const res =
          await EmpCodeAutoGenerationService.getAutoGeneratedCode(params);
        console.log('Employee Code API Response:', res);

        const code = res?.data?.data?.employee_code;

        if (code) {
          console.log('Auto-generated Employee Code:', code);
          edit.update({ employee_no: code });
        } else if (res?.error || res?.status === 500) {
          toast.error(res?.message || 'Failed to generate employee code.');
          edit.update({ employee_no: '' });
        }
      } catch (err) {
        toast.error(
          'Failed to generate employee code. Please try again later.'
        );
        edit.update({ employee_no: '' });
        console.error('Error fetching employee code:', err);
      } finally {
        setEmployeeCodeLoading(false);
      }
    };

    fetchDepartments();
    fetchBranches();
    if (isCreateMode) {
      fetchEmployeeCode();
    }
  }, []);

  useEffect(() => {
    if ((isEditMode || isViewMode) && employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId, isEditMode, isViewMode]);

  useEffect(() => {
    if ((isViewMode || isEditMode) && edit) {
      const contactDetails = edit.getValue('contact_details');
      const bankDetails = edit.getValue('bank_details');

      if (contactDetails?.mobile_no || bankDetails?.account_no) {
        setForceRender((prev) => prev + 1);
      }
    }
  }, [
    isViewMode,
    isEditMode,
    edit?.getValue('contact_details'),
    edit?.getValue('bank_details'),
  ]);

  useEffect(() => {
    const departmentValue = edit.getValue('department');
    const departmentId = departmentValue
      ? Number(departmentValue?.value ?? departmentValue)
      : null;

    if (!departmentId) {
      setDesignationOptions([]);
      return;
    }

    const fetchRoles = async (deptId: number) => {
      try {
        const res = await EmployeeRoleDropdownService.getDropdown({
          department_id: deptId,
        });
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res.data.data?.roles)
        ) {
          const options = res.data.data.roles.map((role: any) => ({
            label: role.name,
            value: role.id?.toString() ?? '',
          }));
          setDesignationOptions(options);
          console.log('Role Options:', options);
        } else {
          setDesignationOptions([]);
        }
      } catch (err) {
        setDesignationOptions([]);
      }
    };

    fetchRoles(departmentId);
  }, [edit?.getValue('department')]);

  const fetchContactDetailsFromGetAll = async (employeeId: string) => {
    try {
      const allResponse = await EmployeeService.getAll();
      const allEmployees = allResponse?.data?.data?.employees || [];
      const employeeWithContact = allEmployees.find(
        (emp: any) => emp.id === parseInt(employeeId)
      );

      if (employeeWithContact) {
        return {
          mobile_number: employeeWithContact.mobile_number || '',
          email_id: employeeWithContact.email_id || '',
          address: employeeWithContact.address || '',
          country_id: employeeWithContact.country_id || '',
          state_id: employeeWithContact.state_id || '',
          district_id: employeeWithContact.district_id || '',
          pin_code: employeeWithContact.pin_code || '',
          emergency_contact_person:
            employeeWithContact.emergency_contact_person || '',
          relationship: employeeWithContact.relationship || '',
          emergency_contact_number:
            employeeWithContact.emergency_contact_number || '',
          branch_name: employeeWithContact.branch_name || '',
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching contact details from GetAll:', error);
      return null;
    }
  };

  const fetchEmployeeData = async (id: string) => {
    try {
      setLoading(true);
      const response = await EmployeeService.getById(id);

      if (
        response?.status < HTTP_STATUSES.BAD_REQUEST &&
        response?.data?.data?.employee
      ) {
        const apiData = response.data.data;
        const employeeData = apiData.employee;

        // Since GetById doesn't return contact data, fetch it from GetAll
        let contactData = null;
        if (isEditMode || isViewMode) {
          contactData = await fetchContactDetailsFromGetAll(id);
          console.log('Contact data from GetAll:', contactData);
        }

        const mapEnumToFormValue = (apiValue: string, field: string) => {
          switch (field) {
            case 'employment_type':
              if (apiValue === 'Full-Time')
                return { label: 'Full Time', value: 'Full-Time' };
              if (apiValue === 'Part-Time')
                return { label: 'Part Time', value: 'Part-Time' };
              return { label: apiValue, value: apiValue };
            case 'gender':
              if (apiValue === 'Male') return { label: 'Male', value: 'Male' };
              if (apiValue === 'Female')
                return { label: 'Female', value: 'Female' };
              if (apiValue === 'Other')
                return { label: 'Other', value: 'Other' };
              return { label: apiValue, value: apiValue };
            case 'status':
              if (apiValue === 'Active')
                return { label: 'Active', value: 'Active' };
              if (apiValue === 'Inactive')
                return { label: 'Inactive', value: 'Inactive' };
              return { label: apiValue, value: apiValue };
            case 'relationship':
              if (apiValue === 'Father')
                return { label: 'Father', value: 'Father' };
              if (apiValue === 'Mother')
                return { label: 'Mother', value: 'Mother' };
              if (apiValue === 'Guardian')
                return { label: 'Guardian', value: 'Guardian' };
              return { label: apiValue, value: apiValue };
            default:
              return { label: apiValue, value: apiValue };
          }
        };

        const mapIdToFormValue = (
          id: number,
          field: string,
          apiData?: any,
          contactDataFromGetAll?: any
        ): { label: string; value: string } => {
          if (!id || typeof id !== 'number') {
            return { label: '', value: '' };
          }

          switch (field) {
            case 'department':
              const deptName =
                apiData?.department?.department_name ||
                (id === 1 ? 'Admin' : 'IT');
              return { label: deptName, value: id.toString() };
            case 'designation':
              const desigName =
                apiData?.designation?.designation_name ||
                (id === 1 ? 'Manager' : 'Assistant Manager');
              return { label: desigName, value: id.toString() };
            case 'branch':
              // First try to get from branchOptions (most reliable)
              const branchFromOptions = branchOptions.find(
                (opt: any) => opt.value === id.toString() || opt.value === id
              ) as { label: string; value: string | number } | undefined;
              if (branchFromOptions) {
                return { label: branchFromOptions.label, value: id.toString() };
              }
              // Fallback to contactData from GetAll (which has branch_name)
              const branchName =
                contactDataFromGetAll?.branch_name ||
                apiData?.branch?.branch_name ||
                employeeData?.branch_name ||
                '';
              return { label: branchName, value: id.toString() };
            default:
              return { label: `Option ${id}`, value: id.toString() };
          }
        };

        const formData = {
          employee_no: employeeData.employee_no || '',
          employee_name: employeeData.employee_name || '',
          department: employeeData.department_id
            ? mapIdToFormValue(
                employeeData.department_id,
                'department',
                employeeData,
                contactData
              )
            : null,
          designation: employeeData.role_id
            ? mapIdToFormValue(
                employeeData.role_id,
                'designation',
                employeeData,
                contactData
              )
            : null,
          joining_date: employeeData.joining_date
            ? dayjs(employeeData.joining_date)
            : null,
          employment_type: employeeData.employment_type
            ? mapEnumToFormValue(
                employeeData.employment_type,
                'employment_type'
              )
            : null,
          gender: employeeData.gender
            ? mapEnumToFormValue(employeeData.gender, 'gender')
            : null,
          dob: employeeData.date_of_birth
            ? dayjs(employeeData.date_of_birth)
            : null,
          branch: employeeData.branch_id
            ? mapIdToFormValue(
                employeeData.branch_id,
                'branch',
                employeeData,
                contactData
              )
            : null,
          status: employeeData.status
            ? mapEnumToFormValue(employeeData.status, 'status')
            : null,
          image: employeeData.profile_image_url || '',

          country_id: contactData?.country_id || '',
          state_id: contactData?.state_id || '',
          district_id: contactData?.district_id || '',
          contact_details: {
            mobile_no: contactData?.mobile_number || '',
            email_id: contactData?.email_id || '',
            address: contactData?.address || '',
            district: contactData?.district_id || '',
            pin_code: contactData?.pin_code || '',
          },

          emergency_contact: {
            person: contactData?.emergency_contact_person || '',
            relationship: contactData?.relationship
              ? mapEnumToFormValue(contactData.relationship, 'relationship')
              : null,
            number: contactData?.emergency_contact_number || '',
          },

          bank_details: {
            branch_name: apiData.bank_account?.bank_branch_name || '',
            account_holder_name:
              apiData.bank_account?.account_holder_name || '',
            bank_name: apiData.bank_account?.bank_name || '',
            account_no: apiData.bank_account?.account_number || '',
            ifsc_code: apiData.bank_account?.ifsc_code || '',
          },

          login_details: {
            user_name: apiData.login?.email || '',
            password: apiData.login?.password_hash || '',
          },

          experiences: (apiData.experiences || []).map((exp: any) => ({
            id: exp.id || Date.now(),
            organization_name: exp.organization_name || '',
            role: exp.role || '',
            duration_from: exp.duration_from ? dayjs(exp.duration_from) : null,
            duration_to: exp.duration_to ? dayjs(exp.duration_to) : null,
            location: exp.location || '',
          })),

          kyc_details: (apiData.kyc_documents || []).map(
            (kyc: any, index: number) => ({
              id: kyc.id || index + 1,
              docName: kyc.doc_type || '',
              docNo: kyc.doc_number || '',
              file: null,
              document_url: kyc.file_url || '',
            })
          ),
        };

        console.log('Final Form Data to Update:', formData);
        edit.update(formData);
      } else {
        toast.error('Employee data not found in response');
      }
    } catch (error: any) {
      console.error('Error fetching employee data:', error);
      toast.error(error?.message || 'Failed to fetch employee data');

      if (error?.response?.status === 404) {
        toast.error('Employee not found');
        navigate('/admin/master/employee');
      }
    } finally {
      setLoading(false);
    }
  };

  // disable invalid dates for DOB
  const shouldDisableDob = (date: dayjs.Dayjs) => {
    const today = dayjs();
    const eighteenYearsAgo = today.subtract(18, 'year');
    // Disable future dates and today, and dates less than 18 years ago
    return (
      date.isAfter(today, 'day') ||
      date.isSame(today, 'day') ||
      date.isAfter(eighteenYearsAgo, 'day')
    );
  };

  const handleDobChange = (newValue: dayjs.Dayjs | null) => {
    if (!newValue) {
      edit.update({ dob: null });
      return;
    }
    const today = dayjs();
    const eighteenYearsAgo = today.subtract(18, 'year');
    if (
      newValue.isAfter(today, 'day') ||
      newValue.isSame(today, 'day') ||
      newValue.isAfter(eighteenYearsAgo, 'day')
    ) {
      toast.error('Please select a valid date of birth.');
      edit.update({ dob: null });
      return;
    }
    edit.update({ dob: newValue });
  };

  return (
    <Grid
      container
      flexDirection="column"
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        title={
          type === 'create'
            ? 'CREATE EMPLOYEE'
            : type === 'edit'
              ? 'EDIT EMPLOYEE'
              : 'VIEW EMPLOYEE'
        }
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/master/employee"
      />

      <Grid container size="grow">
        <Grid
          container
          width="100%"
          sx={{
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${theme.Colors.grayLight}`,
            alignContent: 'flex-start',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <Grid
            container
            size={{ xs: 12, md: 12 }}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              paddingBottom: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
              }}
            >
              Basic Details
            </Typography>
          </Grid>

          {/* Image Upload */}
          <Grid
            size={{ xs: 12, md: 12 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
              mb: 2,
            }}
          >
            <div style={{ width: '130px', height: '130px' }}>
              <DragDropUpload
                required
                image_url={edit.getValue('image')}
                onBrowseButtonClick={onSubCategoryImageBrowse}
                handleDeleteImage={() => edit.update({ image: '' })}
                isError={uploadSubCategoryImageError}
                uploadText={isDocumentUploading ? 'Uploading...' : ''}
                image_icon={<UploadPlusIcon />}
                disabled={isDocumentUploading || isViewMode}
                isViewUploadedImage={edit.getValue('image') || ''}
              />
            </div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Employee No"
              value={
                employeeCodeLoading
                  ? 'Loading...'
                  : edit.getValue('employee_no') || ''
              }
              onChange={() => {}}
              isError={hasError(fieldErrors.employee_no)}
              disabled={true}
              {...commonTextInputProps}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Employee Name"
              value={edit.getValue('employee_name')}
              onChange={(e: any) =>
                handleValidatedChange(e, edit, 'employee_name', 'string')
              }
              isError={hasError(fieldErrors.employee_name)}
              disabled={isReadOnly}
              {...commonTextInputProps}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Department"
              options={departmentOptions}
              value={
                departmentOptions.find(
                  (opt: any) =>
                    opt.value === (edit.getValue('department')?.value ?? null)
                ) || null
              }
              onChange={(e, value) => edit.update({ department: value })}
              isError={hasError(fieldErrors.department)}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Designation"
              options={designationOptions}
              value={
                designationOptions.find(
                  (opt: any) =>
                    opt.value === (edit.getValue('designation')?.value ?? null)
                ) || null
              }
              onChange={(e, value) => edit.update({ designation: value })}
              isError={hasError(fieldErrors.designation)}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              labelText="Joining Date"
              value={edit.getValue('joining_date')}
              handleChange={(newValue) =>
                edit.update({ joining_date: newValue })
              }
              handleClear={() => edit.update({ joining_date: null })}
              isError={hasError(fieldErrors.joining_date)}
              isReadOnly={isReadOnly}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Employment Type"
              options={employmentTypeOptions}
              value={edit.getValue('employment_type')}
              onChange={(e, value) => edit.update({ employment_type: value })}
              isError={hasError(fieldErrors.employment_type)}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Gender"
              options={genderOptions}
              value={edit.getValue('gender')}
              onChange={(e, value) => edit.update({ gender: value })}
              isError={hasError(fieldErrors.gender)}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <MUHDatePickerComponent
              labelText="Date of Birth"
              value={edit.getValue('dob')}
              handleChange={handleDobChange}
              handleClear={() => edit.update({ dob: null })}
              isError={hasError(fieldErrors.dob)}
              isReadOnly={isReadOnly}
              required
              shouldDisableDate={shouldDisableDob}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Branch"
              options={branchOptions}
              value={edit.getValue('branch')}
              onChange={(e, value) => edit.update({ branch: value })}
              isError={hasError(fieldErrors.branch)}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Status"
              options={availableStatusOptions}
              value={edit.getValue('status')}
              onChange={(e, value) => edit.update({ status: value })}
              isError={hasError(fieldErrors.status)}
              isReadOnly={isReadOnly}
            />
          </Grid>
        </Grid>

        <EmployeeTabDetails
          key={forceRender}
          edit={edit}
          isError={isError}
          type={type}
          bankDetailsFieldErrors={bankDetailsFieldErrors}
          loginDetailsFieldErrors={loginDetailsFieldErrors}
          contactDetailsFieldErrors={contactDetailsFieldErrors}
        />
      </Grid>

      <FormAction
        firstBtntxt={
          type === 'edit' ? 'Update' : type === 'create' ? 'Create' : 'Edit'
        }
        secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
        handleCreate={isReadOnly ? handleEditMode : handleCreateEmployee}
        handleCancel={handleGoBack}
        disableCreate={type === 'view'}
      />
    </Grid>
  );
};

export default CreateEmployee;
