import { Typography, useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import {
  AutoSearchSelectWithLabel,
  TextInput,
  styles,
  Loader,
} from '@components/index';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { commonTextInputProps } from '@components/CommonStyles';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { HTTP_STATUSES } from '@constants/Constance';

const CreateCustomer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type') || 'create';
  const rowId = searchParams.get('rowId');

  const customerInitialValues = {
    customer_code: '',
    customer_name: '',
    mobile_number: '',
    address: '',
    country_id: '',
    state_id: '',
    district_id: '',
    pin_code: '',
  };

  const edit = useEdit(customerInitialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dropdownData, setDropdownData] = useState<any>({
    countries: [],
    states: [],
    districts: [],
  });

  const handleGoBack = () => navigate('/admin/customer');

  // Field validation
  // Field validation
  const mobileValue = String(edit.getValue('mobile_number') || '');
  const isMobileExact10 = /^\d{10}$/.test(mobileValue);

  const fieldErrors = {
    customer_code: !edit.allFilled('customer_code'),
    customer_name: !edit.allFilled('customer_name'),
    // mobile must be filled and exactly 10 digits
    mobile_number: !edit.allFilled('mobile_number') || !isMobileExact10,
    address: !edit.allFilled('address'),
    country_id: !edit.getValue('country_id')?.value,
    state_id: !edit.getValue('state_id')?.value,
    district_id: !edit.getValue('district_id')?.value,
    // pin_code must be filled and exactly 6 digits
    pin_code: !edit.allFilled('pin_code') || !/^\d{6}$/.test(String(edit.getValue('pin_code') || '')),
  };

  // show live mobile error while typing (only when user has entered something)
  const mobileLiveError = mobileValue.length > 0 && !isMobileExact10;
  // live PIN error while typing
  const pinValue = String(edit.getValue('pin_code') || '');
  const pinLiveError = pinValue.length > 0 && !/^\d{6}$/.test(pinValue);

  const hasError = (specificError: boolean) => isError && specificError;

  const validateCustomerFields = () => {
    const errors = Object.values(fieldErrors);
    return !errors.some(error => error);
  };

  const handleCreateCustomer = async () => {
    setIsError(true);

    if (!validateCustomerFields()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const customerData = {
        customer_code: edit.getValue('customer_code'),
        customer_name: edit.getValue('customer_name'),
        mobile_number: edit.getValue('mobile_number'),
        address: edit.getValue('address'),
        country_id: edit.getValue('country_id')?.value,
        state_id: edit.getValue('state_id')?.value,
        district_id: edit.getValue('district_id')?.value,
        pin_code: edit.getValue('pin_code'),
      };

      if (type === 'edit' && rowId) {
        await API_SERVICES.CustomerService.update(Number(rowId), {
          data: customerData,
          successMessage: 'Customer updated successfully',
          failureMessage: 'Failed to update customer',
        });
      } else {
        await API_SERVICES.CustomerService.create({
          data: customerData,
          successMessage: 'Customer created successfully',
          failureMessage: 'Failed to create customer',
        });
      }

      handleGoBack();
    } catch (error) {
      console.error('Customer operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCustomerCode = async () => {
    try {
      const response: any = await API_SERVICES.CustomerService.generateCustomerCode({
        prefix: 'COD'
        // fy: '', // Empty as requested
      });

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        edit.update({ customer_code: response?.data?.data?.customer_code });
      }
    } catch (error) {
      console.error('Failed to generate customer code:', error);
      toast.error('Failed to generate customer code');
    }
  };

  const handleStateChange = async (_event: any, value: any) => {
    edit.update({ state_id: value, district_id: '' });
    
    if (value?.value) {
      try {
        const res: any = await DropDownServiceAll.getAllDistricts({
          state_id: value.value,
        });
        
        const districts = (res?.data?.data?.districts || []).map((item: any) => ({
          label: item.district_name,
          value: item.id,
        }));
        
        setDropdownData((prev: any) => ({
          ...prev,
          districts,
        }));
      } catch (error) {
        console.error('Failed to load districts:', error);
      }
    }
  };

  const handleCountryChange = async (_event: any, value: any) => {
    edit.update({ 
      country_id: value, 
      state_id: '', 
      district_id: '' 
    });
    
    // Reset dependent dropdowns
    setDropdownData((prev: any) => ({
      ...prev,
      states: [],
      districts: [],
    }));
    
    // Load states based on selected country
    if (value?.value) {
      try {
        const res: any = await DropDownServiceAll.getAllStates({
          country_id: value.value,
        });
        
        const states = (res?.data?.data?.states || []).map((item: any) => ({
          label: item.state_name,
          value: item.id,
        }));
        
        setDropdownData((prev: any) => ({
          ...prev,
          states,
        }));
      } catch (error) {
        console.error('Failed to load states:', error);
        toast.error('Failed to load states');
        setDropdownData((prev: any) => ({
          ...prev,
          states: [],
        }));
      }
    }
  };

  const handleDistrictChange = (_event: any, value: any) => {
    edit.update({ district_id: value });
  };

  const fetchDropdowns = async () => {
    try {
      const countriesRes: any = await DropDownServiceAll.getAllCountry();

      const data = {
        countries: (countriesRes?.data?.data?.countries || []).map((item: any) => ({
          label: item.country_name,
          value: item.id,
        })),
        states: [],
        districts: [],
      };

      setDropdownData(data);

      if (type !== 'create' && rowId) {
        await fetchCustomerById(Number(rowId), data);
      }
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
      toast.error('Failed to load dropdown data');
    }
  };

  const fetchCustomerById = async (id: number, dropdowns = dropdownData) => {
    try {
      const response: any = await API_SERVICES.CustomerService.getById(id);

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const customerData = response.data.data.customer;
        
        let states: any[] = [];
        let districts: any[] = [];
        
        // Load states for the selected country
        if (customerData.country_id) {
          try {
            const statesRes: any = await DropDownServiceAll.getAllStates({
              country_id: customerData.country_id,
            });
            
            states = (statesRes?.data?.data?.states || []).map((item: any) => ({
              label: item.state_name,
              value: item.id,
            }));
            
            setDropdownData((prev: any) => ({
              ...prev,
              states,
            }));
          } catch (error) {
            console.error('Failed to load states:', error);
          }
        }
        
        // Load districts for the selected state
        if (customerData.state_id) {
          try {
            const districtRes: any = await DropDownServiceAll.getAllDistricts({
              state_id: customerData.state_id,
            });
            
            districts = (districtRes?.data?.data?.districts || []).map((item: any) => ({
              label: item.district_name,
              value: item.id,
            }));
            
            setDropdownData((prev: any) => ({
              ...prev,
              districts,
            }));
          } catch (error) {
            console.error('Failed to load districts:', error);
          }
        }

        const findOption = (options: any[], id: number) => {
          return options.find((opt: any) => opt.value === id) || '';
        };

        // Use the loaded states and districts
        const updatedDropdowns = {
          ...dropdowns,
          states,
          districts,
        };

        edit.update({
          customer_code: customerData.customer_code || '',
          customer_name: customerData.customer_name || '',
          mobile_number: customerData.mobile_number || '',
          address: customerData.address || '',
          country_id: customerData.country_id
            ? findOption(updatedDropdowns.countries, customerData.country_id)
            : '',
          state_id: customerData.state_id
            ? findOption(updatedDropdowns.states, customerData.state_id)
            : '',
          district_id: customerData.district_id
            ? findOption(updatedDropdowns.districts, customerData.district_id)
            : '',
          pin_code: customerData.pin_code || '',
        });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('Failed to load customer data');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchDropdowns();
      } catch (error) {
        console.error('Initialization failed:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (type === 'create' && !edit.getValue('customer_code')) {
      generateCustomerCode();
    }
  }, [type]);

  const isReadOnly = type === 'view';

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid
      container
      flexDirection="column"
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        title={
          type === 'create'
            ? 'CREATE CUSTOMER'
            : type === 'edit'
              ? 'UPDATE CUSTOMER'
              : 'VIEW CUSTOMER'
        }
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/customer"
      />

      <Grid container size="grow">
        <Grid
          container
          width="100%"
          sx={{
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${theme.Colors.grayLight}`,
            alignContent: 'flex-start',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <Grid
            container
            size={{ xs: 12, md: 12 }}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              paddingBottom: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
              }}
            >
              CUSTOMER DETAILS
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              {...commonTextInputProps}
              inputLabel="Customer Code"
              required={true}
              value={edit.getValue('customer_code')}
              onChange={(e) =>
                handleValidatedChange(e, edit, 'customer_code', 'string')
              }
              placeholder="COD-001"
              isError={hasError(fieldErrors.customer_code)}
              disabled={true}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              {...commonTextInputProps}
              inputLabel="Customer Name"
              required={true}
              value={edit.getValue('customer_name')}
              onChange={(e) =>
                handleValidatedChange(e, edit, 'customer_name', 'string')
              }
              placeholder="Enter customer name"
              isError={hasError(fieldErrors.customer_name)}
              disabled={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              {...commonTextInputProps}
              inputLabel="Mobile Number"
              required={true}
              value={edit.getValue('mobile_number')}
              onChange={(e) =>
                handleValidatedChange(e, edit, 'mobile_number', 'number')
              }
              placeholder="Enter mobile number"
              isError={mobileLiveError || hasError(fieldErrors.mobile_number)}
              inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              disabled={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              {...commonTextInputProps}
              inputLabel="Address"
              required={true}
              value={edit.getValue('address')}
              onChange={(e) =>
                // handleValidatedChange(e, edit, 'address', 'string')
                edit.update({ address: e.target.value })
              }
              placeholder="Enter address"
              isError={hasError(fieldErrors.address)}
              disabled={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              label="Country"
              options={dropdownData?.countries || []}
              value={edit.getValue('country_id')}
              onChange={handleCountryChange}
              isError={hasError(fieldErrors.country_id)}
              required={true}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              label="State"
              options={dropdownData?.states || []}
              value={edit.getValue('state_id')}
              onChange={handleStateChange}
              isError={hasError(fieldErrors.state_id)}
              required={true}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              label="District"
              options={dropdownData?.districts || []}
              value={edit.getValue('district_id')}
              onChange={handleDistrictChange}
              isError={hasError(fieldErrors.district_id)}
              required={true}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              {...commonTextInputProps}
              inputLabel="PIN Code"
              required={true}
              value={edit.getValue('pin_code')}
              onChange={(e) =>
                handleValidatedChange(e, edit, 'pin_code', 'number')
              }
              placeholder="Enter PIN code"
              isError={pinLiveError || hasError(fieldErrors.pin_code)}
              inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
              disabled={isReadOnly}
            />
          </Grid>
        </Grid>
      </Grid>

      {type !== 'view' && (
        <FormAction
          firstBtntxt={type === 'edit' ? 'Update' : 'Create'}
          handleCreate={handleCreateCustomer}
          handleCancel={handleGoBack}
        />
      )}
    </Grid>
  );
};

export default CreateCustomer;
