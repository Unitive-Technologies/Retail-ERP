import React, { useState, useEffect } from 'react';
import { Box, TextField, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { ButtonComponent, AutoSearchSelectWithLabel } from '@components/index';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const StyledTextField = styled(TextField)<{ error?: boolean }>(({ error }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: error ? '#d32f2f' : '#CCCCCC',
    },
    '&:hover fieldset': {
      borderColor: error ? '#d32f2f' : '#CCCCCC',
    },
    '&.Mui-focused fieldset': {
      borderColor: error ? '#d32f2f' : '#7a1c2d',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Roboto Slab',
    color: '#666666',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Roboto Slab',
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Roboto Slab',
    fontSize: '12px',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#FBFBFB',
  borderRadius: theme.spacing(1),
  border: '1px solid #CCCCCC',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  country: string;
  countryId: number;
  city: string;
  cityId: number;
  state: string;
  stateId: number;
  pinCode: string;
}

interface AddressFormProps {
  onSave: (address: AddressFormData) => void;
  onCancel: () => void;
  initialData?: AddressFormData;
}

interface ValidationError {
  [key: string]: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<AddressFormData>(
    initialData || {
      name: '',
      phone: '',
      address: '',
      country: '',
      countryId: 0,
      city: '',
      cityId: 0,
      state: '',
      stateId: 0,
      pinCode: ''
    }
  );

  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown states
  const [countryOptions, setCountryOptions] = useState<{ label: string; value: number }[]>([]);
  const [stateOptions, setStateOptions] = useState<{ label: string; value: number }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: number }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: number } | null>(null);
  const [selectedState, setSelectedState] = useState<{ label: string; value: number } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ label: string; value: number } | null>(null);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res: any = await DropDownServiceAll.getAllCountry();        
        const countries = (res?.data?.data?.countries || []).map((item: any) => ({
          label: item.country_name,
          value: item.id,
        }));
        
        setCountryOptions(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountryOptions([]);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes (load all states like CreateCustomer)
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry?.value) {
        try {
          const res: any = await DropDownServiceAll.getAllStates();          
          const states = (res?.data?.data?.states || []).map((item: any) => ({
            label: item.state_name,
            value: item.id,
          }));
          
          setStateOptions(states);
        } catch (error) {
          console.error('Error fetching states:', error);
          setStateOptions([]);
        }
      } else {
        setStateOptions([]);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch districts when state changes with state_id parameter
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedState?.value) {
        try {
          const res = await DropDownServiceAll.getAllDistricts({
            state_id: selectedState.value,
          });

          // Check if response is successful and has data
          let districts: any[] = [];
          
          if (res && 'data' in res && res.data) {
            const responseData = res.data as any;
            districts = (responseData?.data?.districts || []).map((item: any) => ({
              label: item.district_name,
              value: item.id,
            }));
          }
          
          setDistrictOptions(districts);
        } catch (error) {
          console.error('Error fetching districts:', error);
          setDistrictOptions([]);
        }
      } else {
        setDistrictOptions([]);
      }
    };

    fetchDistricts();
  }, [selectedState]);

  // Basic validation functions
  const validateField = (field: keyof AddressFormData, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must not exceed 50 characters';
        break;
      case 'phone':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
        break;
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.length < 5) return 'Address must be at least 5 characters';
        break;
      case 'country':
        if (!selectedCountry) return 'Country is required';
        break;
      case 'city':
        if (!selectedDistrict) return 'District is required';
        break;
      case 'state':
        if (!selectedState) return 'State is required';
        break;
      case 'pinCode':
        if (!value.trim()) return 'PIN code is required';
        if (!/^\d{6}$/.test(value)) return 'Please enter a valid 6-digit PIN code';
        break;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};
    let isValid = true;

    // Validate text fields
    Object.keys(formData).forEach(field => {
      if (field !== 'country' && field !== 'state' && field !== 'city') {
        const fieldValue = formData[field as keyof AddressFormData];
        if (typeof fieldValue === 'string') {
          const error = validateField(field as keyof AddressFormData, fieldValue);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        }
      }
    });

    // Validate dropdown fields
    const countryError = validateField('country', formData.country);
    if (countryError) {
      newErrors.country = countryError;
      isValid = false;
    }

    const stateError = validateField('state', formData.state);
    if (stateError) {
      newErrors.state = stateError;
      isValid = false;
    }

    const cityError = validateField('city', formData.city);
    if (cityError) {
      newErrors.city = cityError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof AddressFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: keyof AddressFormData) => () => {
    const fieldValue = formData[field];
    // Only validate string fields, skip ID fields
    if (typeof fieldValue === 'string') {
      const error = validateField(field, fieldValue);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Dropdown change handlers
  const handleCountryChange = (_event: any, value: { label: string; value: number } | null) => {
    setSelectedCountry(value);
    setSelectedState(null);
    setSelectedDistrict(null);
    setStateOptions([]);
    setDistrictOptions([]);
    
    if (value) {
      setFormData(prev => ({
        ...prev,
        country: value.label,
        countryId: value.value,
        state: '',
        stateId: 0,
        city: '',
        cityId: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        country: '',
        countryId: 0,
        state: '',
        stateId: 0,
        city: '',
        cityId: 0
      }));
    }
  };

  const handleStateChange = (_event: any, value: { label: string; value: number } | null) => {
    setSelectedState(value);
    setSelectedDistrict(null);
    setDistrictOptions([]);
    
    if (value) {
      setFormData(prev => ({
        ...prev,
        state: value.label,
        stateId: value.value,
        city: '',
        cityId: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        state: '',
        stateId: 0,
        city: '',
        cityId: 0
      }));
    }
  };

  const handleDistrictChange = (_event: any, value: { label: string; value: number } | null) => {
    setSelectedDistrict(value);
    
    if (value) {
      setFormData(prev => ({
        ...prev,
        city: value.label,
        cityId: value.value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        city: '',
        cityId: 0
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new address object with an ID
      const newAddress = {
        ...formData,
        id: Date.now() // Generate a unique ID for the new address
      };
      
      // Call onSave with the new address data including ID
      onSave(newAddress);
      
      // Reset form after successful save
      setFormData({
        name: '',
        phone: '',
        address: '',
        country: '',
        countryId: 0,
        city: '',
        cityId: 0,
        state: '',
        stateId: 0,
        pinCode: ''
      });
      setErrors({});
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedDistrict(null);
      
    } catch (error) {
      setErrors({ general: 'Failed to save address. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

//   const isValid = Object.keys(formData).every(field => 
//     !validateField(field as keyof AddressFormData, formData[field as keyof AddressFormData])
//   );

  return (
    <FormContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            Full Name 
          </Typography>
          <StyledTextField
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange('name')(e.target.value)}
            onBlur={() => handleBlur('name')}
            variant="outlined"
            size="small"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            Mobile Number 
          </Typography>
          <StyledTextField
            fullWidth
            value={formData.phone}
            onChange={(e) => handleChange('phone')(e.target.value)}
            onBlur={() => handleBlur('phone')}
            variant="outlined"
            size="small"
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            Address Line 1 
          </Typography>
          <StyledTextField
            fullWidth
            value={formData.address}
            onChange={(e) => handleChange('address')(e.target.value)}
            onBlur={() => handleBlur('address')}
            variant="outlined"
            size="small"
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            Country
          </Typography>
          <AutoSearchSelectWithLabel
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select Country"
            isError={!!errors.country}
            height={40}
            isLabelAbove={false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            State 
          </Typography>
          <AutoSearchSelectWithLabel
            options={stateOptions}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select State"
            isError={!!errors.state}
            height={40}
            isLabelAbove={false}
            isReadOnly={!selectedCountry}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            District 
          </Typography>
          <AutoSearchSelectWithLabel
            options={districtOptions}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Select District"
            isError={!!errors.city}
            height={40}
            isLabelAbove={false}
            isReadOnly={!selectedState}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontFamily: 'Roboto Slab', fontSize: '14px' }}>
            PIN Code 
          </Typography>
          <StyledTextField
            fullWidth
            value={formData.pinCode}
            onChange={(e) => handleChange('pinCode')(e.target.value)}
            onBlur={() => handleBlur('pinCode')}
            variant="outlined"
            size="small"
            error={!!errors.pinCode}
            helperText={errors.pinCode}
          />
        </Grid>
      </Grid>

      <ButtonContainer>
        <ButtonComponent
          buttonText={isSubmitting ? 'Saving...' : 'Save'}
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(to right, #471923, #7F3242)',
            color: '#FFFFFF',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Roboto Slab',
            padding: '4px 24px',
            minWidth: '150px',
            border: 'none',
          }}
        />
        <ButtonComponent
          buttonText="Back"
          onClick={handleCancel}
          sx={{
            background: '#FFFFFF',
            color: '#7a1c2d',
            borderRadius: '8px',
            textTransform: 'none',
            border: '1px solid #7a1c2d',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Roboto Slab',
            padding: '4px 24px',
            minWidth: '150px',
          }}
        />
      </ButtonContainer>
    </FormContainer>
  );
};

export default AddressForm;
