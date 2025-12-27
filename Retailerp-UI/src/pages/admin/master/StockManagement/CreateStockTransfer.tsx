import { commonTextInputProps } from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  DialogComp,
  MUHTable,
  styles,
  TextInput,
} from '@components/index';

import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import {
  OrderNameOptions,
  selectDialogData,
  VendorNameOptions,
} from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Box, Typography, useTheme, TextareaAutosize } from '@mui/material';
import { Grid } from '@mui/system';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import { GoldenPlanImages } from '@assets/Images';

import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

import StockTransferItemDetails from './StockTransferItemDetails';

const CreateStockTransfer = () => {
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

  // Calculate totals from ItemDetails
  const calculateStockTransferTotals = () => {
    const items = edit.getValue('invoice_settings') || [];

    const grandTotal = items.reduce((acc: number, item: any) => {
      return acc + (parseFloat(item.amount) || 0);
    }, 0);

    const totalProduct = items.length;

    const totalWeight = items.reduce((acc: number, item: any) => {
      return acc + (parseFloat(item.weight) || 0);
    }, 0);

    const totalQuantity = items.reduce((acc: number, item: any) => {
      return acc + (parseFloat(item.quantity) || 0);
    }, 0);

    return {
      grandTotal,
      totalProduct,
      totalWeight,
      totalQuantity,
    };
  };

  const stockTransferTotals = calculateStockTransferTotals();

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={'CREATE STOCK TRANSFER'}
          titleStyle={{ color: theme.Colors.black }}
          navigateUrl="/admin/stock/transfer"
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
            // size={16}
            padding="20px"
            weight={theme.fontWeight.mediumBold}
            color={theme.Colors.black}
            family={theme.fontFamily.roboto}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',

              alignItems: 'center',
              display: 'flex',
            }}
          >
            STOCK TRANSFER DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Transfer No"
                value={edit.getValue('transfer_no')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'transfer_no', 'alphanumeric')
                }
                //  isError={companyError}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <MUHDatePickerComponent
                required
                labelText="Date"
                value={edit.getValue('date')}
                handleChange={(newDate: any) => edit.update({ date: newDate })}
                // isError={hasError(fieldErrors.grn_date)}
                handleClear={() => edit.update({ date: null })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                label="Branch From"
                options={VendorNameOptions}
                value={edit.getValue('branch_from')}
                onChange={(e, value) => edit.update({ branch_from: value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                label="Branch To"
                options={VendorNameOptions}
                value={edit.getValue('branch_to')}
                onChange={(e, value) => edit.update({ branch_to: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Staff Name"
                options={OrderNameOptions}
                value={edit.getValue('order_by')}
                onChange={(e, value) => edit.update({ order_by: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Reference No"
                value={edit.getValue('reference_no')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'reference_no', 'alphanumeric')
                }
                //  isError={companyError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Transport Details"
                options={OrderNameOptions}
                value={edit.getValue('order_by')}
                onChange={(e, value) => edit.update({ order_by: value })}
              />
            </Grid>
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
            <StockTransferItemDetails edit={edit} />
          </Grid>
        </Grid>

        {/* Remarks and Summary Section */}
        <Grid container spacing={2}>
          {/* Remarks Section - Left */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                // border: `1px solid ${theme.Colors.grayLight}`,
                borderRadius: '8px',
                backgroundColor: theme.Colors.whitePrimary,
                padding: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  mb: 2,
                  borderBottom: '2px solid #471923',
                  width: 'fit-content',
                }}
              >
                REMARKS
              </Typography>
              <Box
                sx={{
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  mt: 2,
                }}
              >
                <TextareaAutosize
                  placeholder="Lorem ipsum dolor sit amet. Ut adipisci corrupti vel repudiandae culpa id enim ipsum vel expedita sint. Aut odio recusandae et aliquam dolor eum eligendi doloribus cum perspiciatis quia est quae asperiores. Et ullam officiis et doloribus dolorem aut laborum cupiditate eos inventore."
                  style={{
                    width: '100%',
                    minHeight: '118px',
                    border: 'none',
                    outline: 'none',
                    padding: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    borderRadius: '4px',
                  }}
                  value={edit.getValue('remarks') || ''}
                  onChange={(e) => edit.update({ remarks: e.target.value })}
                />
              </Box>
            </Box>
          </Grid>

          {/* Summary Panel - Right */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                backgroundColor: '#FFF5F7',
                border: `1px solid ${theme.Colors.grayLight}`,
                borderRadius: '8px',
                padding: 2,
              }}
            >
              <Grid container spacing={2}>
                {/* Grand Total */}
                <Grid size={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={6}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1C21',
                        }}
                      >
                        Grand Total
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: theme.Colors.whitePrimary,
                          border: '1px solid #E4E4E4',
                          borderRadius: '4px',
                          padding: '8px 12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1A1C21',
                          }}
                        >
                          ₹
                          {stockTransferTotals.grandTotal.toLocaleString(
                            'en-IN',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Total Product */}
                <Grid size={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={6}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1C21',
                        }}
                      >
                        Total Product
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: theme.Colors.whitePrimary,
                          border: '1px solid #E4E4E4',
                          borderRadius: '4px',
                          padding: '8px 12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1A1C21',
                          }}
                        >
                          {stockTransferTotals.totalProduct}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Total Weight */}
                <Grid size={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={6}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1C21',
                        }}
                      >
                        Total Weight
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: theme.Colors.whitePrimary,
                          border: '1px solid #E4E4E4',
                          borderRadius: '4px',
                          padding: '8px 12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1A1C21',
                          }}
                        >
                          {stockTransferTotals.totalWeight.toFixed(2)} g
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Total Quantity */}
                <Grid size={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={6}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1C21',
                        }}
                      >
                        Total Quantity
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: theme.Colors.whitePrimary,
                          border: '1px solid #E4E4E4',
                          borderRadius: '4px',
                          padding: '8px 12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1A1C21',
                          }}
                        >
                          {stockTransferTotals.totalQuantity}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt="Approve"
          secondBtntx="Reject"
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

export default CreateStockTransfer;
