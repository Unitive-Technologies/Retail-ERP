import { commonTextInputProps } from '@components/CommonStyles';
import { styles, TextInput } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/system/Grid';
import { handleValidatedChange } from '@utils/form-util';
import { HolidaysService, HolidayData } from '@services/HRManagementServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';

const CreateHoliday = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  
  const holidayData = location.state?.holidayData;
  const isEdit = location.state?.isEdit;
  
  const InitialValues: HolidayData = {
    holiday_name: holidayData?.holiday_name || '',
    holiday_date: holidayData?.holiday_date ? dayjs(holidayData.holiday_date) : null,
    description: holidayData?.description || '',
  };

  const edit = useEdit(InitialValues);

  useEffect(() => {
    if (isEdit && holidayData) {
      edit.update({
        holiday_name: holidayData.holiday_name,
        holiday_date: holidayData.holiday_date ? dayjs(holidayData.holiday_date) : null,
        description: holidayData.description,
      });
    }
  }, []);

  const handleCreate = async () => {
    try {
      const payload = {
        holiday_name: edit.getValue('holiday_name'),
        holiday_date: edit.getValue('holiday_date')?.toISOString() || null,
        description: edit.getValue('description'),
      };

      const response: any = isEdit
        ? await HolidaysService.updateHoliday(holidayData.id, payload)
        : await HolidaysService.create({
            data: payload,
            successMessage: 'Holiday created successfully',
            failureMessage: 'Failed to create holiday',
          });

      if (response?.data?.statusCode === 201 || response?.data?.statusCode === 200) {
        navigateTo('/admin/hr/holidays');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigateTo('/admin/hr/holidays');
  };

  return (
    <>
      <Grid
        container
        flexDirection="column"
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          borderRadius: '4px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <PageHeader
          title="CREATE HOLIDAY"
          titleStyle={{ color: theme.Colors.black }}
          navigateUrl="/admin/hr/holidays"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
          showBackButton={false}
        />

        <Grid container spacing={2} sx={{ padding: '20px' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Leave Name"
              value={edit.getValue('holiday_name')}
              onChange={(e: any) =>
                handleValidatedChange(e, edit, 'holiday_name', 'string')
              }
              {...commonTextInputProps}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              required
              labelText="Leave Date"
              value={edit.getValue('holiday_date')}
              useNewIcon={true}
              minDate={dayjs()}
              handleChange={(newDate: Dayjs | null) => {
                if (newDate && newDate.isBefore(dayjs(), 'day')) {
                  toast.error('Past dates are not allowed.');
                  edit.update({ holiday_date: null });
                  return;
                }
                edit.update({ holiday_date: newDate });
              }}
              handleClear={() => edit.update({ holiday_date: null })}
            />
          </Grid>

          <Grid container size={{ xs: 12, md: 12 }} alignItems="center">
            <Grid size={{ xs: 12, md: 2.2 }}>
              <Typography
                sx={{
                  color: theme.Colors.blackPrimary,
                  fontWeight: 400,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Description
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 9.2 }}>
              <TextInput
                height={40}
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                value={edit.getValue('description')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'description', 'string')
                }
                isError={false}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <FormAction
        firstBtntxt="Save"
        secondBtntx="Cancel"
        handleCancel={handleCancel}
        handleCreate={handleCreate}
        {...commonTextInputProps}
      />
    </>
  );
};

export default CreateHoliday;
