import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import { DialogComp, MUHTable, styles, TextInput } from '@components/index';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
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
import dayjs from 'dayjs';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { API_SERVICES } from '@services/index';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { HTTP_STATUSES } from '@constants/Constance';

const CreateOffer = () => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const paramRowId = Number(params.get('rowId'));
  const theme = useTheme();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<any>({});
  const isReadOnly = type === 'view';
  const [selectCategory, setSelectCategory] = useState({ open: false });
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [chosenCategories, setChosenCategories] = useState<any[]>([]);
  const [offerPlans, setOfferPlans] = useState<any[]>([]);
  const [applicationTypes, setApplicationTypes] = useState<any[]>([]);

  const UserInitialValues: any = {
    offer_id: rowData.offer_id || '',
    offer_plan: rowData.offer_plan || '',
    description: rowData.description || '',
    offer_type: rowData.offer_type || '',
    offer_value: rowData.offer_value || '',
    valid_from: rowData.valid_from || null,
    valid_to: rowData.valid_to || null,
    application_type: rowData.application_type || '',
    status: rowData.status || '',
  };

  const edit = useEdit(UserInitialValues);

  const StatusType = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 2,
      label: 'Inactive',
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

  // Fetch API
  useEffect(() => {
    const fetchOfferPlans = async () => {
      try {
        const response: any = await DropDownServiceAll.getOfferPlans();
        const offerPlansData =
          response?.data?.data?.offerPlans || response?.data?.offerPlans || [];

        if (Array.isArray(offerPlansData) && offerPlansData.length > 0) {
          const formattedPlans = offerPlansData.map((plan: any) => ({
            value: plan.id,
            label: plan.plan_name,
          }));
          setOfferPlans(formattedPlans);
        } else {
          setOfferPlans([
            { value: 1, label: 'Direct Offer' },
            { value: 2, label: 'Conditional Offer' },
          ]);
        }
      } catch (error: any) {
        toast.error(error?.message || 'Failed to fetch offer plans');
        setOfferPlans([
          { value: 1, label: 'Direct Offer' },
          { value: 2, label: 'Conditional Offer' },
        ]);
      }
    };
    fetchOfferPlans();
  }, []);

  useEffect(() => {
    const fetchApplicableTypes = async () => {
      try {
        const response: any =
          await DropDownServiceAll.getOfferApplicableTypes();
        const applicableTypesData =
          response?.data?.data?.applicableTypes ||
          response?.data?.applicableTypes ||
          [];

        if (
          Array.isArray(applicableTypesData) &&
          applicableTypesData.length > 0
        ) {
          const formattedTypes = applicableTypesData.map((type: any) => ({
            value: type.id,
            label: type.type_name,
          }));
          setApplicationTypes(formattedTypes);
        } else {
          setApplicationTypes([
            { value: 1, label: 'Material Type' },
            { value: 2, label: 'Category' },
            { value: 3, label: 'Sub Category' },
            { value: 4, label: 'Product' },
            { value: 5, label: 'Making Charge' },
            { value: 6, label: 'Wastage Charge' },
          ]);
        }
      } catch (error: any) {
        toast.error(error?.message || 'Failed to fetch applicable types');
        setApplicationTypes([
          { value: 1, label: 'Material Type' },
          { value: 2, label: 'Category' },
          { value: 3, label: 'Sub Category' },
          { value: 4, label: 'Product' },
          { value: 5, label: 'Making Charge' },
          { value: 6, label: 'Wastage Charge' },
        ]);
      }
    };
    fetchApplicableTypes();
  }, []);

  const handleCreate = async () => {
    try {
      if (isReadOnly) return;

      const offerCode = edit.getValue('offer_id') || '';
      const offerPlanId = edit.getValue('offer_plan') || '';
      const offerDescription = edit.getValue('description') || '';
      const offerTypeValue = edit.getValue('offer_type');
      const offerValue = edit.getValue('offer_value') || '';
      const validFrom = edit.getValue('valid_from');
      const validTo = edit.getValue('valid_to');
      const applicableTypeId = edit.getValue('application_type') || '';
      const statusValue = edit.getValue('status');

      if (
        !offerCode ||
        !offerPlanId ||
        !offerDescription?.trim() ||
        !offerTypeValue ||
        !offerValue ||
        !validFrom ||
        !validTo ||
        !applicableTypeId ||
        !statusValue
      ) {
        toast.error('Please fill all required fields');
        return;
      }

      const offerTypeMap: { [key: number]: string } = {
        1: 'Amount',
        2: 'Percentage',
      };
      const offerType = offerTypeMap[Number(offerTypeValue)] || 'Percentage';

      const statusMap: { [key: number]: string } = {
        1: 'Active',
        2: 'Inactive',
      };
      const status = statusMap[Number(statusValue)] || 'Active';

      const formatDate = (date: any): string => {
        if (!date) return '';
        if (typeof date === 'string') {
          const parsed = dayjs(date);
          if (parsed.isValid()) {
            return parsed.format('YYYY-MM-DD');
          }
          return date;
        }
        if (date.format) {
          return date.format('YYYY-MM-DD');
        }
        const dayjsDate = dayjs(date);
        if (dayjsDate.isValid()) {
          return dayjsDate.format('YYYY-MM-DD');
        }
        return '';
      };

      const formattedValidFrom = formatDate(validFrom);
      const formattedValidTo = formatDate(validTo);

      if (!formattedValidFrom || !formattedValidTo) {
        toast.error('Please select valid dates');
        return;
      }

      const isEditMode = type === 'edit';
      const originalOfferCode = String(rowData?.offer_code || '').trim();
      const currentOfferCode = String(offerCode || '').trim();

      const payload: any = {
        ...(isEditMode
          ? originalOfferCode &&
            currentOfferCode &&
            originalOfferCode !== currentOfferCode
            ? { offer_code: currentOfferCode }
            : {}
          : { offer_code: currentOfferCode }),
        offer_plan_id: Number(offerPlanId),
        offer_description: offerDescription.trim(),
        offer_type: offerType,
        offer_value: Number(offerValue),
        valid_from: formattedValidFrom,
        valid_to: formattedValidTo,
        applicable_type_id: Number(applicableTypeId),
        status: status,
      };

      console.log('Creating offer with payload:', payload);

      const response: any = isEditMode
        ? await API_SERVICES.OfferService.update(paramRowId, {
            data: payload,
            successMessage: 'Offer updated successfully!',
            failureMessage: 'Failed to update offer',
          })
        : await API_SERVICES.OfferService.create({
            data: payload,
            successMessage: 'Offer created successfully!',
            failureMessage: 'Failed to create offer',
          });

      console.log('API Response:', response);

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        
        navigate('/admin/master/offers');
      } else {
        // Handle API error response
        const errorMessage =
          response?.data?.message ||
          response?.message ||
          (isEditMode ? 'Failed to update offer' : 'Failed to create offer');

        if (String(errorMessage).toLowerCase().includes('already exists')) {
          toast.error(
            'This offer code already exists. Please change the Offer ID and try again.'
          );
        } else {
          toast.error(errorMessage);
        }
        console.error('API Error Response:', response);
      }
    } catch (error: any) {
      console.error('Offer creation error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create offer. Please try again.';

      if (String(errorMessage).toLowerCase().includes('already exists')) {
        toast.error(
          'This offer code already exists. Please change the Offer ID and try again.'
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };
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

  const fetchDialogData = async () => {
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
    fetchDialogData();
  }, []);

  const fetchOfferData = async () => {
    try {
      const response: any = await API_SERVICES.OfferService.getById(paramRowId);

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        const offerData =
          response?.data?.data?.offer || response?.data?.offer || {};
        setRowData(offerData);

        const offerPlan = offerPlans.find(
          (plan: any) => plan.value === offerData.offer_plan_id
        );
        const offerType = OfferType.find(
          (type: any) => type.label === offerData.offer_type
        );
        const status = StatusType.find(
          (status: any) => status.label === offerData.status
        );
        const applicableType = applicationTypes.find(
          (type: any) => type.value === offerData.applicable_type_id
        );

        edit.update({
          offer_id: offerData.offer_code || '',
          offer_plan: offerPlan?.value || offerData.offer_plan_id || '',
          description: offerData.offer_description || '',
          offer_type: offerType?.value || '',
          offer_value: offerData.offer_value || '',
          valid_from: offerData.valid_from ? dayjs(offerData.valid_from) : null,
          valid_to: offerData.valid_to ? dayjs(offerData.valid_to) : null,
          application_type:
            applicableType?.value || offerData.applicable_type_id || '',
          status: status?.value || '',
        });
      } else {
        toast.error(response?.data?.message || 'Failed to fetch offer data');
      }
    } catch (error: any) {
      console.error('Error fetching offer data:', error);
      toast.error(error?.message || 'Failed to fetch offer data');
    }
  };

  useEffect(() => {
    if (
      type !== 'create' &&
      paramRowId &&
      offerPlans.length > 0 &&
      applicationTypes.length > 0
    ) {
      fetchOfferData();
    }
  }, [type, paramRowId, offerPlans.length, applicationTypes.length]);

  useEffect(() => {
    const shouldAutoGen = type === 'create';
    if (!shouldAutoGen) return;
    const current = edit.getValue('offer_id');
    if (current) return; // don't override if user already typed
    (async () => {
      try {
        const res: any = await API_SERVICES.OfferService.getOfferCode({
          prefix: 'OFF',
        });
        const code = res?.data?.data?.offer_code || res?.data?.offer_code;
        if (code && !edit.getValue('offer_id')) {
          edit.update({ offer_id: code });
        }
      } catch (e) {
        // silent fail: do not block create flow
        console.error('Failed to auto-generate offer code:', e);
      }
    })();
  }, [type]);

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
          <Grid container padding="20px" spacing={2}>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Offer ID"
                value={edit.getValue('offer_id')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'offer_id', 'string')
                }
                disabled={isReadOnly}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <MUHSelectBoxComponent
                selectLabel="Offer Plan"
                value={edit.getValue('offer_plan')}
                onChange={(e: any) =>
                  edit.update({ offer_plan: e.target.value })
                }
                selectItems={offerPlans}
                disabled={isReadOnly}
                {...commonSelectBoxProps}
              />
            </Grid>

            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 0.5,
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  color: theme.Colors.black,
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.small_xx,
                  fontFamily: theme.fontFamily.roboto,
                  minWidth: '120px',
                  width: '18%',
                }}
              >
                Offer Description
              </Typography>
              <TextareaAutosize
                maxRows={6}
                minRows={3}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  border: `1px solid ${theme.Colors.silverFoilWhite}`,
                  resize: 'vertical',
                  overflow: 'auto',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: theme.fontFamily.roboto,
                  padding: '10px',
                  color: isReadOnly ?  '#00000061' : theme.Colors.black,
                  backgroundColor: theme.Colors.whitePrimary,
                  cursor: isReadOnly ? 'not-allowed' : 'text',
                }}
                value={edit.getValue('description')}
                onChange={(e) => {
                  if (!isReadOnly) {
                    edit.update({ description: e.target.value });
                  }
                }}
                disabled={isReadOnly}
                onFocus={(e) => {
                  if (!isReadOnly) {
                    e.target.style.border = `1px solid ${theme.Colors.primary}`;
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHSelectBoxComponent
                selectLabel="Offer Type"
                value={edit.getValue('offer_type')}
                onChange={(e: any) =>
                  edit.update({ offer_type: e.target.value })
                }
                selectItems={OfferType}
                disabled={isReadOnly}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Offer Value"
                value={edit.getValue('offer_value')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'offer_value', 'number')
                }
                disabled={isReadOnly}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHDatePickerComponent
                labelText="Valid From"
                value={
                  edit.getValue('valid_from') &&
                  edit.getValue('valid_from') !== ''
                    ? typeof edit.getValue('valid_from') === 'string'
                      ? dayjs(edit.getValue('valid_from'))
                      : edit.getValue('valid_from')
                    : null
                }
                useNewIcon={true}
                required
                isReadOnly={isReadOnly}
                handleChange={(newDate: any) =>
                  !isReadOnly && edit.update({ valid_from: newDate })
                }
                handleClear={() =>
                  !isReadOnly && edit.update({ valid_from: null })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <MUHDatePickerComponent
                labelText="Valid To"
                value={
                  edit.getValue('valid_to') && edit.getValue('valid_to') !== ''
                    ? typeof edit.getValue('valid_to') === 'string'
                      ? dayjs(edit.getValue('valid_to'))
                      : edit.getValue('valid_to')
                    : null
                }
                required
                useNewIcon={true}
                isReadOnly={isReadOnly}
                handleChange={(newDate: any) =>
                  !isReadOnly && edit.update({ valid_to: newDate })
                }
                handleClear={() =>
                  !isReadOnly && edit.update({ valid_to: null })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <Box>
                <MUHSelectBoxComponent
                  selectLabel="Applicable Type"
                  value={edit.getValue('application_type')}
                  onChange={(e: any) =>
                    edit.update({ application_type: e.target.value })
                  }
                  selectItems={applicationTypes}
                  disabled={isReadOnly}
                  {...commonSelectBoxProps}
                />
                {!isReadOnly && (
                  <MUHTypography
                    color={theme.Colors.primary}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      mt: 0.5,
                      fontSize: '14px',
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectCategory({ open: true });
                    }}
                  >
                    Select Category
                  </MUHTypography>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <MUHSelectBoxComponent
                selectLabel="Status"
                value={edit.getValue('status')}
                onChange={(e: any) => edit.update({ status: e.target.value })}
                selectItems={StatusType}
                disabled={isReadOnly}
                {...commonSelectBoxProps}
              />
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

        {!isReadOnly && (
          <FormAction
            handleCancel={handleCancel}
            handleCreate={handleCreate}
          ></FormAction>
        )}

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
