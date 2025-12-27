import React from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import MUHTextArea from '@components/MUHTextArea';
import TextInput from '@components/MUHTextInput';
import {
  commonTextInputProps,
  sectionContainerStyle,
} from '@components/CommonStyles';
import { handleValidatedChange } from '@utils/form-util';

type Props = {
  edit: any;
  fieldErrors?: any;
  hasError?: (field: any) => boolean;
};

const ProductDescriptionSection: React.FC<Props> = ({
  edit,
  fieldErrors,
  hasError = () => false,
}) => {
  const theme = useTheme();

  return (
    <Grid>
      <FormSectionHeader title="Product Description" />
      <Grid container gap={2} sx={sectionContainerStyle}>
        <TextInput
          inputLabel="Product Name"
          value={edit.getValue('product_name')}
          onChange={(e: any) =>
            handleValidatedChange(e, edit, 'product_name', 'noSpace')
          }
          labelFlexSize={4.3}
          isError={hasError(fieldErrors?.product_name)}
          {...commonTextInputProps}
        />

        <MUHTextArea
          label="Description"
          required
          value={edit.getValue('description')}
          onChange={(e: any) =>
            handleValidatedChange(e, edit, 'description', 'noSpace')
          }
          minRows={4}
          maxRows={6}
          labelFlexSize={4.3}
          isError={hasError(fieldErrors?.description)}
          focusBorderColor={theme.Colors.primary}
        />
      </Grid>
    </Grid>
  );
};

export default ProductDescriptionSection;
