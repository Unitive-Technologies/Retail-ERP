import {
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DualActionButton, TextInput } from '@components/index';
import { useState } from 'react';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { CountryList, DistrictList, StateList } from '@constants/DummyData';

interface AddAddressProps {
  onCancel: () => void;
}

const AddAddress = ({ onCancel }: AddAddressProps) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: 'Charan',
    mobile: '9944085895',
    address: '31/11, Anna nagar, 1st cross street',
    Country: 'India',
    State: 'Tamil Nadu',
    District: 'Chennai',
    PinCode: '600040',
    isDefault: false,
  });

  const handleSave = () => {
    console.log('Saved Data:', formData);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          pb: 1,
        }}
      >
        <Typography
          style={{
            marginBottom: 4,
            fontWeight: 500,
            color: theme.Colors.black,
            fontSize: '20px',
            fontFamily: 'Roboto Slab',
            borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
            width: 'fit-content',
          }}
        >
          Add Address
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                color: theme.Colors.black,
              }}
            >
              Default Address
            </Typography>
          }
          sx={{
            margin: 0,
            '& .MuiFormControlLabel-label': {
              marginLeft: '4px',
            },
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            Name
          </Typography>
          <TextInput
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            width="450px"
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            Mobile Number
          </Typography>
          <TextInput
            value={formData.mobile}
            onChange={(e) => {
              setFormData({ ...formData, mobile: e.target.value });
            }}
            width="450px"
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            Address
          </Typography>
          <TextInput
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
            }}
            width="450px"
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            Country
          </Typography>

          <MUHSelectBoxComponent
            isCheckbox={false}
            value={formData.Country}
            placeholderText="Select Country"
            onChange={(e) =>
              setFormData({ ...formData, Country: e.target.value })
            }
            selectItems={CountryList}
            selectWidth={450}
            selectBoxStyle={{
              fontFamily: 'Roboto Slab',
              fontWeight: 400,
              fontSize: 16,
              color: theme.Colors.black,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            State
          </Typography>

          <MUHSelectBoxComponent
            isCheckbox={false}
            value={formData.State}
            placeholderText="Select State"
            onChange={(e) =>
              setFormData({ ...formData, State: e.target.value })
            }
            selectItems={StateList}
            selectWidth={450}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            District
          </Typography>
          <MUHSelectBoxComponent
            isCheckbox={false}
            value={formData.District}
            placeholderText="Select District"
            onChange={(e) =>
              setFormData({ ...formData, District: e.target.value })
            }
            selectItems={DistrictList}
            selectWidth={450}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            style={{
              marginBottom: '16px',
              fontWeight: 400,
              color: theme.Colors.black,
              fontSize: '16px',
              fontFamily: 'Roboto Slab',
            }}
          >
            Pin Code
          </Typography>
          <TextInput
            value={formData.PinCode}
            onChange={(e) => {
              setFormData({ ...formData, PinCode: e.target.value });
            }}
            width="450px"
            fontFamily="Roboto Slab"
            fontWeight={400}
            fontSize={16}
          />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={'center'}
        sx={{
          width: '100%',
          textWrap: 'nowrap',
          mt: 5,
        }}
      >
        <DualActionButton
          leftButtonText="Save"
          rightButtonText="Back"
          onLeftButtonClick={handleSave}
          onRightButtonClick={onCancel}
          leftButtonStyle={{
            background: `linear-gradient(101.51deg, ${theme.Colors.primaryDarkStart} 0.31%, ${theme.Colors.primaryDarkEnd} 99.69%)`,
            color: theme.Colors.whitePrimary,
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Roboto Slab',
          }}
          rightButtonStyle={{
            background: 'transparent',
            color: '#632633',
            border: '1px solid #632633',
            borderRadius: '8px',
            fontFamily: 'Roboto Slab',
            fontSize: '16px',
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

export default AddAddress;
