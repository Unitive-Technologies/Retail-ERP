import { commonTextInputProps } from '@components/CommonStyles';
import { styles, TextInput } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/system/Grid';

import { handleValidatedChange } from '@utils/form-util';

const CreateHoliday = () => {
  const theme = useTheme();
  const InitialValues: any = {
    leave_name: '',
    leave_date: null,
    description: '',
  };
  const edit = useEdit(InitialValues);
  const handleCreate = () => {};
  const handleCancel = () => {};

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          borderRadius: '4px',

          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <PageHeader
          title={'CREATE HOLIDAY'}
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
              value={edit.getValue('leave_name')}
              onChange={(e: any) =>
                handleValidatedChange(e, edit, 'leave_name', 'string')
              }
              //   isError={hasError(fieldError.qr_id)}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              required
              labelText="Leave Date"
              value={edit.getValue('leave_date')}
              handleChange={(newDate: any) =>
                edit.update({ leave_date: newDate })
              }
              // isError={hasError(fieldErrors.joining_date)}
              handleClear={() => edit.update({ leave_date: null })}
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
                //   onChange={handleInstallmentChange}
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
