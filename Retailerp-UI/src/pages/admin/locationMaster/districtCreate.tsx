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
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { DistrictService } from '@services/DistrictService';
import { Config } from '@constants/Config';
import { SERVICE_URL } from '@constants/Constant';
import { HTTP_STATUSES } from '@constants/Constance';
import { apiOptions } from '@utils/apiOptions';
import { apiRequest } from '@utils/apiRequest';
import toast from 'react-hot-toast';

const DistrictCreate = () => {
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

  type DistrictRow = {
    id: string;
    districtName: string;
    shortName: string;
    backendId?: number; // ID from backend for existing districts
  };

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [districtRows, setDistrictRows] = React.useState<DistrictRow[]>([
    { id: generateId(), districtName: '', shortName: '' },
  ]);
  const [selectedCountry, setSelectedCountry] = React.useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedState, setSelectedState] = React.useState<{
    label: string;
    value: number;
  } | null>(null);
  const [countryOptions, setCountryOptions] = React.useState<
    { label: string; value: number }[]
  >([]);
  const [stateOptions, setStateOptions] = React.useState<
    { label: string; value: number }[]
  >([]);
  const [districtDataToLoad, setDistrictDataToLoad] = React.useState<{
    state_id?: number;
    district_name?: string;
    short_name?: string;
    id?: number;
  } | null>(null);

  const isReadOnly = type === 'view';

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

        // Set default country if available and not in edit/view mode
        if (
          formattedCountries.length > 0 &&
          type !== 'edit' &&
          type !== 'view'
        ) {
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

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry || !selectedCountry.value) {
        setStateOptions([]);
        setSelectedState(null);
        return;
      }

      try {
        const res = await DropDownServiceAll.getAllStates({
          country_id: selectedCountry.value,
        });
        type StateItem = {
          id: number;
          state_name?: string;
          name?: string;
        };
        const states: StateItem[] =
          (
            res as {
              data?: {
                data?: { states?: StateItem[] };
                states?: StateItem[];
              };
            }
          )?.data?.data?.states ||
          (res as { data?: { states?: StateItem[] } })?.data?.states ||
          [];
        const formattedStates = states.map((item: StateItem) => ({
          label: String(item.state_name || item.name || ''),
          value: Number(item.id),
        }));
        setStateOptions(formattedStates);

        // Set default state if available and not in edit/view mode
        if (formattedStates.length > 0 && type !== 'edit' && type !== 'view') {
          setSelectedState(formattedStates[0]);
        } else if (formattedStates.length === 0) {
          setSelectedState(null);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStateOptions([]);
        setSelectedState(null);
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // Fetch district data in edit or view mode
  useEffect(() => {
    const fetchDistrictData = async () => {
      if (
        (type === 'edit' || type === 'view') &&
        rowId &&
        countryOptions.length > 0
      ) {
        try {
          const districtId = Number(rowId);
          if (isNaN(districtId)) {
            toast.error('Invalid district ID');
            return;
          }

          const response = await DistrictService.getById(districtId);
          type DistrictData = {
            id?: number;
            country_id?: number;
            state_id?: number;
            district_name?: string;
            short_name?: string;
          };
          const districtData: DistrictData =
            (
              response as {
                data?: {
                  data?: { district?: DistrictData };
                  district?: DistrictData;
                };
              }
            )?.data?.data?.district ||
            (response as { data?: { district?: DistrictData } })?.data
              ?.district ||
            {};

          // Set selected country
          if (districtData.country_id) {
            const country = countryOptions.find(
              (c: { label: string; value: number }) =>
                c.value === Number(districtData.country_id)
            );
            if (country) {
              setSelectedCountry(country);
            }
          }

          // Store district data to load after states are fetched
          if (districtData.state_id) {
            setDistrictDataToLoad({
              state_id: districtData.state_id,
              district_name: districtData.district_name,
              short_name: districtData.short_name,
              id: districtData.id,
            });
          } else if (districtData.district_name && districtData.short_name) {
            // If no state_id, set district rows directly
            setDistrictRows([
              {
                id: generateId(),
                districtName: districtData.district_name || '',
                shortName: districtData.short_name || '',
                backendId: districtData.id,
              },
            ]);
          }
        } catch (error) {
          const err = error as { message?: string };
          toast.error(err?.message || 'Failed to fetch district data');
        }
      }
    };

    fetchDistrictData();
  }, [type, rowId, countryOptions]);

  // Set state and district rows after states are loaded
  useEffect(() => {
    if (districtDataToLoad && stateOptions.length > 0) {
      const state = stateOptions.find(
        (s: { label: string; value: number }) =>
          s.value === Number(districtDataToLoad.state_id)
      );
      if (state) {
        setSelectedState(state);
      }

      // Set district rows
      if (districtDataToLoad.district_name && districtDataToLoad.short_name) {
        setDistrictRows([
          {
            id: generateId(),
            districtName: districtDataToLoad.district_name || '',
            shortName: districtDataToLoad.short_name || '',
            backendId: districtDataToLoad.id,
          },
        ]);
      }

      // Clear the data to load
      setDistrictDataToLoad(null);
    }
  }, [districtDataToLoad, stateOptions]);

  const handleSave = async () => {
    // Validate country selection
    if (!selectedCountry || !selectedCountry.value) {
      toast.error('Please select a country');
      return;
    }

    // Validate state selection
    if (!selectedState || !selectedState.value) {
      toast.error('Please select a state');
      return;
    }

    // Validate district rows
    const validRows = districtRows.filter(
      (row) => row.districtName.trim() && row.shortName.trim()
    );

    if (validRows.length === 0) {
      toast.error('Please add at least one district with name and short name');
      return;
    }

    // Check if any row is incomplete
    const incompleteRows = districtRows.some(
      (row) =>
        (row.districtName.trim() && !row.shortName.trim()) ||
        (!row.districtName.trim() && row.shortName.trim())
    );

    if (incompleteRows) {
      toast.error('Please fill both district name and short name for all rows');
      return;
    }

    setIsLoading(true);

    try {
      // If in edit mode and we have a rowId, update the district
      if (type === 'edit' && rowId) {
        const districtRow = validRows[0]; // For edit mode, typically one district
        const districtId = Number(rowId);

        if (isNaN(districtId)) {
          toast.error('Invalid district ID');
          setIsLoading(false);
          return;
        }

        await DistrictService.update(districtId, {
          data: {
            district_name: districtRow.districtName.trim(),
            state_id: selectedState.value,
          },
          successMessage: 'District updated successfully',
          failureMessage: 'Failed to update district',
        });

        navigateTo('/admin/locationMaster');
      } else {
        // Create mode - handle multiple districts
        // Backend expects: { districts: [{ country_id, state_id, short_name, district_name }, ...] }
        const districtsPayload = validRows.map((row) => ({
          country_id: selectedCountry.value,
          state_id: selectedState.value,
          short_name: row.shortName.trim(),
          district_name: row.districtName.trim(),
        }));

        const options = await apiOptions({
          url: `${Config.BASE_URL}${SERVICE_URL.DISTRICT}`,
          method: 'post',
          data: { districts: districtsPayload },
        });

        const toastMessageConfig = {
          success: {
            message: `District Created Successfully`,
          },
          failure: {
            message: 'Failed to create districts',
          },
        };

        const response = await apiRequest(options, toastMessageConfig);

        // Check if response is successful
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
      toast.error(err?.message || 'Failed to save district');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistrictInputChange = (
    id: string,
    field: keyof Omit<DistrictRow, 'id'>,
    value: string
  ) => {
    setDistrictRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddDistrictRow = () => {
    const lastRow = districtRows[districtRows.length - 1];
    if (lastRow.districtName.trim() && lastRow.shortName.trim()) {
      setDistrictRows((prev) => [
        ...prev,
        { id: generateId(), districtName: '', shortName: '' },
      ]);
    }
  };

  const handleDeleteDistrictRow = (id: string) => {
    setDistrictRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
      <PageHeader
        title={
          type === 'view'
            ? 'VIEW DISTRICT MASTER'
            : type === 'edit'
              ? 'EDIT DISTRICT MASTER'
              : 'CREATE DISTRICT MASTER'
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
            SELECT COUNTRY & STATE
          </Typography>
        </CardContent>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Country"
              options={countryOptions}
              value={selectedCountry}
              onChange={(_e, value) => setSelectedCountry(value)}
              isReadOnly={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="State"
              options={stateOptions}
              value={selectedState}
              onChange={(_e, value) => setSelectedState(value)}
              isReadOnly={
                isReadOnly || !selectedCountry || stateOptions.length === 0
              }
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
            ADD DISTRICT
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
              District Name
            </Grid>
            <Grid sx={columnCellStyle} size={4}>
              Short Name
            </Grid>

            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
              Action
            </Grid>
          </Grid>
          {districtRows.map((row: DistrictRow, index: number) => (
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
                  placeholderText="Enter District Name"
                  value={row.districtName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDistrictInputChange(
                      row.id,
                      'districtName',
                      e.target.value
                    )
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                  inputBoxTextStyle={{
                    color: row.districtName
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
                  placeholderText="Enter Short Name"
                  value={row.shortName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDistrictInputChange(
                      row.id,
                      'shortName',
                      e.target.value
                    )
                  }
                  disabled={isReadOnly}
                  {...tableTextInputProps}
                  inputBoxTextStyle={{
                    color: row.shortName
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
                {index === districtRows.length - 1 ? (
                  <IconButton
                    onClick={handleAddDistrictRow}
                    disabled={isReadOnly}
                  >
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
                    onClick={() => handleDeleteDistrictRow(row.id)}
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

export default DistrictCreate;
