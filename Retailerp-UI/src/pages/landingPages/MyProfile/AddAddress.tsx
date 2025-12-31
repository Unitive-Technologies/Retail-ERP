import {
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DualActionButton, TextInput } from '@components/index';
import { useState, useEffect } from 'react';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { OrderService } from '@services/OrderService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

interface AddAddressProps {
  onCancel: () => void;
  editAddressData?: any;
  onAddressUpdated?: () => void;
}

const AddAddress = ({
  onCancel,
  editAddressData,
  onAddressUpdated,
}: AddAddressProps) => {
  const theme = useTheme();
  const isEditMode = !!editAddressData;

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    Country: '',
    State: '',
    District: '',
    PinCode: '',
    isDefault: false,
  });

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (editAddressData) {
      console.log('Setting form data from editAddressData:', editAddressData);
      setFormData({
        name: editAddressData.name || '',
        mobile: editAddressData.mobile_number || '',
        address: editAddressData.address_line || '',
        Country: editAddressData.country_id || '',
        State: editAddressData.state_id || '',
        District: editAddressData.district_id || '',
        PinCode: editAddressData.pin_code || '',
        isDefault: editAddressData.is_default || false,
      });
    }
  }, [editAddressData]);

  const handleAddAddress = async () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.address ||
      !formData.Country ||
      !formData.State ||
      !formData.District ||
      !formData.PinCode
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const addressData = {
        addresses: [
          {
            customer_id: 1,
            name: formData.name,
            mobile_number: formData.mobile,
            address_line: formData.address,
            country_id: formData.Country || 1,
            state_id: formData.State || 1,
            district_id: formData.District || 1,
            pin_code: formData.PinCode,
            is_default: formData.isDefault,
          },
        ],
      };

      const response = await OrderService.createCustomerAddress(addressData);

      if (response && 'data' in response && response.data?.statusCode < 400) {
        onAddressUpdated?.();
        onCancel();
      } else {
        alert('Failed to create address. Please try again.');
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleUpdateAddress = async () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.address ||
      !formData.Country ||
      !formData.State ||
      !formData.District ||
      !formData.PinCode
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const addressData = {
        addresses: [
          {
            id: editAddressData?.id,
            customer_id: 1,
            name: formData.name,
            mobile_number: formData.mobile,
            address_line: formData.address,
            country_id: formData.Country || 1,
            state_id: formData.State || 1,
            district_id: formData.District || 1,
            pin_code: formData.PinCode,
            is_default: formData.isDefault,
          },
        ],
      };

      const response = await OrderService.updateCustomerAddress(addressData);

      if (response && 'data' in response && response.data?.statusCode < 400) {
        onAddressUpdated?.();
        onCancel();
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const countriesResponse: any = await DropDownServiceAll.getAllCountry();
        if (countriesResponse?.data?.data?.countries) {
          setCountries(countriesResponse.data.data.countries);
        }

        const districtsResponse: any =
          await DropDownServiceAll.getAllDistricts();
        if (districtsResponse?.data?.data?.districts) {
          setDistricts(districtsResponse.data.data.districts);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.Country) {
        try {
          const statesResponse: any = await DropDownServiceAll.getAllStates({
            country_id: formData.Country,
          });
          if (statesResponse?.data?.data?.states) {
            setStates(statesResponse.data.data.states);
          }
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      } else {
        setStates([]);
      }
    };

    fetchStates();
  }, [formData.Country]);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.State) {
        try {
          const districtsResponse: any =
            await DropDownServiceAll.getAllDistricts({
              state_id: formData.State,
            });
          console.log(
            districtsResponse?.data?.data?.districts,
            'districtsResponse?.data?.data?.districts'
          );

          if (districtsResponse?.data?.data?.districts) {
            setDistricts(districtsResponse.data.data.districts);
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [formData.State]);

  // Since API returns filtered results, we don't need client-side filtering
  const filteredStates = states;
  const filteredDistricts = districts;
  const currentDistrict = filteredDistricts.find(
    (d) => String(d.id) === String(formData.District)
  );

  // Handle country change
  const handleCountryChange = (e: any) => {
    const countryId = e.target.value;
    setFormData({
      ...formData,
      Country: countryId,
      State: '',
      District: '',
    });
  };

  // Handle state change
  const handleStateChange = (e: any) => {
    const stateId = e.target.value;
    setFormData({
      ...formData,
      State: stateId,
      District: '',
    });
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
            onChange={handleCountryChange}
            selectItems={countries.map((country: any) => ({
              value: country.id,
              label: country.country_name,
            }))}
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
            onChange={handleStateChange}
            selectItems={filteredStates.map((state: any) => ({
              value: state.id,
              label: state.state_name,
            }))}
            selectWidth={450}
            disabled={!formData.Country}
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
            key={`district-${formData.District}-${districts.length}`}
            isCheckbox={false}
            placeholderText="Select District"
            onChange={(e) =>
              setFormData({ ...formData, District: e.target.value })
            }
            selectItems={filteredDistricts.map((district: any) => ({
              value: String(district.id),
              label: district.district_name,
            }))}
            selectWidth={450}
            disabled={!formData.State}
            value={String(formData.District || '')}
            helperText={
              isEditMode && formData.District && !currentDistrict
                ? 'District not found in list'
                : ''
            }
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
          leftButtonText={isEditMode ? 'Update' : 'Save'}
          rightButtonText="Back"
          onLeftButtonClick={
            isEditMode ? handleUpdateAddress : handleAddAddress
          }
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
