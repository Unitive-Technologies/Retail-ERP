import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import { ChipComponent, styles, TextInput } from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import {
  CardContent,
  TextareaAutosize,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/system/Grid';
import { handleValidatedChange } from '@utils/form-util';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuotationDetails from './QuotationDetailsTable';

const RequestQuotation = () => {
  const theme = useTheme();
  const location = useLocation();
  const [rowData, setRowData] = useState<any>({});
  const [isError, setIsError] = useState(false);
  const params = new URLSearchParams(location.search);
  const type = params.get('type');

  const RequestInitialValue = {
    qr_id: rowData.qr_id || '',
    request_date: rowData.request_date || null,
    expiry_date: rowData.expiry_date || null,
    vendor_name: rowData.vendor_name || [],
    item_details: rowData.item_details || [],
    item_description: rowData.item_description || '',
  };

  const edit = useEdit(RequestInitialValue);

  const fieldError = {
    qr_id: !edit.allFilled('qr_id'),
    request_date: !edit.allFilled('request_date'),
    expiry_date: !edit.allFilled('expiry_date'),
    vendor_name: !edit.allFilled('vendor_name'),
  };

  const vendorName = [
    { value: 1, label: 'Vendor 1' },
    { value: 2, label: 'Vendor 2' },
  ];

  const hasError = (specificError: boolean) => isError && specificError;
  const handleRequest = () => {};
  const handleCancel = () => {};

  return (
    <>
      <Grid container flexDirection={'column'} sx={{ flex: 1, minHeight: 0 }}>
        <PageHeader
          // title={type === 'requestQuotation' ? 'REQUEST QUOTATION' : ''}
          title="REQUEST QUOTATION"
          navigateUrl="/admin/purchases/quotation"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
          showBackButton={false}
        />
        <Grid container sx={{ width: '100%' }}>
          <Grid
            flexDirection={'row'}
            sx={{
              width: '100%',
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '8px',
              backgroundColor: theme.Colors.whitePrimary,
              mb: 3,
              mt: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <MUHTypography
                size={'16px'}
                weight={600}
                sx={{
                  borderBottom: `1px solid ${theme.Colors.grayLight}`,

                  fontFamily: 'Roboto-regular',
                  backgroundColor: theme.Colors.whitePrimary,
                }}
              >
                VENDOR DETAILS
              </MUHTypography>
            </CardContent>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  isReadOnly={type === 'view'}
                  inputLabel="QR ID"
                  value={edit.getValue('qr_id')}
                  placeholderText="Qr Id"
                  onChange={(e: any) =>
                    handleValidatedChange(e, edit, 'qr_id', 'string')
                  }
                  isError={hasError(fieldError.qr_id)}
                  {...commonTextInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <MUHDatePickerComponent
                  required
                  isReadOnly={type === 'view'}
                  labelText="Request Date"
                  value={edit.getValue('request_date')}
                  handleChange={(newDate: any) =>
                    edit.update({ request_date: newDate })
                  }
                  isError={hasError(fieldError.request_date)}
                  handleClear={() => edit.update({ request_date: null })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <MUHDatePickerComponent
                  required
                  isReadOnly={type === 'view'}
                  labelText="Expiry Date"
                  value={edit.getValue('expiry_date')}
                  handleChange={(newDate: any) =>
                    edit.update({ expiry_date: newDate })
                  }
                  isError={hasError(fieldError.expiry_date)}
                  handleClear={() => edit.update({ expiry_date: null })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <MUHSelectBoxComponent
                  selectLabel="Vendor Name"
                  multiple={true}
                  isReadOnly={type === 'view'}
                  placeholderText="Vendor Name"
                  isSearch={true}
                  value={edit.getValue('vendor_name')}
                  onChange={(e: any) =>
                    edit.update({ vendor_name: e.target.value })
                  }
                  selectItems={vendorName}
                  {...commonSelectBoxProps}
                  isCheckbox={false}
                />
              </Grid>
              <Grid
                size={{ xs: 12 }}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 1 }}
              >
                {(edit.getValue('vendor_name') || []).map((val: any) => {
                  const option = vendorName.find(
                    (name: any) => name.value === val
                  );
                  const label = option?.label ?? String(val);
                  return (
                    <ChipComponent
                      key={val}
                      label={label}
                      onClose={() => {
                        const currentValue = edit.getValue('vendor_name') || [];
                        edit.update({
                          vendor_name: currentValue.filter(
                            (x: any) => x !== val
                          ),
                        });
                      }}
                      style={{
                        borderRadius: '4px',
                        backgroundColor: theme.Colors.primaryLightDark,
                        color: theme.Colors.black,
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          {/* ITEM Details */}

          <Grid
            flexDirection={'row'}
            sx={{
              width: '100%',
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '8px',
            }}
          >
            <MUHTypography
              size={'16px'}
              weight={600}
              sx={{
                borderBottom: `1px solid ${theme.Colors.grayLight}`,
                padding: '20px',
                fontFamily: 'Roboto-regular',
                backgroundColor: theme.Colors.whitePrimary,
              }}
            >
              ITEM DETAILS
            </MUHTypography>
            <Grid container>
              <QuotationDetails edit={edit} type={type} />
            </Grid>
            <Grid
              container
              sx={{
                padding: '20px',
              }}
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  display: 'inline-block',
                  borderBottom: `3px solid ${theme.Colors.primary}`,
                  backgroundColor: theme.Colors.whitePrimary,
                  pb: '2px',
                  mb: '8px',
                }}
              >
                REMARKS
              </Typography>
              <TextareaAutosize
                maxRows={6}
                minRows={3}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  borderRadius: 4,
                  border: `1px solid ${theme.Colors.grayPrimary}`,
                  resize: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'Roboto',
                  padding: '10px',
                }}
                value={edit.getValue('item_description')}
                onChange={(e) => {
                  edit.update({ item_description: e.target.value });
                }}
                onFocus={(e) => (e.target.style.border = '1px solid #FF742F')}
                onBlur={(e) => (e.target.style.border = '1px solid #AEAFB0')}
              />
            </Grid>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt="Request"
          handleCancel={handleCancel}
          handleCreate={handleRequest}
        ></FormAction>
      </Grid>
    </>
  );
};
export default RequestQuotation;
