import React, { useEffect } from 'react';
import {
  columnCellStyle,
  commonTextInputProps,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  TextInput,
  styles,
} from '@components/index';
import PageHeader from '@components/PageHeader';
import { IconButton, Typography, useTheme, CardContent } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import FormAction from '@components/ProjectCommon/FormAction';
import { useNavigate, useLocation } from 'react-router-dom';
import { StateService } from '@services/StateService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { HTTP_STATUSES } from '@constants/Constance';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';
import toast from 'react-hot-toast';

const StateCreatePage = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);

  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const rowId = params.get('rowId');

  const handleCancel = () => {
    navigateTo('/admin/locationMaster');
  };

  type StateRow = {
    id: string;
    stateName: string;
    stateCode: string;
    stateId?: number; // ID from backend for existing states
  };

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [stateRows, setStateRows] = React.useState<StateRow[]>([
    { id: generateId(), stateName: '', stateCode: '' },
  ]);
  const [selectedCountry, setSelectedCountry] = React.useState<{
    label: string;
    value: number;
  } | null>(null);
  const [countryOptions, setCountryOptions] = React.useState<
    { label: string; value: number }[]
  >([]);

  const isReadOnly = type === 'view';

  const handleStateInputChange = (
    id: string,
    field: keyof Omit<StateRow, 'id'>,
    value: string
  ) => {
    setStateRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddStateRow = () => {
    const lastRow = stateRows[stateRows.length - 1];
    if (lastRow.stateName.trim() && lastRow.stateCode.trim()) {
      setStateRows((prev) => [
        ...prev,
        { id: generateId(), stateName: '', stateCode: '' },
      ]);
    }
  };

  const handleDeleteStateRow = (id: string) => {
    setStateRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await DropDownServiceAll.getAllCountry();
        type CountryItem = {
          id: number;
          country_name?: string;
          name?: string;
        };
        const countries: CountryItem[] =
          (
            res as {
              data?: {
                data?: { countries?: CountryItem[] };
                countries?: CountryItem[];
              };
            }
          )?.data?.data?.countries ||
          (res as { data?: { countries?: CountryItem[] } })?.data?.countries ||
          [];
        const formattedCountries = countries.map((item: CountryItem) => ({
          label: String(item.country_name || item.name || ''),
          value: Number(item.id),
        }));
        setCountryOptions(formattedCountries);

        // Set default country if not in edit mode and countries are available
        if (type !== 'edit' && formattedCountries.length > 0) {
          setSelectedCountry(formattedCountries[0]);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountryOptions([]);
      }
    };

    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch state data in edit or view mode
  useEffect(() => {
    const fetchStateData = async () => {
      if (
        (type === 'edit' || type === 'view') &&
        rowId &&
        countryOptions.length > 0
      ) {
        try {
          const stateId = Number(rowId);
          if (isNaN(stateId)) {
            toast.error('Invalid state ID');
            return;
          }

          const response = await StateService.getById(stateId);
          type StateData = {
            id?: number;
            country_id?: number;
            state_name?: string;
            state_code?: string;
          };
          const stateData: StateData =
            (
              response as {
                data?: { data?: { state?: StateData }; state?: StateData };
              }
            )?.data?.data?.state ||
            (response as { data?: { state?: StateData } })?.data?.state ||
            {};

          // Set selected country
          if (stateData.country_id) {
            const country = countryOptions.find(
              (c: { label: string; value: number }) =>
                c.value === Number(stateData.country_id)
            );
            if (country) {
              setSelectedCountry(country);
            }
          }

          // Set state rows
          if (stateData.state_name && stateData.state_code) {
            setStateRows([
              {
                id: generateId(),
                stateName: stateData.state_name || '',
                stateCode: stateData.state_code || '',
                stateId: stateData.id,
              },
            ]);
          }
        } catch (error) {
          const err = error as { message?: string };
          toast.error(err?.message || 'Failed to fetch state data');
        }
      }
    };

    fetchStateData();
  }, [type, rowId, countryOptions]);

  const handleSave = async () => {
    // Validate country selection
    if (!selectedCountry || !selectedCountry.value) {
      toast.error('Please select a country');
      return;
    }

    // Validate state rows
    const validRows = stateRows.filter(
      (row) => row.stateName.trim() && row.stateCode.trim()
    );

    if (validRows.length === 0) {
      toast.error('Please add at least one state with name and code');
      return;
    }

    // Check if any row is incomplete
    const incompleteRows = stateRows.some(
      (row) =>
        (row.stateName.trim() && !row.stateCode.trim()) ||
        (!row.stateName.trim() && row.stateCode.trim())
    );

    if (incompleteRows) {
      toast.error('Please fill both state name and state code for all rows');
      return;
    }

    setIsLoading(true);

    try {
      // If in edit mode and we have a rowId, update the state
      if (type === 'edit' && rowId) {
        const stateRow = validRows[0]; // For edit mode, typically one state
        const stateId = Number(rowId);

        if (isNaN(stateId)) {
          toast.error('Invalid state ID');
          setIsLoading(false);
          return;
        }

        // Get country name and short name from selected country
        // Find the country in options to get the name
        const countryData = countryOptions.find(
          (c: { label: string; value: number }) =>
            c.value === selectedCountry.value
        );
        const countryName = countryData?.label || selectedCountry.label || '';
        const countryShortName = countryName; // Using label as short name if not available separately

        await StateService.update(stateId, {
          data: {
            state_name: stateRow.stateName.trim(),
            state_code: stateRow.stateCode.trim(),
            country_short_name: countryShortName,
            country_name: countryName,
          },
          successMessage: 'State updated successfully',
          failureMessage: 'Failed to update state',
        });

        // toast.success('State updated successfully');
        navigateTo('/admin/locationMaster');
      } else {
        // Create mode - handle multiple states

        const statesPayload = validRows.map((row) => ({
          country_id: selectedCountry.value,
          state_code: row.stateCode.trim(),
          state_name: row.stateName.trim(),
        }));

        const options = await apiOptions({
          url: `${Config.BASE_URL}${SERVICE_URL.STATE}`,
          method: 'post',
          data: { states: statesPayload },
        });

        const toastMessageConfig = {
          success: {
            message: 'States Created Successfully',
          },
          failure: {
            message: 'Failed to create states',
          },
        };

        const response = await apiRequest(options, toastMessageConfig);

        if (
          response &&
          'status' in response &&
          typeof response.status === 'number' &&
          (response.status < HTTP_STATUSES.BAD_REQUEST ||
            ('data' in response &&
              typeof response.data === 'object' &&
              response.data !== null &&
              'statusCode' in response.data &&
              response.data.statusCode === HTTP_STATUSES.SUCCESS))
        ) {
          navigateTo('/admin/locationMaster');
        }
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || 'An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
      <PageHeader
        title={
          type === 'view'
            ? 'VIEW STATE MASTER'
            : type === 'edit'
              ? 'EDIT STATE MASTER'
              : 'CREATE STATE MASTER'
        }
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={false}
        showBackButton={false}
        navigateUrl="/admin/locationMaster"
      />
      <Grid
        flexDirection={'row'}
        sx={{
          width: '100%',
          border: `1px solid #E4E4E4`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
          mb: 3,
          mt: 2,
        }}
      >
        <CardContent sx={{ p: 3, borderBottom: `1px solid #E4E4E4` }}>
          <Typography
            sx={{
              fontFamily: theme.fontFamily.roboto,
              fontWeight: theme.fontWeight.mediumBold,
              fontSize: theme.MetricsSizes.small_xxx,
              color: theme.Colors.blackPrimary,
            }}
          >
            SELECT COUNTRY
          </Typography>
        </CardContent>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              // placeholder={'Select'}
              label="Country"
              options={countryOptions}
              value={selectedCountry}
              onChange={(_e, value) => setSelectedCountry(value)}
              isReadOnly={isReadOnly}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        flexDirection={'row'}
        sx={{
          width: '100%',
          border: `1px solid #E4E4E4`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
          mb: 3,
          mt: 2,
        }}
      >
        <CardContent sx={{ p: 3, borderBottom: `1px solid #E4E4E4` }}>
          <Typography
            sx={{
              fontFamily: theme.fontFamily.roboto,
              fontWeight: theme.fontWeight.mediumBold,
              fontSize: theme.MetricsSizes.small_xxx,
              color: theme.Colors.blackPrimary,
            }}
          >
            ADD STATE
          </Typography>
        </CardContent>
        <Grid
          width={'100%'}
          pb={2}
          sx={{
            ...formLayoutStyle,
            borderTop: 'none',
            borderRadius: '0px 0px 8px 8px',
            padding: '10px',
          }}
        >
          <Grid container sx={tableColumnStyle}>
            <Grid sx={columnCellStyle} size={1.2}>
              S.No
            </Grid>
            <Grid sx={columnCellStyle} size={4}>
              State Name
            </Grid>
            <Grid sx={columnCellStyle} size={4}>
              State Code
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
              Action
            </Grid>
          </Grid>
          {stateRows.map((row: StateRow, index: number) => (
            <Grid container sx={tableRowStyle} key={row.id}>
              <Grid
                size={1.2}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index + 1}
              </Grid>
              <Grid
                size={4}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  placeholderText="Enter State Name"
                  value={row.stateName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleStateInputChange(row.id, 'stateName', e.target.value)
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                  inputBoxTextStyle={{
                    color: row.stateName
                      ? theme.Colors.blackPrimary
                      : theme.Colors.grayWhiteDim,
                  }}
                />
              </Grid>
              <Grid
                size={4}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  placeholderText="Enter State Code"
                  value={row.stateCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleStateInputChange(row.id, 'stateCode', e.target.value)
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                  inputBoxTextStyle={{
                    color: row.stateCode
                      ? theme.Colors.blackPrimary
                      : theme.Colors.grayWhiteDim,
                  }}
                />
              </Grid>
              <Grid
                size={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index === stateRows.length - 1 ? (
                  <IconButton onClick={handleAddStateRow} disabled={isReadOnly}>
                    <Add
                      sx={{
                        color: isReadOnly
                          ? theme.Colors.grayWhiteDim
                          : theme.Colors.primary,
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => handleDeleteStateRow(row.id)}
                    disabled={isReadOnly}
                  >
                    <Delete
                      sx={{
                        color: isReadOnly
                          ? theme.Colors.grayWhiteDim
                          : theme.Colors.primary,
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {!isReadOnly && (
        <Grid
          container
          width={'100%'}
          justifyContent={'center'}
          sx={{ mt: 3, mb: 2 }}
        >
          <FormAction
            firstBtntxt="Save"
            secondBtntx="Cancel"
            handleCancel={handleCancel}
            handleCreate={handleSave}
            disableCreate={isLoading}
            {...commonTextInputProps}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default StateCreatePage;
