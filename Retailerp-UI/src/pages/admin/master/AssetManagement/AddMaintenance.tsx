import { Grid } from '@mui/system';
import PageHeader from '@components/PageHeader';
import { TextareaAutosize, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import { handleValidatedChange } from '@utils/form-util';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

type SelectOption = {
  value: string | number;
  label: string;
};

const maintenanceTypeOptions: SelectOption[] = [
  { value: 'preventive', label: 'Preventive' },
  { value: 'corrective', label: 'Corrective' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'scheduled', label: 'Scheduled' },
];

const machinePerformanceOptions: SelectOption[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const UserInitialValues = {
  maintenance_date: dayjs() as Dayjs | null,
  maintenance_type: null as SelectOption | null,
  technician_name: '',
  machine_performance: null as SelectOption | null,
  remarks: '',
};

const AddMaintenance = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const edit = useEdit(UserInitialValues);

  // Get values from edit hook
  const maintenanceDateValue = edit.getValue(
    'maintenance_date'
  ) as Dayjs | null;
  const maintenanceTypeValue = edit.getValue(
    'maintenance_type'
  ) as SelectOption | null;
  const machinePerformanceValue = edit.getValue(
    'machine_performance'
  ) as SelectOption | null;

  const handleCreateMaintenance = () => {
    // TODO: Implement API call to save maintenance record
    const maintenanceData = {
      maintenance_date: edit.getValue('maintenance_date'),
      maintenance_type: edit.getValue('maintenance_type'),
      technician_name: edit.getValue('technician_name'),
      machine_performance: edit.getValue('machine_performance'),
      remarks: edit.getValue('remarks'),
    };
    console.log('Maintenance data:', maintenanceData);
  };

  const handleGoBack = () => {
    navigate('/admin/assetManagement/view');
  };

  return (
    <Grid
      container
      flexDirection={'column'}
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        title={'ADD MAINTENANCE'}
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/assetManagement/view"
        titleStyle={{ color: theme.Colors.black }}
      />
      <Grid
        container
        size="grow"
        flexDirection={'column'}
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader title="MAINTENANCE DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              required
              labelText="Date"
              value={maintenanceDateValue}
              handleChange={(newDate: Dayjs | null) => {
                edit.update({ maintenance_date: newDate });
              }}
              handleClear={() => edit.update({ maintenance_date: null })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Maintenance Type"
              options={maintenanceTypeOptions}
              value={maintenanceTypeValue}
              onChange={(_, value) => edit.update({ maintenance_type: value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              required
              inputLabel="Technician Name"
              fontSize={14}
              fontWeight={500}
              fontFamily="Roboto Slab"
              borderRadius={2}
              inputLabelStyle={{
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Roboto Slab',
              }}
              value={edit.getValue('technician_name')}
              onChange={(e) => {
                handleValidatedChange(
                  e,
                  edit,
                  'technician_name',
                  'alphanumericWithSpace'
                );
              }}
              onBlur={(e) => {
                const trimmedValue = e.target.value.trim();
                edit.update({ technician_name: trimmedValue });
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Machine Performance"
              options={machinePerformanceOptions}
              value={machinePerformanceValue}
              onChange={(_, value) =>
                edit.update({ machine_performance: value })
              }
            />
          </Grid>

          <Grid
            size={{ xs: 12 }}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 2,
              width: '100%',
            }}
          >
            <Typography
              sx={{
                color: theme.Colors.black,
                fontWeight: theme.fontWeight.medium,
                fontSize: theme.MetricsSizes.small_xxx,
                fontFamily: theme.fontFamily.roboto,
                minWidth: '120px',

                width: '17%',
              }}
            >
              Remarks
              <span
                style={{
                  color: theme.Colors.redPrimary,
                  marginLeft: 4,
                }}
              >
                *
              </span>
            </Typography>
            <TextareaAutosize
              maxRows={6}
              minRows={3}
              required
              style={{
                flex: 1,
                borderRadius: 4,
                border: `1px solid ${theme.Colors.grayPrimary}`,
                resize: 'vertical',
                overflow: 'auto',
                outline: 'none',
                fontSize: '14px',
                fontFamily: theme.fontFamily.roboto,
                padding: '10px',
                color: theme.Colors.black,
              }}
              value={edit.getValue('remarks')}
              onChange={(e) => {
                edit.update({ remarks: e.target.value });
              }}
              onFocus={(e) => {
                e.target.style.border = `1px solid ${theme.Colors.primary}`;
              }}
              onBlur={(e) => {
                e.target.style.border = `1px solid ${theme.Colors.grayPrimary}`;
              }}
              placeholder="Enter remarks"
            />
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        firstBtntxt={'Save'}
        secondBtntx="Reject"
        handleCreate={handleCreateMaintenance}
        handleCancel={handleGoBack}
      />
    </Grid>
  );
};

export default AddMaintenance;
