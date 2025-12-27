import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme, Skeleton } from '@mui/material';
import {
  handleValidatedChange,
  isPhoneNumber,
  isValidEmail,
  isValidPinCode,
} from '@utils/form-util';
import { useState, useEffect } from 'react';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import {
  commonTextInputProps,
  formLayoutStyle,
} from '@components/CommonStyles';
import { StateList } from '@constants/DummyData';
import FormAction from '@components/ProjectCommon/FormAction';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TabFormDetails from './TabFormDetails';
import { SuperAdminProfileService } from '@services/SuperAdminProfileService';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { BranchType } from '@constants/Constance';
import dayjs from 'dayjs';

const MyProfile = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const profileId = 1; // static for now

  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const initialFormValues = {
    company_name: '',
    proprietor: '',
    mobile_number: '',
    address: '',
    email_id: '',
    state_id: null,
    city: '',
    pin_code: '',
    branch_value: '',
    branch_sequence_value: '',
    joining_date: null,
    bank_details: {
      branch_name: '',
      account_holder_name: '',
      bank_name: '',
      account_no: '',
      ifsc_code: '',
    },
    kyc_details: [],
    login_details: { user_name: '', password: '' },
    login_user_id: null,
  };
  const edit = useEdit(initialFormValues);

  const fetchProfile = async () => {
    try {
      const response = await SuperAdminProfileService.getProfileById(profileId);
      const payload = response?.data?.data ?? response?.data ?? {};
      const data = payload?.data ? payload.data : payload;

      const profile = data?.profile ?? payload?.profile ?? null;
      const bank = data?.bank_account ?? payload?.bank_account ?? {};
      const kycDocs = data?.kyc_documents ?? payload?.kyc_documents ?? [];
      const logins = data?.logins ?? payload?.logins ?? [];

      if (profile) {
        const matchedBranchOption =
          BranchType.find(
            (opt: any) =>
              String(opt.value) === String(profile.branch_sequence_type) ||
              String(opt.label).toLowerCase() ===
                String(profile.branch_sequence_type).toLowerCase()
          ) || null;

        const formValues = {
          company_name: profile.company_name || '',
          proprietor: profile.proprietor || '',
          mobile_number: profile.mobile_number || '',
          address: profile.address || '',
          email_id: profile.email_id || '',
          state_id: profile.state_id ?? null,
          city: profile.district_id ?? '',
          pin_code: profile.pin_code || '',
          branch_value:
            matchedBranchOption?.value ?? profile.branch_sequence_type ?? '',
          branch_sequence_value: profile.branch_sequence_value || '',
          joining_date: profile.joining_date
            ? dayjs(profile.joining_date)
            : null,
          bank_details: {
            branch_name: bank.bank_branch_name || '',
            account_holder_name: bank.account_holder_name || '',
            bank_name: bank.bank_name || '',
            account_no: bank.account_number || '',
            ifsc_code: bank.ifsc_code || '',
          },
          kyc_details: kycDocs.map((doc: any) => ({
            docName: doc.doc_type || '',
            docNo: doc.doc_number || '',
            document_url: doc.file_url || '',
            id: doc.id ?? undefined,
          })),
          login_details:
            logins && logins.length > 0
              ? {
                  user_name: logins[0].email || '',
                  password: logins[0].password_hash || '',
                }
              : { user_name: '', password: '' },
          login_user_id: (logins && logins[0]?.id) || null,
        };

        edit.update(formValues);

        console.log('Profile form values set:', edit.getValue());
      } else {
        console.warn('No profile found in response:', response);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fieldErrors = {
    company_name: !edit.allFilled('company_name'),
    proprietor: !edit.allFilled('proprietor'),
    state_id: !edit.allFilled('state_id'),
    pin_code:
      !edit.allFilled('pin_code') || !isValidPinCode(edit.getValue('pin_code')),
    city: !edit.allFilled('city'),
    email_id:
      !edit.allFilled('email_id') || !isValidEmail(edit.getValue('email_id')),
    mobile_number:
      !edit.allFilled('mobile_number') ||
      !isPhoneNumber(edit.getValue('mobile_number')),
    address: !edit.allFilled('address'),
    branch_value: !edit.allFilled('branch_value'),
    branch_sequence_value: !edit.allFilled('branch_sequence_value'),
  };

  const validateMyProfile = () =>
    !Object.values(fieldErrors).some((error) => error);

  const handleCreate = () => {
    const isValidMyprofile = validateMyProfile();

    if (!isValidMyprofile) {
      setIsError(true);
      toast.error('Please fill all required fields correctly.');
      return;
    }

    toast.success('Profile updated successfully.');
  };
  // const handleCancel = () => navigateTo('/admin');

  const handleCancel = () => navigateTo('/admin/dashboard');

  if (loading) {
    return (
      <Grid container flexDirection="column" gap={1.5} p={2}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Grid>
    );
  }

  return (
    <Grid container flexDirection={'column'} gap={1.5}>
      <PageHeader
        title={'My Profile'}
        showCreateBtn={false}
        showlistBtn={false}
        showDownloadBtn={false}
      />

      <Grid container sx={formLayoutStyle}>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Company Name"
            value={edit.getValue('company_name') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'company_name', 'string')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <TextInput
            inputLabel="Proprietor"
            value={edit.getValue('proprietor') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'proprietor', 'string')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Mobile Number"
            value={edit.getValue('mobile_number') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'mobile_number', 'number')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 6 }} sx={styles.rightItem}>
          <TextInput
            inputLabel="Email ID"
            value={edit.getValue('email_id') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'email_id', 'email')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Address"
            value={edit.getValue('address') || ''}
            onChange={(e) => edit.update({ address: e.target.value })}
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
          <AutoSearchSelectWithLabel
            required
            label="State"
            options={StateList}
            value={
              StateList.find(
                (opt) => opt.value === edit.getValue('state_id')
              ) || null
            }
            onChange={(e, value) =>
              edit.update({
                state_id: value?.value ?? null,
              })
            }
            isError={isError && fieldErrors.state_id}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="District"
            value={edit.getValue('city') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'city', 'string')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <TextInput
            inputLabel="Pin Code"
            value={edit.getValue('pin_code') || ''}
            onChange={(e: any) =>
              handleValidatedChange(e, edit, 'pin_code', 'pincode')
            }
            {...commonTextInputProps}
          />
        </Grid>
        <Grid
          container
          size={{ xs: 12, md: 6 }}
          sx={{ height: 'fit-content', alignItems: 'center', mt: '8px', mb: 2 }}
        >
          <Grid size={4.47}>
            <Typography
              sx={{
                color:
                  isError && fieldErrors.branch_value
                    ? theme.Colors.redPrimary
                    : 'auto',
              }}
            >
              Branch Sequence{' '}
              <span
                style={{
                  color: theme.Colors.redPrimary,
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.small_xx,
                }}
              >
                *
              </span>
            </Typography>
          </Grid>
          <Grid size={3.1}>
            <MUHSelectBoxComponent
              value={edit.getValue('branch_value')}
              onChange={(e: any) =>
                edit.update({ branch_value: e.target.value })
              }
              selectItems={BranchType}
              isError={isError && fieldErrors.branch_value}
              // ...commonTextInputProps or commonSelectBoxProps if needed
            />
          </Grid>
          <Grid size={3.1} ml={1}>
            <TextInput
              value={edit.getValue('branch_sequence_value')}
              onChange={(e: any) =>
                handleValidatedChange(
                  e,
                  edit,
                  'branch_sequence_value',
                  'string'
                )
              }
              isError={isError && fieldErrors.branch_sequence_value}
              {...commonTextInputProps}
            />
          </Grid>
        </Grid>
      </Grid>

      <TabFormDetails
        edit={edit}
        isError={isError}
        fieldErrors={fieldErrors}
        loginDetailsFieldErrors={undefined}
      />

      <FormAction handleCreate={handleCreate} handleCancel={handleCancel} />
    </Grid>
  );
};

export default MyProfile;
