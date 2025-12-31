import { useEffect, useState } from 'react';
import PageHeader from '@components/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import BranchStepper from './BranchStepper';
import toast from 'react-hot-toast';
import {
  handleValidatedChange,
  isPhoneNumber,
  isValidEmail,
  isValidGSTIN,
  isValidPAN,
  isValidAadhaar,
  isValidPinCode,
  isValidIFSC,
} from '@utils/form-util';
import { useEdit } from '@hooks/useEdit';
import Grid from '@mui/material/Grid2';
import {
  commonTextInputProps,
  formLayoutWithHeaderStyle,
} from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  BrowserImageUpload,
  ButtonComponent,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import FormAction from '@components/ProjectCommon/FormAction';
import {
  BranchState,
  BranchStatus,
  DistrictListBranch,
} from '@constants/DummyData';
import TabFormDetails from './TabFormDetails';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { Download } from '@mui/icons-material';
import { Typography, useTheme, Box } from '@mui/material';
import InvoiceSetting from './InvoiceSetting';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES, docNames } from '@constants/Constance';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const BranchForm = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const paramRowId = Number(params.get('rowId'));
  const type = params.get('type');
  const heading = params.get('heading');
  const [rowData, setRowData] = useState<any>({});
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const isReadOnly = type === 'view';
  const isCreateMode = type === 'create';
  const isEditMode = type === 'edit';
  const stateOption = BranchState.find(
    (state: any) => state.value === rowData.state_id
  );
  const districtOption = DistrictListBranch.find(
    (dist: any) => dist.value === rowData.district_id
  );
  const branchStatusOpt = BranchStatus.find(
    (opt: any) => opt.value === rowData.status || null
  );
  
  // Filter status options: only show Active during creation, show all during edit/view
  const availableStatusOptions = isCreateMode
    ? BranchStatus.filter((option) => option.value === 'Active')
    : BranchStatus;

  const InitialValues: any = {
    branch_no: rowData.branch_no || '',
    branch_name: rowData.branch_name || '',
    contact_person: rowData.contact_person || '',
    mobile_no: rowData.mobile || '',
    email_id: rowData.email || '',
    address: rowData.address || '',
    state_id: stateOption,
    district: districtOption,
    pin_code: rowData.pin_code || '',
    gst_no: rowData.gst_no || '',
    signature: rowData.signature_url || '',
    signature_file: rowData.signature_url
      ? { name: String(rowData.signature_url).split('/').pop() }
      : null,
    status: branchStatusOpt || (isCreateMode ? { label: 'Active', value: 'Active' } : null),
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
    invoice_settings: [],
  };

  const edit = useEdit(InitialValues);

  const hasError = (specificError: boolean) => isError && specificError;

  const fieldErrors = {
    branch_no: !edit.allFilled('branch_no'),
    branch_name: !edit.allFilled('branch_name'),
    contact_person: !edit.allFilled('contact_person'),
    mobile_no:
      !edit.allFilled('mobile_no') ||
      !isPhoneNumber(edit.getValue('mobile_no')),
    email_id:
      !edit.allFilled('email_id') || !isValidEmail(edit.getValue('email_id')),
    address: !edit.allFilled('address'),
    state_id: !edit.allFilled('state_id'),
    district: !edit.allFilled('district'),
    pin_code:
      !edit.allFilled('pin_code') || !isValidPinCode(edit.getValue('pin_code')),
    gst_no: !edit.allFilled('gst_no') || !isValidGSTIN(edit.getValue('gst_no')),
    status: !edit.allFilled('status'),
  };

  const bankDetailsFiledErrors = {
    branch_name: !edit.allFilled('bank_details.branch_name'),
    account_holder_name: !edit.allFilled('bank_details.account_holder_name'),
    bank_name: !edit.allFilled('bank_details.bank_name'),
    // account_no: !edit.allFilled('bank_details.account_no'),
    account_no:
      !edit.allFilled('bank_details.account_no') ||
      (!!edit.getValue('bank_details.account_no') &&
        String(edit.getValue('bank_details.account_no') || '').length < 9),
    ifsc_code:
      !edit.allFilled('bank_details.ifsc_code') ||
      (!!edit.getValue('bank_details.ifsc_code') &&
        !isValidIFSC(edit.getValue('bank_details.ifsc_code'))),
  };

  const loginDetailsFieldErrors = {
    user_name: !edit.allFilled('login_details.user_name'),
    password: !edit.allFilled('login_details.password'),
  };

  const validateMyProfile = () => {
    // During creation, validate that branch status is Active
    if (isCreateMode) {
      const statusValue = edit.getValue('status');
      const status = statusValue?.value ?? statusValue ?? '';
      if (status && status !== 'Active' && status !== 'active') {
        return false;
      }
    }
    
    return !Object.values(fieldErrors).some((error) => error);
  };

  const validateBankDetails = () => {
    // Required fields present?
    const hasMissing = Object.values(bankDetailsFiledErrors).some(
      (error) => error
    );
    if (hasMissing) return false;
    return true;
  };

  const validateLoginDetails = () => {
    return !Object.values(loginDetailsFieldErrors).some((error) => error);
  };

  const validateKycFields = () => {
    const kycList = edit.getValue('kyc_details') || [];
    const filledRows = kycList.filter(
      (row: any) => row.docName || row.docNo || row.document_url
    );

    if (!filledRows.length) {
      toast.error('Please upload at least one complete KYC document.');
      return false;
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
      if (!item.document_url) {
        toast.error(
          `Please upload Document File for S.No ${i + 1} in KYC Details`
        );
        return false;
      }

      // Validate specific formats based on selected document type
      const selected = (() => {
        const v = item.docName;
        const match = docNames.find(
          (opt: any) =>
            String(opt.value) === String(v) || String(opt.label) === String(v)
        );
        return match?.value;
      })();

      if (selected === 1 && !isValidPAN(item.docNo)) {
        toast.error(`Invalid PAN for S.No ${i + 1} in KYC Details`);
        return false;
      }
      if (selected === 2 && !isValidGSTIN(item.docNo)) {
        toast.error(`Invalid GST for S.No ${i + 1} in KYC Details`);
        return false;
      }
      if (selected === 4 && !isValidAadhaar(item.docNo)) {
        toast.error(`Invalid Aadhaar for S.No ${i + 1} in KYC Details`);
        return false;
      }
    }

    return true;
  };

  const validateInvoiceSettings = () => {
    const invoiceList = edit.getValue('invoice_settings') || [];

    // Validate only rows where user is attempting to save prefix/suffix
    const candidateRows = invoiceList.filter(
      (row: any) =>
        (row.prefix !== undefined && String(row.prefix).length > 0) ||
        (row.invoice_prefix !== undefined &&
          String(row.invoice_prefix).length > 0) ||
        (row.suffix !== undefined && String(row.suffix).length > 0) ||
        (row.invoice_suffix !== undefined &&
          String(row.invoice_suffix).length > 0)
    );

    // No edited rows -> let the save flow decide (it already checks items length)
    if (!candidateRows.length) return true;

    const missingRowIndex = candidateRows.findIndex((item: any) => {
      const hasSequence = !!(
        item.sequence ||
        item.sequence_name ||
        item.invoice_sequence_name_id
      );
      const hasPrefix = !!(item.prefix || item.invoice_prefix);
      const hasSuffix = !!(item.suffix || item.invoice_suffix);

      return !hasSequence || (!hasPrefix && !hasSuffix);
    });

    if (missingRowIndex !== -1) {
      toast.error('Please enter at least one Prefix/Suffix');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    // If on step 2 during create flow, save invoice settings in bulk
    if (activeTab === 2) {
      const branchIdForInvoice = type === 'edit' ? paramRowId : createdId;
      if (!branchIdForInvoice) {
        toast.error('Missing branch reference to save invoice settings.');
        return;
      }
      const rows = edit.getValue('invoice_settings') || [];
      // Require at least one non-empty prefix or suffix across all rows
      const hasAnyPrefixSuffix = rows.some(
        (r: any) =>
          (r.prefix !== undefined && String(r.prefix || '').length > 0) ||
          (r.invoice_prefix !== undefined &&
            String(r.invoice_prefix || '').length > 0) ||
          (r.suffix !== undefined && String(r.suffix || '').length > 0) ||
          (r.invoice_suffix !== undefined &&
            String(r.invoice_suffix || '').length > 0)
      );
      if (!hasAnyPrefixSuffix) {
        toast.error('Please enter at least one Prefix/Suffix');
        return;
      }
      const items = rows
        .filter(
          (r: any) =>
            // consider id/sequence references and UI-edited fields
            r.invoice_sequence_name_id ||
            r.sequence ||
            r.sequence_name ||
            r.prefix ||
            r.invoice_prefix ||
            r.suffix ||
            r.invoice_suffix
        )
        .map((r: any) => {
          const obj: any = {
            // existing rows may have id from server
            ...(r.id ? { id: r.id } : {}),
            branch_id: branchIdForInvoice,
            // Use only ID field for API
            invoice_sequence_name_id: r.invoice_sequence_name_id,
          };
          if (r.invoice_prefix !== undefined || r.prefix !== undefined)
            obj.invoice_prefix = r.invoice_prefix ?? r.prefix;
          if (r.invoice_suffix !== undefined || r.suffix !== undefined)
            obj.invoice_suffix = r.invoice_suffix ?? r.suffix;
          if (r.invoice_start_no !== undefined)
            obj.invoice_start_no = r.invoice_start_no;
          if (r.status_id !== undefined) obj.status_id = r.status_id;
          return obj;
        });
      if (!items.length) {
        toast.error('Please enter at least one Prefix/Suffix');
        return;
      }
      // Final validation before calling API
      const isValidInvoiceSettings = validateInvoiceSettings();
      if (!isValidInvoiceSettings) {
        setIsError(true);
        return;
      }
      try {
        await API_SERVICES.InvoiceService.updateBulk({
          data: { invoiceSettings: items },
        });
        toast.success('Invoice settings updated');
        navigateTo('/admin/master/branch');
      } catch (e: any) {
        toast.error(e?.message || 'Failed to save invoice settings');
      }
      return;
    } else {
      // Additional validation: Check branch status during creation
      if (isCreateMode) {
        const statusValue = edit.getValue('status');
        const status = statusValue?.value ?? statusValue ?? '';
        if (status && status !== 'Active' && status !== 'active') {
          setIsError(true);
          return;
        }
      }

      const isValidMyprofile = validateMyProfile();
      const isValidBankDetails = validateBankDetails();
      const isValidKycDetails = validateKycFields();
      const isValidLoginDetails = validateLoginDetails();
      if (!isValidLoginDetails) {
        setIsError(true);
        toast.error('Please fill login details correctly');
        return;
      }
      if (!isValidMyprofile) {
        setIsError(true);
        toast.error('Please fill basic details correctly');
        return;
      }
      if (!isValidBankDetails) {
        setIsError(true);
        toast.error('Please fill bank details correctly');
        return;
      }
      if (!isValidKycDetails) {
        setIsError(true);
        toast.error('Please fill KYC details correctly');
        return;
      }
      const branchPayload = {
        branch_no: edit.getValue('branch_no') || '',
        branch_name: edit.getValue('branch_name') || '',
        contact_person: edit.getValue('contact_person') || '',
        mobile: edit.getValue('mobile_no') || '',
        email: edit.getValue('email_id') || '',
        address: edit.getValue('address') || '',
        state_id:
          edit.getValue('state_id')?.value ?? edit.getValue('state_id') ?? null,
        district_id:
          edit.getValue('district')?.value ?? edit.getValue('district') ?? null,
        pin_code: edit.getValue('pin_code') || '',
        gst_no: edit.getValue('gst_no') || '',
        signature_url: edit.getValue('signature') || '',
        status: edit.getValue('status')?.label ?? edit.getValue('status') ?? '',
        bank_account: {
          account_holder_name:
            edit.getValue('bank_details.account_holder_name') || '',
          bank_name: edit.getValue('bank_details.bank_name') || '',
          ifsc_code: edit.getValue('bank_details.ifsc_code') || '',
          account_number: edit.getValue('bank_details.account_no') || '',
          bank_branch_name: edit.getValue('bank_details.branch_name') || '',
        },
        // kyc_documents: (edit.getValue('kyc_details') || [])
        // .filter((row: any) => row.docName || row.docNo || row.document_url)
        // .map((row: any) => ({
        //   doc_type: row.docName,
        //   doc_number: row.docNo,
        //   file_url: row.document_url,
        // })),
        // KYC documents are handled separately after branch creation/update
        kyc_documents: [],
        login: {
          email: edit.getValue('login_details.user_name') || '',
          password_hash: edit.getValue('login_details.password') || '',
          role_id: 1,
        },
      };
      const response: any =
        type === 'edit' && paramRowId
          ? await API_SERVICES.BranchService.updateBranch(paramRowId, {
              data: branchPayload,
            })
          : await API_SERVICES.BranchService.create({
              data: branchPayload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        const isEdit = type === 'edit';
        toast.success(
          isEdit ? 'Branch Updated Successfully' : 'Branch Created Successfully'
        );

        // Get branch ID for both create and edit modes
        const branchId =
          isEdit && paramRowId
            ? paramRowId
            : response?.data?.data?.branch?.id ??
              response?.data?.data?.id ??
              response?.data?.data?.branch_id;

        // Handle KYC documents separately
        try {
          if (branchId) {
            const kycList = (edit.getValue('kyc_details') || []).filter(
              (row: any) => row.docName && row.docNo && row.document_url
            );

            if (kycList.length > 0) {
              // Separate existing (with ID) and new (without ID) KYC documents
              const existingKyc = kycList.filter((row: any) => row.id);
              const newKyc = kycList.filter((row: any) => !row.id);

              // Update existing KYC documents
              if (existingKyc.length > 0) {
                const updatePayload = existingKyc.map((row: any) => ({
                  id: row.id,
                  doc_type: row.docName,
                  doc_number: row.docNo,
                  file_url: row.document_url,
                  entity_type: 'branch',
                  entity_id: branchId,
                }));

                await API_SERVICES.KycService.updateKyc({
                  data: updatePayload,
                  // successMessage: 'KYC documents updated successfully',
                  // failureMessage: 'Failed to update KYC documents',
                });
              }

              // Create new KYC documents
              if (newKyc.length > 0) {
                const createPayload = newKyc.map((row: any) => ({
                  doc_type: row.docName,
                  doc_number: row.docNo,
                  file_url: row.document_url,
                  entity_type: 'branch',
                  entity_id: branchId,
                }));

                await API_SERVICES.KycService.create({
                  data: createPayload,
                  // successMessage: 'KYC documents created successfully',
                  // failureMessage: 'Failed to create KYC documents',
                });
              }

              // Refresh KYC data after update/create to ensure view shows latest data
              if (isEdit && branchId) {
                try {
                  const kycResponse: any = await API_SERVICES.KycService.getAll(
                    {
                      entity_id: branchId,
                      entity_type: 'branch',
                    }
                  );
                  if (
                    kycResponse?.data?.statusCode === HTTP_STATUSES.OK ||
                    kycResponse?.status < HTTP_STATUSES.BAD_REQUEST
                  ) {
                    const kycList = kycResponse?.data?.data?.kycDocuments || [];
                    const updatedKyc = kycList.map((kyc: any) => ({
                      id: kyc.id,
                      docName: kyc.doc_type || '',
                      docNo: kyc.doc_number || '',
                      file: kyc.file_url
                        ? { name: String(kyc.file_url).split('/').pop() }
                        : null,
                      document_url: kyc.file_url || '',
                    }));
                    edit.update({ kyc_details: updatedKyc });
                  }
                } catch (refreshError) {
                  console.error('Error refreshing KYC data:', refreshError);
                }
              }
            }
          }
        } catch (kycError: any) {
          console.error('KYC update error:', kycError);
          // Don't block the flow if KYC update fails
        }

        // Store created id for subsequent invoice save on Step 2 (create mode only)
        if (!isEdit) {
          setCreatedId(branchId || null);
        }

        // Fetch invoice sequences for this branch and prefill form
        try {
          if (branchId) {
            const invoiceResponse: any =
              await API_SERVICES.InvoiceService.getAll({
                branch_id: branchId,
              });
            if (invoiceResponse?.data?.statusCode === HTTP_STATUSES.OK) {
              const list = invoiceResponse?.data?.data?.invoiceSettings || [];
              // Map to fields used by InvoiceSetting.tsx
              const mapped = list.map((itm: any) => ({
                id: itm.id ?? Date.now() + Math.random(),
                // Keep ID for saving
                invoice_sequence_name_id: itm.invoice_sequence_name_id ?? null,
                // UI fields used by InvoiceSetting component
                sequence: itm.invoice_setting_enum ?? itm.sequence_name ?? '',
                prefix: itm.invoice_prefix ?? '',
                suffix: itm.invoice_suffix ?? '',
                // Additional API-friendly fields
                invoice_start_no: itm.invoice_start_no ?? 0,
                status_id: itm.status_id ?? 1,
              }));
              edit.update({ invoice_settings: mapped });
            } else {
              edit.update({ invoice_settings: [] });
            }
          }
        } catch (e) {
          edit.update({ invoice_settings: [] });
        }
        // Move to step 2 (Invoice Settings)
        setActiveTab(2);
      }
    }
  };

  const handleCancel = () => {
    navigateTo('/admin/master/branch');
  };

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  const getTitle = () => {
    if (heading) {
      return heading;
    } else {
      switch (type) {
        case 'create':
          return 'CREATE BRANCH';
        case 'edit':
          return 'EDIT BRANCH';
        case 'view':
          return 'VIEW BRANCH';
        default:
          return 'BRANCH DETAILS';
      }
    }
  };

  const onBrowseClick = async (event: any) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    let previewURL = '';
    previewURL = URL.createObjectURL(file);

    edit.update({ signature: previewURL, signature_file: file });

    try {
      const formData = new FormData();
      formData.append('files', file);

      const uploadImageRes =
        await API_SERVICES.ImageUploadService.uploadImage(formData);

      const res: any = uploadImageRes;

      if (
        res?.status < HTTP_STATUSES.BAD_REQUEST &&
        res?.data?.data?.images?.length
      ) {
        const document_url = res.data.data.images[0].Location;
        edit.update({ signature: document_url, signature_file: file });
      } else {
        toast.error('Failed to upload signature');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed. Please try again.');
    }
  };

  const handleDeleteImage = () => {
    edit.update({ signature: '', signature_file: null });
  };

  const handleDownloadSignature = (url?: string | null) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        API_SERVICES.BranchService.getAllById(paramRowId),
        API_SERVICES.BankService.getAll({
          entity_id: paramRowId,
          entity_type: 'branch',
        }),
        API_SERVICES.KycService.getAll({
          entity_id: paramRowId,
          entity_type: 'branch',
        }),
        API_SERVICES.LoginService.getAll({
          entity_id: paramRowId,
          entity_type: 'branch',
        }),
        API_SERVICES.InvoiceService.getAll({
          branch_id: paramRowId,
        }),
      ]);
      if (response[0]?.data.statusCode === HTTP_STATUSES.OK) {
        setRowData(response[0].data.data.branch);
      }
      const updates: any = {};

      if (response[1].data.statusCode === HTTP_STATUSES.OK) {
        const bankResponse = response[1].data.data.bankAccounts || [];
        if (bankResponse.length) {
          updates.bank_details = {
            branch_name: bankResponse[0]?.bank_branch_name || '',
            account_holder_name: bankResponse[0]?.account_holder_name || '',
            bank_name: bankResponse[0]?.bank_name || '',
            account_no: bankResponse[0]?.account_number || '',
            ifsc_code: bankResponse[0]?.ifsc_code || '',
          };
          updates.bank_account_id = bankResponse[0]?.id;
        } else {
          updates.bank_details = {
            branch_name: '',
            account_holder_name: '',
            bank_name: '',
            account_no: '',
            ifsc_code: '',
          };
          updates.bank_account_id = undefined;
        }
      }

      if (response[2]?.data?.statusCode === HTTP_STATUSES.OK) {
        const kycList = response[2]?.data?.data?.kycDocuments || [];
        updates.kyc_details = kycList.map((kyc: any) => ({
          id: kyc.id, // preserve server id for updates
          docName: kyc.doc_type || '',
          docNo: kyc.doc_number || '',
          file: kyc.file_url
            ? { name: String(kyc.file_url).split('/').pop() }
            : null,
          document_url: kyc.file_url || '',
        }));
      }

      if (response[3]?.data?.statusCode === HTTP_STATUSES.OK) {
        const logInDetails = response[3]?.data?.data?.users || [];
        const formattedLoginData = logInDetails.filter(
          (item: any) => item.entity_type === 'branch'
        );
        if (formattedLoginData.length) {
          updates.login_details = {
            user_name: formattedLoginData[0]?.email || '',
            password: formattedLoginData[0]?.password_hash || '',
          };
          updates.login_user_id = formattedLoginData[0]?.id;
        }
      }
      if (response[4]?.data?.statusCode === HTTP_STATUSES.OK) {
        const invoiceList = response[4]?.data?.data?.invoiceSettings || [];
        updates.invoice_settings = invoiceList.map((itm: any) => ({
          id: itm.id,
          invoice_sequence_name_id:
            itm.invoice_sequence_name_id ?? itm.sequence_name ?? '',
          // UI fields expected by InvoiceSetting.tsx
          sequence: itm.invoice_setting_enum ?? itm.sequence_name ?? '',
          prefix: itm.invoice_prefix ?? '',
          suffix: itm.invoice_suffix ?? '',
          // API-friendly fields
          invoice_start_no: itm.invoice_start_no ?? 0,
          status_id: itm.status_id ?? 1,
        }));
      }
      if (Object.keys(updates).length) {
        edit.update(updates);
      }
    } catch (err: any) {
      toast.error(err?.message);
      console.log(err, 'err');
    }
  };

  useEffect(() => {
    if (type !== 'create' && paramRowId) {
      fetchData();
    }
  }, [type, paramRowId]);

  // Auto-generate Branch No for create mode only
  useEffect(() => {
    const shouldAutoGen = type === 'create';
    if (!shouldAutoGen) return;
    const current = edit.getValue('branch_no');
    if (current) return; // don't override if user already typed
    (async () => {
      try {
        const res: any = await API_SERVICES.BranchService.autoBranchNoGenerator(
          {
            company_code: 'CJ',
            location_code: 'SLM',
          }
        );
        console.log(res, 'response');
        const code = res?.data?.data?.branch_code;
        if (code && !edit.getValue('branch_no')) {
          edit.update({ branch_no: code });
        }
      } catch (e) {
        // silent fail: do not block create flow
      }
    })();
  }, [type]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await DropDownServiceAll.getAllStates();
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res?.data?.data?.states)
        ) {
          setStateOptions(
            res.data.data.states.map((state: any) => ({
              label: state.state_name,
              value: state.id,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching states:', err);
        setStateOptions([]);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const stateId =
      edit.getValue('state_id')?.value ?? edit.getValue('state_id');

    if (!stateId) {
      setDistrictOptions([]);
      edit.update({ district: null, district_id: null });
      return;
    }

    const fetchDistricts = async () => {
      try {
        const res = await DropDownServiceAll.getAllDistricts({
          state_id: stateId,
        });

        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res?.data?.data?.districts)
        ) {
          const options = res.data.data.districts.map((district: any) => ({
            label: district.district_name,
            value: district.id,
          }));
          setDistrictOptions(options);
        } else {
          setDistrictOptions([]);
        }
      } catch (err) {
        setDistrictOptions([]);
      }
    };

    fetchDistricts();
  }, [edit.getValue('state_id')]);

  return (
    <Grid container flexDirection={'column'}>
      <PageHeader
        title={getTitle()}
        navigateUrl="/admin/master/branch"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
      />
      <BranchStepper
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        type={type}
        invoiceStepEnabled={type !== 'create' || activeTab === 2 || !!createdId}
      />
      {activeTab === 1 ? (
        <Grid container flexDirection={'column'}>
          <FormSectionHeader title="BASIC DETAILS" />
          <Grid container flexDirection="column" gap={1.7}>
            <Grid container sx={formLayoutWithHeaderStyle}>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  inputLabel="Branch No"
                  value={edit.getValue('branch_no')}
                  disabled={true}
                  onChange={(e: any) =>
                    edit.update({ branch_no: e.target.value })
                  }
                  isError={hasError(fieldErrors.branch_no)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput
                  inputLabel="Branch Name"
                  value={edit.getValue('branch_name')}
                  disabled={isReadOnly}
                  onChange={(e: any) => {
                    const next = String(e.target.value || '').replace(
                      /^\s+/,
                      ''
                    );
                    e.target.value = next;
                    handleValidatedChange(e, edit, 'branch_name', 'string');
                  }}
                  isError={hasError(fieldErrors.branch_name)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  inputLabel="Contact Person"
                  value={edit.getValue('contact_person')}
                  disabled={isReadOnly}
                  onChange={(e: any) => {
                    const next = String(e.target.value || '').replace(
                      /^\s+/,
                      ''
                    );
                    e.target.value = next;
                    handleValidatedChange(e, edit, 'contact_person', 'string');
                  }}
                  isError={hasError(fieldErrors.contact_person)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput
                  inputLabel="Mobile Number"
                  value={edit.getValue('mobile_no')}
                  disabled={isReadOnly}
                  onChange={(e: any) => {
                    const next = String(e.target.value || '').replace(
                      /^\s+/,
                      ''
                    );
                    e.target.value = next;
                    handleValidatedChange(e, edit, 'mobile_no', 'number');
                  }}
                  isError={hasError(fieldErrors.mobile_no)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  inputLabel="Email ID"
                  value={edit.getValue('email_id')}
                  disabled={isReadOnly}
                  onChange={(e: any) =>
                    handleValidatedChange(e, edit, 'email_id', 'email')
                  }
                  isError={hasError(fieldErrors.email_id)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput
                  inputLabel="Address"
                  value={edit.getValue('address')}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    const next = String(e.target.value || '').replace(
                      /^\s+/,
                      ''
                    );
                    edit.update({ address: next });
                  }}
                  isError={hasError(fieldErrors.address)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.leftItem}>
                <AutoSearchSelectWithLabel
                  required
                  label="State"
                  options={stateOptions}
                  isReadOnly={isReadOnly}
                  value={stateOptions.find(
                    (option) =>
                      option.value === edit.getValue('state_id')?.value
                  )}
                  onChange={(e, value) => {
                    edit.update({
                      state_id: value,
                      district: null,
                      district_id: null,
                    });
                  }}
                  isError={hasError(fieldErrors.state_id)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ ...styles.rightItem }}>
                <AutoSearchSelectWithLabel
                  required
                  label="District"
                  options={districtOptions}
                  isReadOnly={isReadOnly}
                  value={edit.getValue('district')}
                  onChange={(e, value) => {
                    edit.update({
                      district: value,
                      district_id: value?.value ?? null,
                    });
                  }}
                  isError={hasError(fieldErrors.district)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  inputLabel="Pin Code"
                  value={edit.getValue('pin_code')}
                  disabled={isReadOnly}
                  onChange={(e: any) =>
                    handleValidatedChange(e, edit, 'pin_code', 'pincode')
                  }
                  isError={hasError(fieldErrors.pin_code)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput
                  inputLabel="GST No"
                  value={edit.getValue('gst_no')}
                  disabled={isReadOnly}
                  onChange={(e: any) =>
                    handleValidatedChange(e, edit, 'gst_no', 'alphanumeric')
                  }
                  isError={hasError(fieldErrors.gst_no)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ ...styles.leftItem }}>
                <AutoSearchSelectWithLabel
                  required
                  label="Status"
                  options={availableStatusOptions}
                  isReadOnly={isReadOnly}
                  value={edit.getValue('status')}
                  onChange={(e, value) => edit.update({ status: value })}
                  isError={hasError(fieldErrors.status)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
                {isReadOnly ? (
                  edit.getValue('signature') || rowData.signature_url ? (
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      sx={{ width: '100%' }}
                    >
                      <Grid size={5}>
                        <Typography
                          variant="inherit"
                          sx={{
                            color: theme.Colors.blackPrimary,
                            fontSize: theme.MetricsSizes.small_xx,
                            fontWeight: theme.fontWeight.medium,
                          }}
                        >
                          Signature
                        </Typography>
                      </Grid>
                      <Grid size={'grow'}>
                        <ButtonComponent
                          buttonText="Download"
                          btnWidth="100%"
                          btnHeight={40}
                          startIcon={<Download />}
                          btnBorderRadius={2}
                          onClick={() =>
                            handleDownloadSignature(edit.getValue('signature'))
                          }
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <BrowserImageUpload
                      labelName="Signature"
                      selectedFile={null}
                      disabled
                      onBrowserButtonClick={() => {}}
                    />
                  )
                ) : (
                  <DragDropUpload
                    labelText="Signature"
                    fileName={edit.getValue('signature_file')?.name}
                    image_url={edit.getValue('signature')}
                    onBrowseButtonClick={(e) => onBrowseClick(e)}
                    handleDeleteImage={() => handleDeleteImage()}
                  />
                )}
              </Grid>
            </Grid>
            <TabFormDetails
              type={type}
              edit={edit}
              isError={isError}
              bankDetailsFieldErrors={bankDetailsFiledErrors}
              loginDetailsFieldErrors={loginDetailsFieldErrors}
            />
          </Grid>
        </Grid>
      ) : (
        <InvoiceSetting edit={edit} type={type} />
      )}
      <FormAction
        handleCreate={handleCreate}
        handleCancel={handleCancel}
        disableCreate={type === 'view'}
        firstBtntxt={
          type === 'edit' ? 'Update' : type === 'create' ? 'Save' : 'Edit'
        }
        secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
      />
    </Grid>
  );
};

export default BranchForm;
