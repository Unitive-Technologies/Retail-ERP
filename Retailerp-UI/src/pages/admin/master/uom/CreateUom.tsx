import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import { handleValidatedChange } from '@utils/form-util';
import { useState } from 'react';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

const CreateUomComponent = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const location = useLocation();
  const { rowData, type } = location.state;
  const [isError, setIsError] = useState(false); // Track validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadOnly = type === 'view';

  const UserInitialValues: any = {
    uom_code: rowData.uom_code ?? '',
    uom_name: rowData.uom_name ?? '',
    short_code: rowData.short_code ?? '',
    status: rowData.status ?? '',
  };

  const edit = useEdit(UserInitialValues);

  const statusData = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 2,
      label: 'Inactive',
    },
  ];

  const RequiredFields = ['uom_code', 'uom_name', 'short_code', 'status'];

  const hasError = (specificError: boolean) => isError && specificError;

  const fieldErrors = {
    uom_code: isError && !edit.allFilled('uom_code'),
    uom_name: isError && !edit.allFilled('uom_name'),
    short_code: isError && !edit.allFilled('short_code'),
    status: isError && !edit.allFilled('status'),
  };

  const validateForm = () => {
    const uomCode = edit.getValue('uom_code')?.trim() || '';
    const uomName = edit.getValue('uom_name')?.trim() || '';
    const shortCode = edit.getValue('short_code')?.trim() || '';

    const errors = {
      uom_code: !uomCode || uomCode.length === 0,
      uom_name: !uomName || uomName.length === 0,
      short_code: !shortCode || shortCode.length === 0,
      status: !edit.getValue('status'),
    };
    return !Object.values(errors).some((error) => error);
  };

  const handleCreateUOM = async () => {
    if (!edit.allFilled(...RequiredFields)) {
      setIsError(true);
      return toast.error('Please fill all required fields.');
    }

    try {
      // Validate form before submission
      if (!validateForm()) {
        toast.error('Please fill all required fields');
        return;
      }

      setIsSubmitting(true);
      const uomPayload = {
        uom_code: edit.getValue('uom_code')?.trim(),
        uom_name: edit.getValue('uom_name')?.trim(),
        short_code: edit.getValue('short_code')?.trim(),
        status: edit.getValue('status'),
      };

      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.UomService.update({
              id: rowData.id,
              data: uomPayload,
            })
          : await API_SERVICES.UomService.create({
              data: uomPayload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'UOM updated successfully!'
            : 'UOM created successfully!'
        );
        handleGoBack();
      }
    } catch (error) {
      console.error('UOM operation error:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigateTo(`/admin/master/uom`);
  };

  const selectedStatus = statusData.find(
    (item) => item.label === edit.getValue('status')
  );

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={
            type === 'create'
              ? 'CREATE UOM'
              : type === 'edit'
                ? 'EDIT UOM'
                : 'VIEW UOM'
          }
          showDownloadBtn={false}
          showCreateBtn={false}
          showlistBtn={true}
          navigateUrl="/admin/master/uom"
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
          <FormSectionHeader title="UOM DETAILS" />
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                required
                inputLabel="UOM ID"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('uom_code')}
                onChange={(e) => {
                  handleValidatedChange(e, edit, 'uom_code', 'alphanumeric');
                }}
                onBlur={(e) => {
                  const trimmedValue = e.target.value.trim();
                  edit.update({ uom_code: trimmedValue });
                }}
                isError={hasError(fieldErrors.uom_code)}
                disabled={isReadOnly || isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                required
                inputLabel="UOM Name"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('uom_name')}
                onChange={(e) => {
                  handleValidatedChange(e, edit, 'uom_name', 'validName');
                }}
                onBlur={(e) => {
                  const trimmedValue = e.target.value.trim();
                  edit.update({ uom_name: trimmedValue });
                }}
                isError={hasError(fieldErrors.uom_name)}
                disabled={isReadOnly || isSubmitting} // Disable in view mode
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                required
                inputLabel="Short Code"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('short_code')}
                onChange={(e) => {
                  handleValidatedChange(e, edit, 'short_code', 'validName');
                }}
                onBlur={(e) => {
                  const trimmedValue = e.target.value.trim();
                  edit.update({ short_code: trimmedValue });
                }}
                isError={hasError(fieldErrors.short_code)}
                disabled={isReadOnly || isSubmitting} // Disable in view mode
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Status"
                options={statusData}
                value={selectedStatus || null}
                onChange={(_, value) => edit.update({ status: value?.label })}
                isError={hasError(fieldErrors.status)}
                isReadOnly={isReadOnly || isSubmitting}
              />
            </Grid>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt={
            type === 'create' ? 'Create' : type === 'edit' ? 'Update' : 'View'
          }
          handleCreate={handleCreateUOM}
          handleCancel={handleGoBack}
          disableCreate={type === 'view' || isSubmitting}
        />
      </Grid>
    </>
  );
};

export default CreateUomComponent;
