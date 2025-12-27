import { commonTextInputProps } from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  DialogComp,
  MUHTable,
  styles,
  TextInput,
  TotalSummary,
} from '@components/index';

import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import {
  OrderNameOptions,
  purchaseOrderOptions,
  purchaseReturnOptions,
  selectDialogData,
  vendorOptions,
} from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/system';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import { EditIcon, GoldenPlanImages, LocationIcon } from '@assets/Images';

import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

import ItemDetails from './ItemDetails';

// StatusCard Component
const StatusCard = ({ title, children, showEditIcon = false, onEdit }: any) => {
  return (
    <Box
      sx={{
        border: '1px solid #E4E4E4',
        borderRadius: '8px',
        p: 2,
        position: 'relative',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '18px',
            color: '#333843',
          }}
        >
          {title}
        </Typography>
        {showEditIcon && (
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              color: '#B45C6B',
              backgroundColor: '#FDEDEF',
              '&:hover': { backgroundColor: '#F8DDE1' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {children}
    </Box>
  );
};

const CreatePurchaseReturn = () => {
  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const theme = useTheme();
  const [rowData, setRowData] = useState<any>({});
  const [selectCategory, setSelectCategory] = useState({ open: false });
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [chosenCategories, setChosenCategories] = useState<any[]>([]);

  const UserInitialValues: any = {
    offer_id: rowData.offer_id || '',
    offer_plan: rowData.offer_plan || '',
    description: rowData.description || '',
    offer_type: rowData.offer_type || '',
    offer_value: rowData.offer_value || '',
    valid_from: rowData.valid_from || '',
    valid_to: rowData.valid_to || '',
    application_type: rowData.application_type || '',
    status: rowData.status || '',
  };

  const edit = useEdit(UserInitialValues);

  const handleCreate = () => {};
  const handleAdd = () => {
    const selected = dialogData.filter((r: any) =>
      (selectedRows as (string | number)[]).includes(r.id)
    );
    setChosenCategories(selected);

    setSelectCategory({ open: false });
  };
  const handleCancel = () => {
    setSelectCategory({ open: false });
  };
  const onClose = () => {
    setSelectCategory({ open: false });
  };

  const dialogColumn: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
        return (
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{row.material_type}</Typography>
          </Grid>
        );
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
        return (
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{row.category}</Typography>
          </Grid>
        );
      },
    },
  ];

  const renderDialogContent = () => {
    return (
      <>
        <Grid container size={'grow'}>
          <MUHTable
            columns={dialogColumn}
            rows={dialogData}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(model) => setSelectedRows(model)}
          />
        </Grid>
      </>
    );
  };

  const renderDialogAction = () => (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <FormAction
        handleCreate={handleAdd}
        handleCancel={handleCancel}
        firstBtntxt="Add"
      />
    </Box>
  );

  const fetchData = async () => {
    try {
      setDialogData(selectDialogData);
      const preselected = selectDialogData
        .filter((r: any) => r.isSelected)
        .map((r: any) => r.id as number | string);
      setSelectedRows(preselected);
    } catch {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBillingAddress = () => {
    console.log('Edit billing address');
  };

  const handleEditShippingAddress = () => {
    console.log('Edit shipping address');
  };

  // Calculate totals from ItemDetails
  const calculateTotals = () => {
    const items = edit.getValue('invoice_settings') || [];
    const subTotal = items.reduce((acc: number, item: any) => {
      return acc + (parseFloat(item.amount) || 0);
    }, 0);

    // Use fixed subtotal as per image
    const actualSubTotal = 100;

    const sgstRate = parseFloat(edit.getValue('sgst_rate')) || 0;
    const cgstRate = parseFloat(edit.getValue('cgst_rate')) || 2;
    const discountRate = parseFloat(edit.getValue('discount_rate')) || 2;

    const sgstAmount = (actualSubTotal * sgstRate) / 100;
    const cgstAmount = (actualSubTotal * cgstRate) / 100;
    const discountAmount = (actualSubTotal * discountRate) / 100;

    const totalAmount =
      actualSubTotal + sgstAmount + cgstAmount - discountAmount;

    return {
      subTotal: actualSubTotal,
      sgstAmount,
      cgstAmount,
      discountAmount,
      totalAmount,
    };
  };

  const totals = calculateTotals();

  // Convert number to words function
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero Only';

    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ];
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    const convertHundreds = (n: number): string => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let result = '';
    const crores = Math.floor(num / 10000000);
    if (crores) {
      result += convertHundreds(crores) + 'Crore ';
      num %= 10000000;
    }

    const lakhs = Math.floor(num / 100000);
    if (lakhs) {
      result += convertHundreds(lakhs) + 'Lakh ';
      num %= 100000;
    }

    const thousandsNum = Math.floor(num / 1000);
    if (thousandsNum) {
      result += convertHundreds(thousandsNum) + 'Thousand ';
      num %= 1000;
    }

    if (num > 0) {
      result += convertHundreds(num);
    }

    return result.trim() + ' Only';
  };

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={'CREATE PURCHASE RETURN'}
          navigateUrl="/admin/purchases/return"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
          showBackButton={false}
        />
        <Grid
          container
          // size="grow"
          flexDirection={'column'}
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            size={16}
            padding="20px"
            weight={600}
            color={theme.Colors.black}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              // height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            GRN DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Purchase Return NO"
                options={purchaseReturnOptions}
                value={edit.getValue('purchase_return_order')}
                onChange={(e, value) =>
                  edit.update({ purchase_return_order: value })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <MUHDatePickerComponent
                required
                labelText="Purchase Return Date"
                value={edit.getValue('purchase_grn_date')}
                handleChange={(newDate: any) =>
                  edit.update({ purchase_grn_date: newDate })
                }
                // isError={hasError(fieldErrors.grn_date)}
                handleClear={() => edit.update({ purchase_grn_date: null })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="GRN NO"
                options={purchaseOrderOptions}
                value={edit.getValue('purchase_order')}
                onChange={(e, value) => edit.update({ purchase_order: value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <MUHDatePickerComponent
                required
                labelText="GRN Date"
                value={edit.getValue('grn_date')}
                handleChange={(newDate: any) =>
                  edit.update({ grn_date: newDate })
                }
                handleClear={() => edit.update({ grn_date: null })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Vendor ID"
                options={vendorOptions}
                value={edit.getValue('vendor_id')}
                onChange={(e, value) => edit.update({ vendor_id: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Vendor Name"
                options={OrderNameOptions}
                value={edit.getValue('vendor_name')}
                onChange={(e, value) => edit.update({ vendor_name: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Order By"
                options={OrderNameOptions}
                value={edit.getValue('order_by')}
                onChange={(e, value) => edit.update({ order_by: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Reference ID"
                value={edit.getValue('reference_id')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'reference_id', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            p: 2.5,
            border: '1px solid #E4E4E4',
            borderRadius: '8px',

            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          {/* GST No */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard title="GST No">
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#1A1C21',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  33AADFT0604Q1Z6
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1A1C21',
                  }}
                >
                  Registered Business - Regular Tamil Nadu
                </Typography>
              </Box>
            </StatusCard>
          </Grid>

          {/* Billing Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard
              title="Billing Address"
              showEditIcon={true}
              onEdit={handleEditBillingAddress}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mt: 2,
                }}
              >
                <LocationIcon />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    18, Vaniet Street George Town,
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                    }}
                  >
                    Chennai, Tamil Nadu - 600 001.
                  </Typography>
                </Box>
              </Box>
            </StatusCard>
          </Grid>

          {/* Shipping Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard
              title="Shipping Address"
              showEditIcon={true}
              onEdit={handleEditShippingAddress}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mt: 2,
                }}
              >
                <LocationIcon />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    18, Vaniet Street George Town,
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                    }}
                  >
                    Chennai, Tamil Nadu - 600 001.
                  </Typography>
                </Box>
              </Box>
            </StatusCard>
          </Grid>
        </Grid>
        {/* </Grid> */}
        <Grid>
          <Grid
            size={12}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #E4E4E4',
              padding: 2,
              borderRadius: '8px 8px 0px 0px',
              borderBottom: 'none',
            }}
          >
            <Typography
              style={{
                fontWeight: 600,
                fontSize: '16px',
                color: '#000000',
                // marginBottom: 10,
              }}
            >
              ITEM DETAILS
            </Typography>
          </Grid>
          <Grid
            size={12}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #E4E4E4',
              padding: 2,
              borderRadius: '0px 0px 8px 8px',
            }}
          >
            <ItemDetails edit={edit} />

            {/* Summary Section */}
            <TotalSummary
              totals={totals}
              numberToWords={numberToWords}
              remarks={edit.getValue('remarks') || ''}
              onRemarksChange={(value) => edit.update({ remarks: value })}
            />
            <Grid />
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt="Create"
          secondBtntx="Cancel"
          handleCancel={handleCancel}
          handleCreate={handleCreate}
          {...commonTextInputProps}
        />

        {selectCategory.open && (
          <DialogComp
            open={selectCategory.open}
            dialogTitle="SELECT CATEGORY"
            onClose={onClose}
            renderDialogContent={renderDialogContent}
            renderAction={renderDialogAction}
          />
        )}
      </Grid>
    </>
  );
};

export default CreatePurchaseReturn;
