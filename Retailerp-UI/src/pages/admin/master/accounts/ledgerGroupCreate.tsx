import { styles, TextInput } from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleValidatedChange } from '@utils/form-util';
import { commonTextInputProps } from '@components/CommonStyles';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

const LedgerGroupCreate = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, type } = location.state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    ledger_group_id: false,
    ledger_group_name: false,
  });

  const initialValues = {
    ledger_group_id: rowData.ledger_group_id || '',
    ledger_group_name: rowData.ledger_group_name || '',
  };
  const edit = useEdit(initialValues);

  const validateForm = () => {
    const errors = {
      ledger_group_id: !edit.allFilled('ledger_group_id'),
      ledger_group_name: !edit.allFilled('ledger_group_name'),
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleCreateLedgerGroup = async () => {
    try {
      // Validate form before submission
      if (!validateForm()) {
        toast.error('Please fill all required fields');
        return;
      }

      setIsSubmitting(true);
      const ledgerGroupPayload = {
        ledger_group_no: edit.getValue('ledger_group_id').trim(),
        ledger_group_name: edit.getValue('ledger_group_name').trim(),
      };
      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.AccountService.updateLedgerGrp({
              id: rowData.id,
              data: ledgerGroupPayload,
            })
          : await API_SERVICES.AccountService.createLedgerGrp({
              data: ledgerGroupPayload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Ledger group updated successfully!'
            : 'Ledger group created successfully!'
        );
        handleGoBack();
      }
    } catch (error) {
      console.error('Ledger group operation error:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/master/accounts', { replace: true });
  };

  return (
    <Grid
      container
      flexDirection={'column'}
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        title={
          type === 'create'
            ? 'CREATE LEDGER GROUP'
            : type === 'edit'
              ? 'EDIT LEDGER GROUP'
              : 'VIEW LEDGER GROUP'
        }
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/master/accounts"
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
        <FormSectionHeader title="LEDGER GROUP DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Ledger Group ID"
              value={edit.getValue('ledger_group_id')}
              onChange={(e: any) => {
                handleValidatedChange(
                  e,
                  edit,
                  'ledger_group_id',
                  'alphanumeric'
                );
                if (formErrors.ledger_group_id) {
                  setFormErrors((prev) => ({
                    ...prev,
                    ledger_group_id: false,
                  }));
                }
              }}
              isError={formErrors.ledger_group_id}
              disabled={type === 'view' || isSubmitting}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Ledger Group Name"
              value={edit.getValue('ledger_group_name')}
              onChange={(e: any) => {
                handleValidatedChange(e, edit, 'ledger_group_name', 'string');
                if (formErrors.ledger_group_name) {
                  setFormErrors((prev) => ({
                    ...prev,
                    ledger_group_name: false,
                  }));
                }
              }}
              isError={formErrors.ledger_group_name}
              disabled={type === 'view' || isSubmitting}
              {...commonTextInputProps}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        firstBtntxt={
          type === 'create' ? 'Create' : type === 'edit' ? 'Update' : 'View'
        }
        handleCreate={handleCreateLedgerGroup}
        handleCancel={handleGoBack}
        disableCreate={type === 'view' || isSubmitting}
      />
    </Grid>
  );
};

export default LedgerGroupCreate;
