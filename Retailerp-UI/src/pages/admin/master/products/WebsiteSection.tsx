import React from 'react';
import { Checkbox, FormControlLabel, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import MUHTypography from '@components/MUHTypography';
import { sectionContainerStyle } from '@components/CommonStyles';

type Props = {
  edit: any;
};

const WebsiteSection: React.FC<Props> = ({ edit }: Props) => {
  const theme = useTheme();

  return (
    <Grid>
      <FormSectionHeader title="Product Publishing" />
      <Grid container sx={sectionContainerStyle}>
        <FormControlLabel
          control={
            <Checkbox
              checked={edit.getValue('is_published')}
              onChange={(e) =>
                edit.update({ is_published: e.target.checked })
              }
              sx={{
                color: theme.Colors.primary,
                '&.Mui-checked': {
                  color: theme.Colors.primary,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 22,
                  borderRadius: '8px !important',
                },
                '& .MuiCheckbox-root': {
                  borderRadius: '8px !importants',
                },
                zIndex: 0
              }}
            />
          }
          label={
            <MUHTypography
              text="Website"
              family={theme.fontFamily.roboto}
              weight={500}
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default WebsiteSection;
