import { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DualActionButton, TextInput } from '@components/index';

interface BasicDetailEditPageProps {
  onCancel: () => void;
}

const BasicDetailEditPage = ({ onCancel }: BasicDetailEditPageProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: 'Charan',
    mobile: '9944085895',
    email: 'Charan142@gmail.com',
  });

  const handleSave = () => {
    console.log('Saved Data:', formData);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Typography
        style={{
          marginBottom: '32px',
          fontWeight: 600,
          color: theme.Colors.black,
          fontSize: '20px',
          fontFamily: 'Roboto Slab',
          borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,

          width: 'fit-content',
        }}
      >
        Basic Details
      </Typography>

      <Grid container rowSpacing={4} columnSpacing={15}>
        <Grid size={{ xs: 12, md: 5.7 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
              color: theme.Colors.black,
            }}
          >
            Name
          </Typography>

          <TextInput
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>

        {/* Mobile Number */}
        <Grid size={{ xs: 12, md: 5.7 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
              color: theme.Colors.black,
            }}
          >
            Mobile Number
          </Typography>

          <TextInput
            value={formData.mobile}
            onChange={(e) => {
              setFormData({ ...formData, mobile: e.target.value });
            }}
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
              color: theme.Colors.black,
            }}
          >
            Email ID
          </Typography>
          <Grid size={{ xs: 12, md: 5.7 }}>
            <TextInput
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
              fontFamily="Roboto Slab"
              fontWeight={400}
              fontSize={16}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Buttons */}
      <Grid
        container
        justifyContent={'center'}
        sx={{
          width: '100%',
          textWrap: 'nowrap',
          mt: 17,
        }}
      >
        <DualActionButton
          leftButtonText="Save"
          rightButtonText="Back"
          onLeftButtonClick={handleSave}
          onRightButtonClick={onCancel}
          leftButtonStyle={{
            background:
              `linear-gradient(101.51deg, ${theme.Colors.primaryDarkStart} 0.31%, ${theme.Colors.primaryDarkEnd} 99.69%)`,
            color: theme.Colors.whitePrimary,
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Roboto Slab',
            fontWeight: 500,
          }}
          rightButtonStyle={{
            background: 'transparent',
            color: '#632633',
            border: '1px solid #632633',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Roboto Slab',
            fontWeight: 500,
          }}
          containerStyle={{ gap: '15px' }}
          leftButtonWidth={'150px'}
          rightButtonWidth={'150px'}
        />
      </Grid>
    </Box>
  );
};

export default BasicDetailEditPage;
