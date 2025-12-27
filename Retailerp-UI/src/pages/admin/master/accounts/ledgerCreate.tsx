import {
  AutoSearchSelectWithLabel,
  styles,
  TextInput,
} from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleValidatedChange } from '@utils/form-util';
import { commonTextInputProps } from '@components/CommonStyles';
import { useEffect, useState } from 'react';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

const LedgerCreate = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, type } = location.state;
  const [ledgerGroupData, setLedgerGroupData] = useState<any>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const isReadOnly = type === 'view';

  const initialValues = {
    ledger_id: rowData.id || '',
    ledger_name: rowData.ledger_name || '',
    ledger_group_id: rowData.ledger_group_no || '',
  };
  const edit = useEdit(initialValues);
  const hasError = (specificError: boolean) => isError && specificError;

  const fieldErrors = {
    ledger_id: isError && !edit.allFilled('ledger_id'),
    ledger_name: isError && !edit.allFilled('ledger_name'),
    ledger_group_id: isError && !edit.allFilled('ledger_group_id'),
  };

  const RequiredFields = ['ledger_id', 'ledger_name', 'ledger_group_id'];

  const handleCreateLedgerGroup = async () => {
    if (isReadOnly) return;
    try {
      // Validate form before submission
      if (!edit.allFilled(...RequiredFields)) {
        setIsError(true);
        return toast.error('Please fill all required fields.');
      }

      const ledgerPayload = {
        ledger_group_no: edit.getValue('ledger_group_id'),
        ledger_name: edit.getValue('ledger_name'),
        ledger_no: edit.getValue('ledger_id'),
      };
      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.AccountService.updateLedger({
              id: rowData.id,
              data: ledgerPayload,
            })
          : await API_SERVICES.AccountService.createLedger({
              data: ledgerPayload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Ledger updated successfully!'
            : 'Ledger created successfully!'
        );
        handleGoBack();
      }
    } catch (error: any) {
      console.error('Ledger group operation error:', error);
      toast.error(error.message || 'Operation failed. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/master/accounts', { replace: true });
  };

  const fetchLedgerGrpData = async () => {
    try {
      let response: any;
      if (edit.getValue('ledger_group_id')) {
        response = await API_SERVICES.DropDownService.getLedgerGrpById(
          edit.getValue('ledger_group_id')
        );
      } else {
        response = await API_SERVICES.DropDownService.getAllLedgerGrpType();
      }
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const ledgerGrpTypes = edit.getValue('ledger_group_id')
          ? [response?.data?.data?.ledgerGroup]
          : response?.data?.data?.ledgerGroups;
        const filteredData =
          ledgerGrpTypes?.map((item: any) => ({
            value: item.id,
            label: item.ledger_group_name,
          })) ?? [];
        setLedgerGroupData(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLedgerGrpData();
  }, []);
  const selectedLedgerGrp = ledgerGroupData?.find(
    (item) => item.value == edit.getValue('ledger_group_id')
  );
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
            ? 'CREATE LEDGER'
            : type === 'edit'
              ? 'EDIT LEDGER'
              : 'VIEW LEDGER'
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
        <FormSectionHeader title="LEDGER DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Ledger ID"
              value={edit.getValue('ledger_id')}
              onChange={(e: any) =>
                handleValidatedChange(e, edit, 'ledger_id', 'alphanumeric')
              }
              isError={hasError(fieldErrors.ledger_id)}
              disabled={isReadOnly}
              {...commonTextInputProps}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Ledger Group Name"
              options={ledgerGroupData}
              value={selectedLedgerGrp || null}
              onChange={(e, value) =>
                edit.update({ ledger_group_id: value?.value ?? 0 })
              }
              isError={hasError(fieldErrors.ledger_group_id)}
              isReadOnly={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Ledger Name"
              value={edit.getValue('ledger_name')}
              onChange={(e: any) =>
                handleValidatedChange(
                  e,
                  edit,
                  'ledger_name',
                  'alphanumericWithSpace'
                )
              }
              isError={hasError(fieldErrors.ledger_name)}
              disabled={isReadOnly}
              {...commonTextInputProps}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormAction
        firstBtntxt={
          type === 'edit' ? 'Update' : type === 'create' ? 'Create' : 'Edit'
        }
        secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
        handleCreate={handleCreateLedgerGroup}
        handleCancel={handleGoBack}
        disableCreate={type === 'view'} // Disable the create button in view mode
      />
    </Grid>
  );
};

export default LedgerCreate;
