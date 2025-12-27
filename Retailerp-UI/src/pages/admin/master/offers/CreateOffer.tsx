import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import { DialogComp, MUHTable, styles, TextInput } from '@components/index';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { selectDialogData } from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Box, TextareaAutosize, Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/system';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import { GoldenPlanImages } from '@assets/Images';

const CreateOffer = () => {
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

  const applicationType = [
    {
      value: 1,
      label: 'Material Type',
    },
    {
      value: 2,
      label: 'Category',
    },
    {
      value: 3,
      label: 'Sub Category',
    },
    {
      value: 4,
      label: 'Product',
    },
    {
      value: 5,
      label: 'Making Charge',
    },
    {
      value: 6,
      label: 'Wastage Charge',
    },
  ];

  const StatusType = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 2,
      label: 'Deactive',
    },
  ];

  const OfferType = [
    {
      value: 1,
      label: 'Amount',
    },
    {
      value: 2,
      label: 'Percentage',
    },
  ];

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

  const onEditSelectedCategories = () => {
    setSelectCategory({ open: true });
  };

  const showSubCategory = Number(edit.getValue('application_type')) === 3;

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
    ...(showSubCategory
      ? [
          {
            field: 'sub_category',
            headerName: 'Sub Category',
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
                    alt={row.sub_category || 'subcategory'}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography sx={{ fontSize: 12 }}>
                    {row.sub_category}
                  </Typography>
                </Grid>
              );
            },
          } as GridColDef,
        ]
      : []),
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
              ? 'CREATE OFFER'
              : type === 'edit'
                ? 'EDIT OFFER'
                : 'VIEW OFFER'
          }
          navigateUrl="/admin/master/offers"
          showCreateBtn={false}
          showlistBtn={false}
          showDownloadBtn={false}
          showBackButton={true}
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
          <MUHTypography
            size={16}
            padding="20px"
            weight={600}
            color={theme.Colors.black}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            OFFER DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Offer ID"
                value={edit.getValue('offer_id')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'offer_id', 'string')
                }
                //  isError={companyError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Offer Plan"
                value={edit.getValue('offer_plan')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'offer_plan', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'start',
                gap: 8,
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  color: theme.Colors.black,
                  fontWeight: '400',
                  fontFamily: 'Roboto',
                  alignItems: 'start',
                  fontSize: '14pxs',
                  width: '15%',
                }}
              >
                Offer Description
              </Typography>
              <TextareaAutosize
                maxRows={6}
                minRows={3}
                style={{
                  width: '100%',
                  borderRadius: 4,
                  // minHeight: '25%',
                  border: `1px solid ${theme.Colors.grayPrimary}`,
                  resize: 'vertical',
                  overflow: 'auto',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'Poppins-Medium',
                  padding: '10px',
                }}
                value={edit.getValue('description')}
                onChange={(e) => {
                  edit.update({ description: e.target.value });
                }}
                onFocus={(e) => (e.target.style.border = '1px solid #FF742F')}
                onBlur={(e) => (e.target.style.border = '1px solid #AEAFB0')}
              />
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              gap={13.5}
            >
              <MUHTypography size={14} weight={400} color={theme.Colors.black}>
                Offer Type
                <span style={{ color: theme.Colors.redRequiredPrimary }}>
                  {' '}
                  *
                </span>
              </MUHTypography>
              <Grid size={{ xs: 12, md: 7.2 }}>
                <MUHSelectBoxComponent
                  value={edit.getValue('offer_type')}
                  onChange={(e: any) =>
                    edit.update({ offer_type: e.target.value })
                  }
                  selectItems={OfferType}
                  // isError={branch_error}
                  {...commonSelectBoxProps}
                />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Offer Value"
                value={edit.getValue('offer_value')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'offer_value', 'number')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Valid From"
                value={edit.getValue('valid_from')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'valid_from', 'string')
                }
                //  isError={companyError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Valid To"
                value={edit.getValue('valid_to')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'valid_to', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.leftItem}
              flexDirection={'row'}
              gap={8}
            >
              <MUHTypography color={theme.Colors.black}>
                Application Type
                <span style={{ color: theme.Colors.redRequiredPrimary }}>
                  {' '}
                  *
                </span>
              </MUHTypography>
              <Grid size={{ xs: 12, md: 7.2 }}>
                <MUHSelectBoxComponent
                  value={edit.getValue('application_type')}
                  onChange={(e: any) =>
                    edit.update({ application_type: e.target.value })
                  }
                  selectItems={applicationType}
                  // isError={branch_error}
                  {...commonSelectBoxProps}
                />
                <MUHTypography
                  color={theme.Colors.primary}
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    cursor: 'pointer',
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectCategory({ open: true });
                  }}
                >
                  Select Category
                </MUHTypography>
              </Grid>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={styles.rightItem}
              flexDirection={'row'}
              gap={17}
            >
              <MUHTypography size={14} weight={400} color={theme.Colors.black}>
                Status
                <span style={{ color: theme.Colors.redRequiredPrimary }}>
                  {' '}
                  *
                </span>
              </MUHTypography>
              <Grid size={{ xs: 12, md: 7.2 }}>
                <MUHSelectBoxComponent
                  value={edit.getValue('status')}
                  onChange={(e: any) => edit.update({ status: e.target.value })}
                  selectItems={StatusType}
                  // isError={branch_error}
                  {...commonSelectBoxProps}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {chosenCategories.length ? (
          <Grid
            container
            sx={{ border: `1px solid ${theme.Colors.grayLight}` }}
          >
            <Grid
              container
              alignItems={'center'}
              sx={{
                borderBottom: `1px solid ${theme.Colors.grayLight}`,
                width: '100%',
                height: '50px',
              }}
              pr={'20px'}
              pl={'20px'}
            >
              <PageHeader
                title="Applicable To"
                showDownloadBtn={false}
                showCreateBtn={false}
                isEditBtn={true}
                onEditSelectedCategories={onEditSelectedCategories}
              />
            </Grid>
            <MUHTable
              columns={dialogColumn}
              rows={chosenCategories}
              isCheckboxSelection={false}
            />
          </Grid>
        ) : null}

        <FormAction
          handleCancel={handleCancel}
          handleCreate={handleCreate}
        ></FormAction>

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
export default CreateOffer;
