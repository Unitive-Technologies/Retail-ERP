import PageHeader from '@components/PageHeader';
import Grid from '@mui/system/Grid';
import { useTheme } from '@mui/material';
import FormAction from '@components/ProjectCommon/FormAction';
import MUHTypography from '@components/MUHTypography';
import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import { useEdit } from '@hooks/useEdit';
import { UploadPlusIcon } from '@assets/Images';
import { useEffect, useState, useRef } from 'react';
import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import {
  handleValidatedChange,
  isValidGSTIN,
  isValidPAN,
  isValidPinCode,
  isValidIFSC,
} from '@utils/form-util';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import TabFormDetails from './TabFormDetails';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import { balanceType, paymentTerms } from '@constants/DummyData';
import { useNavigate } from 'react-router-dom';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const CreateVendor = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [rowData, setRowData] = useState<any>({});
  const [isError, setIsError] = useState(false);
  const [materialType, setMaterialType] = useState<any>([]);
  const [visibilityOptions, setVisibilityOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);
  const hasInitializedLocation = useRef(false);

  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const rowId = Number(params.get('rowId'));
  const stateOption =
    stateOptions.find(
      (state: any) => Number(state.value) === Number(rowData.state_id)
    ) || null;
  const countryOption =
    countryOptions.find(
      (country: any) => Number(country.value) === Number(rowData.country_id)
    ) || null;
  const districtOption =
    districtOptions.find(
      (itm: any) => Number(itm.value) === Number(rowData.district_id)
    ) || null;
  const balanceTypeOption =
    balanceType.find(
      (b: any) =>
        b.label === rowData.opening_balance_type ||
        b.value === rowData.balance_type
    ) || null;
  const paymentTermsOption =
    paymentTerms.find(
      (p: any) =>
        p.label === rowData.payment_terms || p.value === rowData.payment_terms
    ) || null;

  const filterMaterialType = (rowData?.material_type_ids || [])
    .map((itm: any) => {
      const matched = materialType.find((type: any) => type.value === itm);
      return matched ? matched.value : null;
    })
    .filter(Boolean);

  const visibilityFilter = (rowData.visibilities || []).map((itm: any) => {
    const matchedVisibility = visibilityOptions.find(
      (item: any) => item.value === itm
    );
    return matchedVisibility ? matchedVisibility.value : null;
  });

  const UserInitialValues: any = {
    vendor_no: rowData.vendor_code || '',
    image: rowData.vendor_image_url || '',
    vendor_name: rowData.vendor_name || '',
    proprietor_name: rowData.proprietor_name || '',
    mobile_no: rowData.mobile || '',
    email: rowData.email || '',
    gst_no: rowData.gst_no || '',
    pan_no: rowData.pan_no || '',
    address: rowData.address || '',
    country: countryOption || '',
    state: stateOption || '',
    district: districtOption || '',
    pin_code: rowData.pin_code || '',
    open_balance: rowData.opening_balance || '',
    payment_terms: paymentTermsOption || '',
    balance_type: balanceTypeOption || '',
    material_type: filterMaterialType,
    visibility: visibilityFilter,
  };
  const edit = useEdit(UserInitialValues);
  const materialTypeValue = edit.getValue('material_type');
  const materialTypeArray = Array.isArray(materialTypeValue)
    ? materialTypeValue.filter((v: any) => {
        const val = v && typeof v === 'object' ? v.value : v;
        return val != null && val !== '';
      })
    : [];

  const mobileNoRaw = String(edit.getValue('mobile_no') || '');
  const isMobileNoInvalid =
    mobileNoRaw.length > 0 && mobileNoRaw.replace(/\D/g, '').length < 10;

  const fieldError = {
    vendor_no: !edit.allFilled('vendor_no'),
    image: false,
    vendor_name: !edit.allFilled('vendor_name'),
    proprietor_name: !edit.allFilled('proprietor_name'),
    mobile_no: !edit.allFilled('mobile_no') || isMobileNoInvalid,
    email: !edit.allFilled('email'),
    gst_no:
      !edit.allFilled('gst_no') ||
      (!!edit.getValue('gst_no') && !isValidGSTIN(edit.getValue('gst_no'))),
    pan_no:
      !edit.allFilled('pan_no') ||
      (!!edit.getValue('pan_no') && !isValidPAN(edit.getValue('pan_no'))),
    address: !edit.allFilled('address'),
    country: !edit.getValue('country')?.value && !edit.getValue('country_id'),
    state: !edit.getValue('state')?.value && !edit.getValue('state_id'),
    district:
      !edit.getValue('district')?.value && !edit.getValue('district_id'),
    pin_code:
      !edit.allFilled('pin_code') ||
      (!!edit.getValue('pin_code') &&
        !isValidPinCode(edit.getValue('pin_code'))),
    open_balance: !edit.allFilled('open_balance'),
    payment_terms: !edit.getValue('payment_terms'),
    balance_type: !edit.getValue('balance_type'),
    material_type: materialTypeArray.length === 0,
  };
  const hasError = (specificError: boolean) => isError && specificError;

  const accountNoRaw = String(edit.getValue('bank_details.account_no') || '');
  const isAccountNoInvalid = accountNoRaw.length > 0 && accountNoRaw.length < 9;

  const bankDetailsFiledErrors = {
    branch_name: !edit.allFilled('bank_details.branch_name'),
    account_holder_name: !edit.allFilled('bank_details.account_holder_name'),
    bank_name: !edit.allFilled('bank_details.bank_name'),
    account_no:
      !edit.allFilled('bank_details.account_no') || isAccountNoInvalid,
    ifsc_code:
      !edit.allFilled('bank_details.ifsc_code') ||
      (!!edit.getValue('bank_details.ifsc_code') &&
        !isValidIFSC(edit.getValue('bank_details.ifsc_code'))),
  };

  const loginDetailsFieldErrors = {
    user_name: !edit.allFilled('login_details.user_name'),
    password:
      !edit.allFilled('login_details.password') ||
      (edit.getValue('login_details.password')?.length ?? 0) < 8,
  };

  const validateBankDetails = () => {
    return !Object.values(bankDetailsFiledErrors).some((error) => error);
  };
  const validateVendorDetails = () => {
    return !Object.values(fieldError).some((error) => error);
  };

  const validateSpocFields = () => {
    const spocList = edit.getValue('spoc_details') || [];

    // Filter out completely empty rows
    const filledRows = spocList.filter(
      (row: any) => row && (row.contact_name || row.mobile || row.designation)
    );

    // If no SPOC rows, validation passes (SPOC is optional)
    if (filledRows.length === 0) {
      return true;
    }

    // Validate each filled row
    for (let i = 0; i < filledRows.length; i++) {
      const row = filledRows[i];

      // Check if mobile number is exactly 10 digits
      const mobileDigits = String(row?.mobile || '').replace(/\D/g, '');
      if (mobileDigits.length !== 10) {
        toast.error('SPOC Mobile number must be exactly 10 digits');
        return false;
      }

      // Check if all required fields are filled
      if (!row.contact_name || !row.mobile || !row.designation) {
        toast.error(
          `SPOC row ${i + 1}: Please fill all fields (Name, Mobile Number, Designation)`
        );
        return false;
      }
    }

    return true;
  };

  const validateKycFields = () => {
    return true;
  };
  const validateLoginDetails = () => {
    return !Object.values(loginDetailsFieldErrors).some((error) => error);
  };
  const handleCreate = async () => {
    const isValidBankDetails = validateBankDetails();
    const isValidKycDetails = validateKycFields();
    const isValidSpocDetails = validateSpocFields();
    const isVendorProfile = validateVendorDetails();
    const isValidLoginDetails = validateLoginDetails();

    if (
      !isValidBankDetails ||
      !isValidKycDetails ||
      !isValidSpocDetails ||
      !isVendorProfile ||
      !isValidLoginDetails
    ) {
      setIsError(true);
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      // Build payload for vendor creation
      const countryIdRaw = edit.getValue('country')?.value;
      const stateIdRaw = edit.getValue('state')?.value;
      const districtIdRaw = edit.getValue('district')?.value;

      const materialTypeRaw = edit.getValue('material_type');
      const materialTypeArr: number[] = Array.isArray(materialTypeRaw)
        ? materialTypeRaw
            .map((v: any) => Number(v && typeof v === 'object' ? v.value : v))
            .filter((v) => !isNaN(v))
        : [];

      if (!materialTypeArr || materialTypeArr.length === 0) {
        setIsError(true);
        toast.error('Please select at least one material type');
        return;
      }
      const visibilityRaw = edit.getValue('visibility');
      const selectedVisibility: { id: number; name: string }[] = (
        Array.isArray(visibilityRaw) ? visibilityRaw : []
      )
        .map((v: any) => {
          const value = typeof v === 'object' ? v?.value : v;
          const opt = visibilityOptions.find(
            (o: any) => Number(o.value) === Number(value)
          );
          return opt
            ? { id: Number(opt.value), name: String(opt.label) }
            : null;
        })
        .filter(Boolean) as { id: number; name: string }[];

      const visibilityIds = selectedVisibility.map((v) => v.id);

      // Check if all bank account fields are empty
      const accountHolderName =
        edit.getValue('bank_details.account_holder_name') || '';
      const bankName = edit.getValue('bank_details.bank_name') || '';
      const ifscCode = edit.getValue('bank_details.ifsc_code') || '';
      const accountNumber = edit.getValue('bank_details.account_no') || '';
      const bankBranchName = edit.getValue('bank_details.branch_name') || '';

      const isBankAccountEmpty =
        !accountHolderName &&
        !bankName &&
        !ifscCode &&
        !accountNumber &&
        !bankBranchName;

      const payload = {
        vendor_code: edit.getValue('vendor_no') || '',
        vendor_name: edit.getValue('vendor_name') || '',
        proprietor_name: edit.getValue('proprietor_name') || '',
        mobile: edit.getValue('mobile_no') || '',
        vendor_image_url: edit.getValue('image') || '',
        email: edit.getValue('email') || 'admin@gmail.com',
        country_id: countryIdRaw,
        state_id: stateIdRaw,
        district_id: districtIdRaw,
        address: edit.getValue('address') || '',
        pin_code: edit.getValue('pin_code') || '',
        gst_no: edit.getValue('gst_no') || '',
        pan_no: edit.getValue('pan_no') || '',
        opening_balance: Number(edit.getValue('open_balance')) || 0,
        payment_terms:
          edit.getValue('payment_terms')?.label ||
          edit.getValue('payment_terms')?.value ||
          '10days',
        opening_balance_type:
          edit.getValue('balance_type')?.label ||
          edit.getValue('balance_type')?.value ||
          'Credit',
        material_type_ids: materialTypeArr,
        visibilities: visibilityIds,
        bank_account: isBankAccountEmpty
          ? {}
          : {
              account_holder_name: accountHolderName,
              bank_name: bankName,
              ifsc_code: ifscCode,
              account_number: accountNumber,
              bank_branch_name: bankBranchName,
            },
        kyc_documents: [],
        login: {
          email: edit.getValue('login_details.user_name') || '',
          password_hash: edit.getValue('login_details.password') || '',
          role_id: 2,
        },
        spoc_details: [],
      };

      const vendorCreate: any =
        type === 'edit'
          ? await API_SERVICES.VendorService.updateVendor(rowId, {
              data: payload,
            })
          : await API_SERVICES.VendorService.create({
              data: payload,
            });

      if (
        vendorCreate?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        vendorCreate?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        const isEdit = type === 'edit';
        toast.success(
          isEdit ? 'Vendor Updated Successfully' : 'Vendor Created Successfully'
        );

        // Get vendor ID for both create and edit modes
        const vendorId =
          isEdit && rowId
            ? rowId
            : vendorCreate?.data?.data?.vendor?.id ??
              vendorCreate?.data?.data?.id ??
              vendorCreate?.data?.data?.vendor_id;

        // Save or update KYC documents
        const kycList = edit.getValue('kyc_details') || [];
        const newKyc = kycList.filter((kyc: any) => !kyc.id); // New KYC records
        const existingKyc = kycList.filter((kyc: any) => kyc.id); // Existing KYC records

        if (newKyc.length > 0) {
          const kycPayload = newKyc.map((kyc: any) => ({
            doc_type: kyc.docName,
            doc_number: kyc.docNo,
            file_url: kyc.document_url,
            entity_type: 'vendor',
            entity_id: vendorId,
          }));

          try {
            await API_SERVICES.KycService.create({
              data: kycPayload,
            });
          } catch (kycError: any) {
            console.error('Error saving new KYC details:', kycError);
            toast.error('Failed to save new KYC details. Please try again.');
          }
        }

        if (existingKyc.length > 0) {
          const kycUpdatePayload = {
            entity_type: 'vendor',
            entity_id: vendorId,
            documents: existingKyc.map((kyc: any) => ({
              id: kyc.id,
              doc_type: kyc.docName,
              doc_number: kyc.docNo,
              file_url: kyc.document_url,
            })),
          };

          try {
            await API_SERVICES.KycService.updateKyc({
              data: kycUpdatePayload,
              // Remove successMessage to suppress the toast
            });
          } catch (kycError: any) {
            console.error('Error updating existing KYC details:', kycError);
            toast.error(
              'Failed to update existing KYC details. Please try again.'
            );
          }
        }
        // Save or update SPOC details
        const spocRows = (edit.getValue('spoc_details') || []).filter(
          (row: any) =>
            row && (row.contact_name || row.mobile || row.designation)
        );

        if (spocRows.length > 0) {
          const existingSpoc = spocRows.filter((row: any) => row.id);
          const newSpoc = spocRows.filter((row: any) => !row.id);

          try {
            // Update existing SPOC contacts
            if (existingSpoc.length > 0) {
              const payload = existingSpoc.map((row: any) => ({
                id: row.id,
                vendor_id: vendorId,
                contact_name: row.contact_name,
                designation: row.designation,
                mobile: row.mobile,
              }));

              await API_SERVICES.SPOCService.updateSpoc({
                data: payload,
                successMessage: undefined,
                // Let local catch/toast handle any failure
                failureMessage: undefined,
              });
            }

            // Create new SPOC contacts
            if (newSpoc.length > 0) {
              const payload = newSpoc.map((row: any) => ({
                vendor_id: vendorId,
                contact_name: row.contact_name,
                designation: row.designation,
                mobile: row.mobile,
              }));

              await API_SERVICES.SPOCService.create({
                data: payload,
                successMessage: undefined,
                // Let local catch/toast handle any failure
                failureMessage: undefined,
              });
            }
          } catch (spocError: any) {
            console.error('Error saving SPOC details:', spocError);
            toast.error('Failed to save SPOC details. Please try again.');
          }
        }

        // Fetch updated data to ensure KYC & SPOC details are displayed
        if (!isEdit) {
          await fetchData();
        }
        navigateTo('/admin/master/vendorList');
      }
    } catch (error: any) {
      console.error('Error during vendor creation:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        'An error occurred while creating the vendor';
      toast.error(errorMessage);

      if (
        errorMessage.toLowerCase().includes('material') ||
        errorMessage.toLowerCase().includes('material_type')
      ) {
        setIsError(true);
      }
    }
  };
  const uploadMaterialImageError = isError && !edit.allFilled('image');
  const onMaterialImageBrowse = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !file.type?.startsWith('image/')) {
        toast.error('Image upload failed');
        return;
      }
      const formData = new FormData();
      formData.append('files', file);

      const uploadImageRes =
        await API_SERVICES.ImageUploadService.uploadImage(formData);
      const res: any = uploadImageRes;

      if (
        res?.status < HTTP_STATUSES.BAD_REQUEST &&
        res?.data?.data?.images?.length
      ) {
        const imageUrl = res.data.data.images[0].Location;
        edit.update({ image: imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Image upload failed');
    }
  };

  const handleMaterialType = async () => {
    const materialTypeResponse: any =
      await API_SERVICES.MaterialTypeService.getAll();
    const list = materialTypeResponse?.data?.data?.materialTypes || [];
    const options = list.map((m: any) => ({
      value: m.id,
      label: m.material_type,
    }));
    setMaterialType(options);
  };

  const fetchData = async () => {
    try {
      const vendorResponse: any = await Promise.all([
        API_SERVICES.VendorService.getAllById(rowId),
        API_SERVICES.BankService.getAll({
          entity_id: rowId,
          entity_type: 'vendor',
        }),
        API_SERVICES.KycService.getAll({
          entity_id: rowId,
          entity_type: 'vendor',
        }),
        API_SERVICES.LoginService.getAll({
          entity_id: rowId,
          entity_type: 'vendor',
        }),
        API_SERVICES.SPOCService.getAll({ vendor_id: rowId }),
      ]);
      const updatedVendorData: any = {};
      if (vendorResponse[0]?.data?.statusCode === HTTP_STATUSES.OK) {
        const vendor = vendorResponse[0].data.data.vendor;
        setRowData(vendor);
      }
      if (vendorResponse[1]?.data?.statusCode === HTTP_STATUSES.OK) {
        const vendor = vendorResponse[1].data.data.bankAccounts;
        updatedVendorData.bank_details = {
          branch_name: vendor[0]?.bank_branch_name || '',
          account_holder_name: vendor[0]?.account_holder_name || '',
          bank_name: vendor[0]?.bank_name || '',
          account_no: vendor[0]?.account_number || '',
          ifsc_code: vendor[0]?.ifsc_code || '',
        };
        updatedVendorData.bank_account_id = vendor?.id;
      }
      if (vendorResponse[2]?.data?.statusCode === HTTP_STATUSES.OK) {
        const kycList = vendorResponse[2]?.data?.data?.kycDocuments || [];
        updatedVendorData.kyc_details = kycList.map((kyc: any) => ({
          id: kyc.id, // preserve server id for updates
          docName: kyc.doc_type || '',
          docNo: kyc.doc_number || '',
          file: kyc.file_url
            ? { name: String(kyc.file_url).split('/').pop() }
            : null,
          document_url: kyc.file_url || '',
        }));
      }
      if (vendorResponse[3]?.data?.statusCode === HTTP_STATUSES.OK) {
        const usersRaw =
          vendorResponse[3]?.data?.data?.users ??
          vendorResponse[3]?.data?.data?.user;
        const users = Array.isArray(usersRaw) ? usersRaw : [usersRaw];
        const formattedLoginData = users.filter(
          (item: any) => item?.entity_type === 'vendor'
        );
        if (formattedLoginData.length) {
          updatedVendorData.login_details = {
            user_name: formattedLoginData[0]?.email || '',
            password: formattedLoginData[0]?.password_hash || '',
          };
          updatedVendorData.login_user_id = formattedLoginData[0]?.id;
        }
      }
      if (vendorResponse[4]?.data?.statusCode === HTTP_STATUSES.OK) {
        const spocData = vendorResponse[4]?.data?.data;
        const spocRaw =
          spocData?.VendorSpocDetails ||
          spocData?.spoc_details ||
          spocData?.spocDetails ||
          spocData;

        let spocList: any[] = [];
        if (Array.isArray(spocRaw)) {
          spocList = spocRaw;
        } else if (spocRaw && typeof spocRaw === 'object') {
          spocList = [spocRaw];
        }
        if (spocList.length > 0) {
          updatedVendorData.spoc_details = spocList
            .filter((itm: any) => itm != null)
            .map((itm: any) => ({
              id: itm?.id, // preserve server id for delete/update
              contact_name: itm?.contact_name || '',
              mobile: itm?.mobile || '',
              designation: itm?.designation || '',
            }));
        }
      }

      if (
        !updatedVendorData.spoc_details &&
        vendorResponse[0]?.data?.statusCode === HTTP_STATUSES.OK
      ) {
        const vendorData = vendorResponse[0]?.data?.data;
        const mainSpocRaw =
          vendorData?.spoc_details || vendorData?.vendor?.spoc_details;

        if (mainSpocRaw) {
          let spocList: any[] = [];
          if (Array.isArray(mainSpocRaw)) {
            spocList = mainSpocRaw;
          } else if (mainSpocRaw && typeof mainSpocRaw === 'object') {
            spocList = [mainSpocRaw];
          }

          if (spocList.length > 0) {
            updatedVendorData.spoc_details = spocList
              .filter((itm: any) => itm != null)
              .map((itm: any) => ({
                id: itm?.id,
                contact_name: itm?.contact_name || '',
                mobile: itm?.mobile || '',
                designation: itm?.designation || '',
              }));
          }
        }
      }

      if (Object.keys(updatedVendorData).length) {
        edit.update(updatedVendorData);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch vendor data.');
      console.error('Error fetching vendor data:', err);
    }
  };

  const getAllBranch = async () => {
    const branchListResponse: any = await API_SERVICES.BranchService.getAll();
    if (branchListResponse?.data.statusCode === HTTP_STATUSES.OK) {
      const list = branchListResponse?.data?.data?.branches || [];
      // Filter only active branches for visibility dropdown
      const activeBranches = list.filter(
        (b: any) => b.status === 'Active'
      );
      const options = activeBranches.map((b: any) => ({
        value: b.id,
        label: b.branch_name,
      }));
      setVisibilityOptions(options);
    }
  };

  // Fetch country options on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res: any = await DropDownServiceAll.getAllCountry();
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res?.data?.data?.countries)
        ) {
          setCountryOptions(
            res.data.data.countries.map((country: any) => ({
              label: country.country_name,
              value: country.id,
            }))
          );
        }
      } catch (err) {
        setCountryOptions([]);
      }
    };
    fetchCountries();
    handleMaterialType();
    getAllBranch();
    if (type !== 'create' && rowId) {
      fetchData();
    }
  }, [type, rowId]);

  // Fetch state options when country changes
  useEffect(() => {
    const countryId =
      edit.getValue('country')?.value ?? edit.getValue('country_id') ?? null;
    if (!countryId) {
      setStateOptions([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await DropDownServiceAll.getAllStates({
          country_id: Number(countryId),
        });
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
        setStateOptions([]);
      }
    };
    fetchStates();
  }, [edit.getValue('country'), edit.getValue('country_id')]);

  // Fetch district options when state changes
  useEffect(() => {
    const countryId =
      edit.getValue('country')?.value ?? edit.getValue('country_id') ?? null;
    const stateId =
      edit.getValue('state')?.value ?? edit.getValue('state_id') ?? null;
    if (!countryId || !stateId) {
      setDistrictOptions([]);
      edit.update({ district: null, district_id: null });
      return;
    }
    const fetchDistricts = async () => {
      try {
        const countryId =
          edit.getValue('country')?.value ??
          edit.getValue('country_id') ??
          null;
        const stateId =
          edit.getValue('state')?.value ?? edit.getValue('state_id') ?? null;

        console.log('Fetching districts with params:', { countryId, stateId });

        if (!countryId || !stateId) {
          console.warn('Country ID or State ID is missing:', {
            countryId,
            stateId,
          });
          setDistrictOptions([]);
          return;
        }

        const res = await DropDownServiceAll.getAllDistricts({
          country_id: Number(countryId),
          state_id: Number(stateId),
        });

        const districts = res?.data?.data?.districts ?? [];
        console.log('Districts API response:', districts);

        if (Array.isArray(districts) && districts.length > 0) {
          const options = districts.map((district: any) => ({
            label: district.district_name,
            value: district.id,
          }));
          console.log('Mapped district options:', options);
          setDistrictOptions(options);
        } else {
          console.warn('No districts found in API response.');
          setDistrictOptions([]);
          toast.error(
            'No districts found for the selected country and state. Please contact support if this is unexpected.'
          );
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        toast.error('Failed to retrieve districts. Please try again later.');
      }
    };
    fetchDistricts();
  }, [
    edit.getValue('country'),
    edit.getValue('country_id'),
    edit.getValue('state'),
    edit.getValue('state_id'),
  ]);

  // Update country, state and district when options are loaded and rowData is available
  useEffect(() => {
    if (type !== 'edit' || hasInitializedLocation.current) return;

    // Update country
    if (rowData.country_id && countryOptions.length > 0) {
      const currentCountry = edit.getValue('country');
      if (!currentCountry?.value) {
        const countryOpt = countryOptions.find(
          (country: any) => Number(country.value) === Number(rowData.country_id)
        );
        if (countryOpt) {
          edit.update({ country: countryOpt });
        }
      }
    }

    // Update state
    if (rowData.state_id && stateOptions.length > 0) {
      const currentState = edit.getValue('state');
      if (!currentState?.value) {
        const stateOpt = stateOptions.find(
          (state: any) => Number(state.value) === Number(rowData.state_id)
        );
        if (stateOpt) {
          edit.update({ state: stateOpt });
        }
      }
    }

    // Update district
    if (rowData.district_id && districtOptions.length > 0) {
      const currentDistrict = edit.getValue('district');
      if (!currentDistrict?.value) {
        const districtOpt = districtOptions.find(
          (district: any) =>
            Number(district.value) === Number(rowData.district_id)
        );
        if (districtOpt) {
          edit.update({ district: districtOpt });
        }
      }
    }

    // Mark as initialized if all three have values or options are loaded
    if (
      countryOptions.length > 0 &&
      stateOptions.length > 0 &&
      districtOptions.length > 0
    ) {
      hasInitializedLocation.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    countryOptions,
    stateOptions,
    districtOptions,
    rowData.country_id,
    rowData.state_id,
    rowData.district_id,
    type,
  ]);

  // Auto-generate Vendor No for create mode only
  useEffect(() => {
    const shouldAutoGen = type === 'create';
    if (!shouldAutoGen) return;
    const current = edit.getValue('vendor_no');
    if (current) return; // do not override user input
    (async () => {
      try {
        const res: any = await API_SERVICES.VendorService.autoCodeGenerator({
          prefix: 'VEN',
          fy: '24-25',
        });
        const code = res?.data?.data?.vendor_code;
        if (code && !edit.getValue('vendor_no')) {
          edit.update({ vendor_no: code });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [type]);
  const handleCancel = () => {
    navigateTo('/admin/master/vendorList');
  };
  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={
            type === 'create'
              ? 'CREATE VENDOR'
              : type === 'edit'
                ? 'EDIT VENDOR'
                : 'VIEW VENDOR'
          }
          navigateUrl="/admin/master/vendorList"
          showCreateBtn={false}
          showlistBtn={false}
          showDownloadBtn={false}
          showBackButton={true}
        />
        <Grid
          container
          size="grow"
          flexDirection={'column'}
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            size={16}
            padding="20px"
            weight={600}
            color={theme.Colors.black}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            VENDOR DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid
              size={{ xs: 12, md: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '130px', height: '130px' }}>
                <DragDropUpload
                  required={false}
                  image_url={edit.getValue('image') || ''}
                  onBrowseButtonClick={onMaterialImageBrowse}
                  handleDeleteImage={() => edit.update({ image: '' })}
                  isError={uploadMaterialImageError}
                  uploadText=""
                  image_icon={<UploadPlusIcon />}
                  isViewUploadedImage={'true'}
                  disabled={type === 'view'}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Vendor No"
                value={edit.getValue('vendor_no')}
                disabled={true}
                onChange={(e: any) =>
                  handleValidatedChange(
                    e,
                    edit,
                    'vendor_no',
                    'alphanumericWithSpaceAndSlash'
                  )
                }
                isError={hasError(fieldError.vendor_no)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Vendor Name"
                value={edit.getValue('vendor_name')}
                disabled={type === 'view'}
                onChange={(e: any) => {
                  const next = String(e.target.value || '').replace(/^\s+/, '');
                  edit.update({ vendor_name: next });
                }}
                isError={hasError(fieldError.vendor_name)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Proprietor Name"
                value={edit.getValue('proprietor_name')}
                disabled={type === 'view'}
                onChange={(e: any) => {
                  const next = String(e.target.value || '').replace(/^\s+/, '');
                  e.target.value = next;
                  handleValidatedChange(e, edit, 'proprietor_name', 'string');
                }}
                isError={hasError(fieldError.proprietor_name)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              {/* <TextInput
                inputLabel="Mobile Number"
                value={edit.getValue('mobile_no')}
                disabled={type === 'view'}
                onChange={(e: any) => {
                  const next = String(e.target.value || '').replace(/^\s+/, '');
                  e.target.value = next;
                  handleValidatedChange(e, edit, 'mobile_no', 'number');
                }}
                isError={hasError(fieldError.mobile_no)}
                {...commonTextInputProps}
              /> */}
              <TextInput
                inputLabel="Mobile Number"
                value={edit.getValue('mobile_no')}
                disabled={type === 'view'}
                onChange={(e: any) => {
                  const cleaned = String(e.target.value || '')
                    .replace(/\D/g, '')
                    .slice(0, 10);

                  edit.update({ mobile_no: cleaned });
                }}
                isError={hasError(fieldError.mobile_no)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Email"
                value={edit.getValue('email')}
                disabled={type === 'view'}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'email', 'email')
                }
                isError={hasError(fieldError.email)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="GST Number"
                value={edit.getValue('gst_no')}
                disabled={type === 'view'}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'gst_no', 'alphanumeric')
                }
                isError={
                  hasError(fieldError.gst_no) ||
                  (!!edit.getValue('gst_no') &&
                    !isValidGSTIN(edit.getValue('gst_no')))
                }
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="PAN Number"
                value={edit.getValue('pan_no')}
                disabled={type === 'view'}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'pan_no', 'alphanumeric')
                }
                isError={
                  hasError(fieldError.pan_no) ||
                  (!!edit.getValue('pan_no') &&
                    !isValidPAN(edit.getValue('pan_no')))
                }
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Address"
                value={edit.getValue('address')}
                disabled={type === 'view'}
                onChange={(e) => {
                  const next = String(e.target.value || '').replace(/^\s+/, '');
                  edit.update({ address: next });
                }}
                isError={hasError(fieldError.address)}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <AutoSearchSelectWithLabel
                required
                label="Country"
                isReadOnly={type === 'view'}
                options={countryOptions}
                value={
                  countryOptions.find(
                    (option) =>
                      option.value ===
                      (edit.getValue('country')?.value ??
                        edit.getValue('country_id'))
                  ) ?? null
                }
                onChange={(_e, value) => {
                  edit.update({
                    country: value,
                    country_id: value?.value ?? null,
                    state: null,
                    state_id: null,
                  });
                }}
                isError={hasError(fieldError.country)}
              />
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.rightItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <AutoSearchSelectWithLabel
                required
                label="State"
                isReadOnly={type === 'view'}
                options={stateOptions}
                value={
                  stateOptions.find(
                    (option) =>
                      option.value ===
                      (edit.getValue('state')?.value ??
                        edit.getValue('state_id'))
                  ) ?? null
                }
                onChange={(_e, value) => {
                  console.log('State selected:', value);
                  edit.update({
                    state: value,
                    state_id: value?.value ?? null,
                  });
                }}
                isError={hasError(fieldError.state)}
              />
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <AutoSearchSelectWithLabel
                required
                label="District"
                isReadOnly={type === 'view'}
                options={districtOptions}
                value={
                  districtOptions.find(
                    (option) =>
                      option.value ===
                      (edit.getValue('district')?.value ??
                        edit.getValue('district_id'))
                  ) ?? null
                }
                onChange={(_e, value) => {
                  edit.update({
                    district: value,
                    district_id: value?.value ?? null,
                  });
                }}
                isError={hasError(fieldError.district)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="PIN Code"
                disabled={type === 'view'}
                value={edit.getValue('pin_code')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'pin_code', 'pincode')
                }
                isError={hasError(fieldError.pin_code)}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Opening Balance"
                value={edit.getValue('open_balance')}
                disabled={type === 'view'}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'open_balance', 'number')
                }
                isError={hasError(fieldError.open_balance)}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                label="Payment Terms"
                isReadOnly={type === 'view'}
                options={paymentTerms}
                value={edit.getValue('payment_terms')}
                onChange={(e, value) => edit.update({ payment_terms: value })}
                isError={hasError(fieldError.payment_terms)}
                required
              />
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <AutoSearchSelectWithLabel
                label="Balance Type"
                isReadOnly={type === 'view'}
                options={balanceType}
                value={edit.getValue('balance_type')}
                onChange={(e, value) => edit.update({ balance_type: value })}
                isError={hasError(fieldError.balance_type)}
                required
              />
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.rightItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <MUHSelectBoxComponent
                selectLabel="Material Type"
                multiple={true}
                isSearch={true}
                disabled={type === 'view'}
                value={edit.getValue('material_type')}
                onChange={(e: any) =>
                  edit.update({ material_type: e.target.value })
                }
                selectItems={materialType}
                {...commonSelectBoxProps}
                isCheckbox={true}
                isError={hasError(fieldError.material_type)}
              />
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <MUHSelectBoxComponent
                selectLabel="Visibility"
                multiple={true}
                isSearch={true}
                disabled={type === 'view'}
                value={edit.getValue('visibility')}
                onChange={(e: any) =>
                  edit.update({ visibility: e.target.value })
                }
                selectItems={visibilityOptions}
                {...commonSelectBoxProps}
                required={false}
                isCheckbox={true}
              />
            </Grid>
          </Grid>
        </Grid>
        <TabFormDetails
          type={type}
          edit={edit}
          isError={isError}
          bankDetailsFieldErrors={bankDetailsFiledErrors}
          loginDetailsFieldErrors={loginDetailsFieldErrors}
        />
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
    </>
  );
};
export default CreateVendor;
