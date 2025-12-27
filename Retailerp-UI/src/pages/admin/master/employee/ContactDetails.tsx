import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import { handleValidatedChange } from '@utils/form-util';
import Grid from '@mui/material/Grid2';
import { commonTextInputProps } from '@components/CommonStyles';
import { Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

type EditController = {
  getValue: (path: string) => unknown;
  update: (updates: Record<string, unknown>) => void;
};

type Props = {
  edit: EditController;
  isError: boolean;
  fieldErrors: Record<string, unknown>;
  type?: string | null;
};

const relationshipOptions = [
  { label: 'Father', value: 'Father' },
  { label: 'Mother', value: 'Mother' },
  { label: 'Guardian', value: 'Guardian' },
];

const ContactDetails = ({ edit, isError, fieldErrors, type }: Props) => {
  const hasError = (specificError: unknown) =>
    isError && Boolean(specificError);
  const theme = useTheme();
  type Option = { label: string; value: number | string };
  type CountryApi = {
    id: number | string;
    country_name?: string;
    name?: string;
    country?: string;
  };
  type StateApi = {
    id: number | string;
    state_name?: string;
    name?: string;
    state?: string;
  };
  const [stateData, setStateData] = useState<Option[]>([]);
  const [countryData, setCountryData] = useState<Option[]>([]);
  const [districtData, setDistrictData] = useState<Option[]>([]);
  const isReadOnly = type === 'view';

  useEffect(() => {
    // Fetch countries on mount
    const fetchCountries = async () => {
      try {
        const res = await DropDownServiceAll.getAllCountry();
        const countries: CountryApi[] =
          res?.data?.data?.countries || res?.data?.countries || [];
        const formattedCountries = countries.map((item: CountryApi) => ({
          label: String(item.country_name ?? item.name ?? item.country),
          value: Number(item.id),
        }));
        setCountryData(formattedCountries);
      } catch (err) {
        setCountryData([]);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const countryId = edit?.getValue('country_id');

    const fetchStates = async () => {
      if (!countryId) {
        setStateData([]);
        return;
      }

      try {
        const res = await DropDownServiceAll.getAllStates({
          country_id: Number(countryId),
        });

        const data = (
          res as {
            data?: { data?: { states?: StateApi[] }; states?: StateApi[] };
          }
        ).data;

        const rawList = (data?.data?.states ??
          data?.states ??
          []) as StateApi[];

        const formatted = rawList.map((item: StateApi) => ({
          label: String(item.state_name ?? item.name ?? item.state ?? ''),
          value: item.id,
        }));

        setStateData(formatted);
      } catch (err) {
        console.error('Error fetching states:', err);
        setStateData([]);
      }
    };

    fetchStates();
  }, [edit?.getValue('country_id')]);

  useEffect(() => {
    const countryId = edit?.getValue('country_id');
    const stateId = edit?.getValue('state_id');

    const fetchDistricts = async () => {
      if (!countryId || !stateId) {
        setDistrictData([]);
        return;
      }

      try {
        const res = await DropDownServiceAll.getAllDistricts({
          country_id: Number(countryId),
          state_id: Number(stateId),
        });

        const districts = res?.data?.data?.districts || [];
        const formattedDistricts = districts.map((item: any) => ({
          label: item.district_name,
          value: item.id,
        }));

        setDistrictData(formattedDistricts);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setDistrictData([]);
      }
    };

    fetchDistricts();
  }, [edit?.getValue('country_id'), edit?.getValue('state_id')]);

  return (
    <Grid
      container
      width={'100%'}
      sx={{
        borderRadius: '8px',
        alignContent: 'flex-start',
        backgroundColor: theme.Colors.whitePrimary,
      }}
    >
      <Grid
        container
        size={{ xs: 12, md: 12 }}
        sx={{
          borderBottom: `1px solid ${theme.Colors.grayLight}`,
          padding: '20px',
          marginTop: '20px',
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
          EMPLOYEE CONTACT DETAILS
        </Typography>
      </Grid>
      <Grid
        container
        width={'100%'}
        sx={{
          padding: '20px',
        }}
      >
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Mobile Number"
            disabled={isReadOnly}
            value={edit?.getValue('contact_details.mobile_no') || ''}
            onChange={(e: any) =>
              handleValidatedChange(
                e,
                edit,
                'contact_details.mobile_no',
                'number'
              )
            }
            isError={hasError(fieldErrors?.mobile_no)}
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <TextInput
            inputLabel="Email ID"
            disabled={isReadOnly}
            value={edit?.getValue('contact_details.email_id') || ''}
            onChange={(e: any) =>
              handleValidatedChange(
                e,
                edit,
                'contact_details.email_id',
                'email'
              )
            }
            isError={hasError(fieldErrors?.email_id)}
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Address"
            disabled={isReadOnly}
            value={edit?.getValue('contact_details.address') || ''}
            onChange={(e) => {
              const next = String(e.target.value || '').replace(/^\s+/, '');
              edit.update({ 'contact_details.address': next });
            }}
            isError={hasError(fieldErrors?.address)}
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <AutoSearchSelectWithLabel
            required
            label="Country"
            isReadOnly={isReadOnly}
            options={countryData}
            value={
              countryData.find(
                (option) => option.value === Number(edit.getValue('country_id'))
              ) ?? null
            }
            onChange={async (_e, selected) => {
              const newCountryId = selected?.value
                ? Number(selected.value)
                : null;
              edit.update({
                country_id: newCountryId,
                state_id: null,
                district_id: null,
              });
            }}
            isError={hasError(fieldErrors?.country_id)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <AutoSearchSelectWithLabel
            required
            label="State"
            isReadOnly={isReadOnly}
            options={stateData ?? []}
            value={
              stateData.find(
                (itm) => itm.value === Number(edit.getValue('state_id'))
              ) ?? null
            }
            onChange={(_e, value) =>
              edit?.update({
                state_id: value?.value ? Number(value.value) : null,
                district_id: null,
              })
            }
            isError={hasError(fieldErrors?.state_id)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <AutoSearchSelectWithLabel
            required
            label="District"
            isReadOnly={isReadOnly}
            options={districtData}
            value={
              districtData.find(
                (option) =>
                  option.value ===
                  Number(
                    edit.getValue('district_id') ||
                      edit.getValue('contact_details.district')
                  )
              ) ?? null
            }
            onChange={(_e, value) =>
              edit.update({
                district_id: value?.value ?? null,
              })
            }
            isError={hasError(fieldErrors?.district_id)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="PIN Code"
            disabled={isReadOnly}
            value={edit?.getValue('contact_details.pin_code') || ''}
            onChange={(e: any) =>
              handleValidatedChange(
                e,
                edit,
                'contact_details.pin_code',
                'pincode'
              )
            }
            isError={hasError(fieldErrors?.pin_code)}
            {...commonTextInputProps}
          />
        </Grid>
      </Grid>

      <Grid
        container
        size={{ xs: 12, md: 12 }}
        sx={{
          borderBottom: `1px solid ${theme.Colors.grayLight}`,
          marginTop: '20px',
          padding: '20px',
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
          EMERGENCY CONTACT DETAILS
        </Typography>
      </Grid>
      <Grid
        container
        width={'100%'}
        sx={{
          padding: '20px',
        }}
      >
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Emergency Contact Person"
            disabled={isReadOnly}
            value={edit?.getValue('emergency_contact.person') || ''}
            onChange={(e: any) =>
              handleValidatedChange(
                e,
                edit,
                'emergency_contact.person',
                'string'
              )
            }
            isError={hasError(fieldErrors?.emergency_person)}
            {...commonTextInputProps}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
          <AutoSearchSelectWithLabel
            required
            label="Relationship"
            isReadOnly={isReadOnly}
            options={relationshipOptions}
            value={(() => {
              const rel = edit?.getValue('emergency_contact.relationship');
              if (!rel) return null;
              if (typeof rel === 'object' && rel.value) {
                return (
                  relationshipOptions.find(
                    (option) => option.value === rel.value
                  ) ?? null
                );
              }
              return (
                relationshipOptions.find((option) => option.value === rel) ??
                null
              );
            })()}
            onChange={(_e, value) =>
              edit?.update({
                'emergency_contact.relationship': value?.value ?? null,
              })
            }
            isError={hasError(fieldErrors?.emergency_relationship)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
          <TextInput
            inputLabel="Emergency Contact Number"
            disabled={isReadOnly}
            value={edit?.getValue('emergency_contact.number') || ''}
            onChange={(e: any) =>
              handleValidatedChange(
                e,
                edit,
                'emergency_contact.number',
                'number'
              )
            }
            isError={hasError(fieldErrors?.emergency_number)}
            {...commonTextInputProps}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactDetails;
