import React from 'react';
import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import MUHRadioGroupComponent from '@components/ProjectCommon/MUHRadioGroupComponent';

type Props = {
  edit: any;
};

const SelectTypeSection: React.FC<Props> = ({ edit }: Props) => {
const options = [
  { label: 'Weight', value: "Weight Based" },
  { label: 'Piece', value: "Piece Rate" },
];

  return (
    <Grid>
      <FormSectionHeader title="Select Type" />
      <Grid container sx={sectionContainerStyle}>
        <MUHRadioGroupComponent
          value={edit.getValue('product_type')}
          options={options}
          onChange={(val) => edit.update({ product_type: val })}
        />
      </Grid>
    </Grid>
  );
};

export default SelectTypeSection;
