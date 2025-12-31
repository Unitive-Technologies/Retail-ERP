import { styles, TextInput } from '@components/index';
import { handleValidatedChange } from '@utils/form-util';
import Grid from '@mui/material/Grid2';
import {
  commonTextInputProps,
  formLayoutStyle,
} from '@components/CommonStyles';
import { useState } from 'react';
import PasswordAdornment from './PasswordAdornment';

type Props = {
  edit: any;
  isError: boolean;
  fieldErrors: any;
  type?: string | null;
};

const LoginDetails = ({ edit, isError, fieldErrors, type }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hasError = (specificError: boolean) => isError && specificError;
  const isReadOnly = type === 'view';

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container width={'100%'} sx={formLayoutStyle}>
      <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
        <TextInput
          inputLabel="Username"
          disabled={isReadOnly}
          value={edit?.getValue('login_details.user_name') || ''}
          onChange={(e: any) =>
            handleValidatedChange(e, edit, 'login_details.user_name', 'email')
          }
          isError={hasError(fieldErrors?.user_name)}
          {...commonTextInputProps}
          required={true}
        />
      </Grid>
    <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
  <TextInput
    type={showPassword ? 'text' : 'password'}
    disabled={isReadOnly}
    inputLabel="Password"
    value={edit?.getValue('login_details.password') || ''}
    onChange={(e: any) =>
      edit.update({ ['login_details.password']: e.target.value })
    }
    InputProps={{
      endAdornment: (
        <PasswordAdornment
          showPassword={showPassword}
          onToggle={handlePasswordToggle}
        />
      ),
    }}
    isError={
      (edit?.getValue('login_details.password')?.length ?? 0) < 8
    }
    inputProps={{ minLength: 8 }}
    {...commonTextInputProps}
    required={true}
  />
</Grid>
    </Grid>
  );
};

export default LoginDetails;
