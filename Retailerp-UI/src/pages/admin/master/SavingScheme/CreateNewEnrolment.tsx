import { commonTextInputProps } from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';

import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';

import { useEdit } from '@hooks/useEdit';

import { useTheme } from '@mui/material';
import { Grid } from '@mui/system';

import { handleValidatedChange } from '@utils/form-util';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  identityProofOptions,
  nomineeRelationOptions,
  planOptions,
} from '@constants/DummyData';

const CreateNewEnrolment = () => {
  const theme = useTheme();
  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  // const rowId = params.get('rowId');
  const navigate = useNavigate();
  const handleSubmit = () => {};
  const [isError, setIsError] = useState<boolean>(false);

  const UserInitialValues: any = {};

  const edit = useEdit(UserInitialValues);

  const handleCancel = () => {
    handleGoBack();
  };
  // const handleCreate = () => {};

  const handleGoBack = () => {
    navigate('/admin/savingScheme');
  };

  const mobileNumberError = isError && !edit.allFilled('mobile_number');
  const customerNoError = isError && !edit.allFilled('customer_no');
  const customerNameError = isError && !edit.allFilled('customer_name');
  const emailIdError = isError && !edit.allFilled('email_id');
  const addressError = isError && !edit.allFilled('address');
  const countryError = isError && !edit.allFilled('country');
  const stateError = isError && !edit.allFilled('State');
  const districtError = isError && !edit.allFilled('district');
  const pincodeError = isError && !edit.allFilled('pincode');
  const planError = isError && !edit.allFilled('plan');
  const installmentAmountError =
    isError && !edit.allFilled('installment_amount');
  const identityProofError = isError && !edit.allFilled('identify_proof');
  const identityProofNoError = isError && !edit.allFilled('identify_proof_no');

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={'CREATE NEW ENROLMENT'}
          navigateUrl="/admin/savingScheme"
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
            size={theme.MetricsSizes.small_xxx}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            fontFamily={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            CUSTOMER DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                isError={mobileNumberError}
                inputLabel="Mobile Number"
                value={edit.getValue('mobile_number')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'mobile_number', 'number')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={customerNoError}
                inputLabel="Customer No"
                value={edit.getValue('customer_no')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'customer_no', 'alphanumeric')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                isError={customerNameError}
                inputLabel="Customer Name"
                value={edit.getValue('customer_name')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'customer_name', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={emailIdError}
                inputLabel="Email ID"
                value={edit.getValue('email_id')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'email_id', 'email')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                isError={addressError}
                inputLabel="Address"
                value={edit.getValue('address')}
                onChange={(e: any) =>
                  handleValidatedChange(
                    e,
                    edit,
                    'address',
                    'alphanumericWithSpaceAndSlash'
                  )
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Country"
                value={edit.getValue('country')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'country', 'string')
                }
                isError={countryError}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                isError={stateError}
                inputLabel="State"
                value={edit.getValue('state')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'state', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={districtError}
                inputLabel="District"
                value={edit.getValue('district')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'district', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                isError={pincodeError}
                inputLabel="PIN Code"
                value={edit.getValue('pin_code')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'pin_code', 'number')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
          </Grid>
        </Grid>
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
            size={theme.MetricsSizes.small_xxx}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            fontFamily={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            PLAN DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                isError={planError}
                label="Select plan"
                options={planOptions}
                value={edit.getValue('plan')}
                onChange={(e, value) => edit.update({ plan: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={installmentAmountError}
                inputLabel="Installment Amount"
                value={edit.getValue('installment_amount')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'installment_amount', 'number')
                }
                {...commonTextInputProps}
              />
            </Grid>
          </Grid>
        </Grid>
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
            size={theme.MetricsSizes.small_xxx}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            fontFamily={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            ADDITIONAL DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                isError={identityProofError}
                label="Identity Proof"
                options={identityProofOptions}
                value={edit.getValue('identity_proof')}
                onChange={(e, value) => edit.update({ identity_proof: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={identityProofNoError}
                inputLabel="Identity Proof No"
                value={edit.getValue('identity_proof_no')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'identity_proof_no', 'number')
                }
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Nominee"
                value={edit.getValue('nominee')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'nominee', 'string')
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                label="Nominee Relation"
                options={nomineeRelationOptions}
                value={edit.getValue('nominee_relation')}
                onChange={(e, value) =>
                  edit.update({ nominee_relation: value })
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <FormAction
          firstBtntxt={type === 'edit' ? 'Update' : 'Create'}
          secondBtntx="Cancel"
          handleCancel={handleCancel}
          handleCreate={handleSubmit}
        />
      </Grid>
    </>
  );
};

export default CreateNewEnrolment;
