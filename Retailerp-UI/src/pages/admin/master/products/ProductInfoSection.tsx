import React from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import TextInput from '@components/MUHTextInput';
import {
  commonTextInputProps,
  sectionContainerStyle,
} from '@components/CommonStyles';
import { allowDecimalOnly } from '@utils/form-util';
import TextInputAdornment from '@pages/admin/common/TextInputAdornment';

type Props = {
  edit: any;
  fieldErrors?: any;
  hasError?: (field: any) => boolean;
};

const ProductInfoSection: React.FC<Props> = ({
  edit,
  fieldErrors,
  hasError = () => false,
}) => {
  return (
    <Grid>
      <FormSectionHeader title="Product Info" />
      <Grid container gap={2} sx={sectionContainerStyle}>
        <TextInput
          inputLabel="SKU ID"
          value={edit.getValue('sku_id')}
          onChange={(e: any) => edit.update({ sku_id: e.target.value })}
          isError={hasError(fieldErrors?.sku_id)}
          isReadOnly={true}
          {...commonTextInputProps}
        />
        <TextInput
          inputLabel="Purity"
          value={edit.getValue('purity')}
          onChange={(e: any) => {
            if (!allowDecimalOnly(e.target.value)) {
              return;
            }
            edit.update({ purity: e.target.value });
          }}
          isError={hasError(fieldErrors?.purity)}
          {...commonTextInputProps}
          slotProps={{
            input: {
              endAdornment: (
                <TextInputAdornment text="%" width={'57px'} position="end" />
              ),
            },
          }}
        />
        <TextInput
          inputLabel="HSN Code"
          value={edit.getValue('hsn_code')}
          onChange={(e: any) => edit.update({ hsn_code: e.target.value })}
          isError={hasError(fieldErrors?.hsn_code)}
          {...commonTextInputProps}
        />
      </Grid>
    </Grid>
  );
};

export default ProductInfoSection;
