import { styles, TextInput } from '@components/index';
import { handleValidatedChange, isValidIFSC } from '@utils/form-util';
import Grid from '@mui/material/Grid2';
import {
  commonTextInputProps,
  formLayoutStyle,
} from '@components/CommonStyles';

type Props = {
  edit: any;
  isError: boolean;
  fieldErrors: any;
  type?: string | null;
  isProfile?: boolean;
};

const BankDetails = ({
  edit,
  isError,
  fieldErrors,
  type,
  isProfile = false,
}: Props) => {
  const hasError = (specificError: boolean) => isError && specificError;
  const isReadOnly = type === 'view';

  const accountNoRaw = String(edit?.getValue('bank_details.account_no') || '');
  const isAccountNoInvalid = accountNoRaw.length > 0 && accountNoRaw.length < 9;

  return (
    <Grid container width={'100%'} sx={formLayoutStyle}>
      <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
        <TextInput
          inputLabel="Account Holder Name"
          value={edit?.getValue('bank_details.account_holder_name') || ''}
          disabled={isReadOnly}
          onChange={(e: any) => {
            const next = String(e.target.value || '').replace(/^\s+/, '');
            e.target.value = next;
            handleValidatedChange(
              e,
              edit,
              'bank_details.account_holder_name',
              'string'
            );
          }}
          isError={hasError(fieldErrors?.account_holder_name)}
          {...commonTextInputProps}
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
        <TextInput
          inputLabel="Bank Name"
          value={edit?.getValue('bank_details.bank_name') || ''}
          disabled={isReadOnly}
          onChange={(e: any) => {
            const next = String(e.target.value || '').replace(/^\s+/, '');
            e.target.value = next;
            handleValidatedChange(e, edit, 'bank_details.bank_name', 'string');
          }}
          isError={hasError(fieldErrors?.bank_name)}
          {...commonTextInputProps}
          required={false}
        />
      </Grid>
      {isProfile ? (
        <>
          <Grid size={{ xs: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Account No"
              value={edit?.getValue('bank_details.account_no') || ''}
              disabled={isReadOnly}
              onChange={(e: any) => {
                const raw = String(e.target.value || '');
                const cleaned = raw.replace(/[^A-Za-z0-9]/g, ''); // Allow only alphanumeric characters
                edit.update({ 'bank_details.account_no': cleaned });
              }}
              isError={hasError(fieldErrors?.account_no) || isAccountNoInvalid}
              {...commonTextInputProps}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="IFSC Code"
              value={edit?.getValue('bank_details.ifsc_code') || ''}
              disabled={isReadOnly}
              onChange={(e: any) =>
                handleValidatedChange(
                  e,
                  edit,
                  'bank_details.ifsc_code',
                  'alphanumeric'
                )
              }
              isError={
                hasError(fieldErrors?.ifsc_code) ||
                (!!edit?.getValue('bank_details.ifsc_code') &&
                  !isValidIFSC(edit?.getValue('bank_details.ifsc_code')))
              }
              {...commonTextInputProps}
              required={false}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="IFSC Code"
              value={edit?.getValue('bank_details.ifsc_code') || ''}
              disabled={isReadOnly}
              onChange={(e: any) =>
                handleValidatedChange(
                  e,
                  edit,
                  'bank_details.ifsc_code',
                  'alphanumeric'
                )
              }
              isError={
                hasError(fieldErrors?.ifsc_code) ||
                (!!edit?.getValue('bank_details.ifsc_code') &&
                  !isValidIFSC(edit?.getValue('bank_details.ifsc_code')))
              }
              {...commonTextInputProps}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Account No"
              value={edit?.getValue('bank_details.account_no') || ''}
              disabled={isReadOnly}
              onChange={(e: any) => {
                const raw = String(e.target.value || '');
                const cleaned = raw.replace(/[^A-Za-z0-9]/g, '');
                edit.update({ 'bank_details.account_no': cleaned });
              }}
              isError={hasError(fieldErrors?.account_no) || isAccountNoInvalid}
              {...commonTextInputProps}
              required={false}
            />
          </Grid>
        </>
      )}
      <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
        <TextInput
          inputLabel="Branch Name"
          value={edit?.getValue('bank_details.branch_name') || ''}
          disabled={isReadOnly}
          onChange={(e: any) => {
            const next = String(e.target.value || '').replace(/^\s+/, '');
            edit.update({ ['bank_details.branch_name']: next });
          }}
          isError={hasError(fieldErrors?.branch_name)}
          {...commonTextInputProps}
          required={false}
        />
      </Grid>
    </Grid>
  );
};

export default BankDetails;
