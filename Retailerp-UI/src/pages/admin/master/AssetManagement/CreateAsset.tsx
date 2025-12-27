import React, { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid2';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '@components/PageHeader';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import { handleValidatedChange } from '@utils/form-util';
import { commonTextInputProps } from '@components/CommonStyles';
import FormAction from '@components/ProjectCommon/FormAction';
import { useEdit } from '@hooks/useEdit';
import {
  VendorNameOptions,
  assetManagementData,
  grnOptions,
} from '@constants/DummyData';
import { PrintTagIcon } from '@assets/Images/AdminImages';
import RetireDialog from './RetireDialog';

type SelectOption = {
  value: string | number;
  label: string;
};

type AssetFormValues = {
  asset_id: string;
  grn_id: SelectOption | null;
  asset_category: SelectOption | null;
  asset_name: string;
  purchase_date: Dayjs | null;
  asset_value: string;
  serial_number: string;
  vendor: SelectOption | null;
  invoice_preview: string;
  invoice_file_name: string;
  status: SelectOption | null;
};

const assetCategoryOptions: SelectOption[] = [
  { value: 'machinery', label: 'Machinery' },
  { value: 'display_fixtures', label: 'Display & Fixtures' },
  { value: 'networking', label: 'Networking' },
  { value: 'it_equipment', label: 'IT Equipment' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'safety', label: 'Safety & Security' },
];

const statusOptions: SelectOption[] = [
  { value: 'update_pending', label: 'Update Pending' },
  { value: 'in_use', label: 'In Use' },
  { value: 'available', label: 'Available' },
  { value: 'under_maintenance', label: 'Under Maintenance' },
  { value: 'retired', label: 'Retired' },
];

const supplierOptions: SelectOption[] = VendorNameOptions.map((option) => ({
  value: option.value,
  label: option.label,
}));

const BASE_FORM_VALUES: AssetFormValues = {
  asset_id: '',
  grn_id: null,
  asset_category: null,
  asset_name: '',
  purchase_date: null,
  asset_value: '',
  serial_number: '',
  vendor: null,
  invoice_preview: '',
  invoice_file_name: '',
  status: statusOptions[0] || null,
};

const generateAssetCode = () => {
  const now = dayjs();
  const fiscalYear =
    now.month() >= 3
      ? `${now.format('YY')}-${now.add(1, 'year').format('YY')}`
      : `${now.subtract(1, 'year').format('YY')}-${now.format('YY')}`;
  const serial = String(Math.floor(Math.random() * 90 + 10)).padStart(2, '0');
  return `AST ${serial}/${fiscalYear}`;
};

const findOption = (options: SelectOption[], label?: string | null) => {
  if (!label) return null;
  const match = String(label).trim().toLowerCase();
  return (
    options.find((item) => item.label.trim().toLowerCase() === match) || null
  );
};

const CreateAsset = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const params = new URLSearchParams(location?.search);
  // const type = params.get('type');

  // const typeParam = params.get('type');
  const type = params.get('type');
  // const type: 'create' | 'edit' | 'view' =
  //   typeParam === 'edit' || typeParam === 'view' ? typeParam : 'create';
  const rowIdParam = params.get('rowId');
  const rowId = rowIdParam ? Number(rowIdParam) : null;
  // const hasValidRowId = typeof rowId === 'number' && !Number.isNaN(rowId);

  const isCreateMode = type === 'create';
  const isEditMode = type === 'edit';
  const isViewMode = type === 'view';

  const [isError, setIsError] = useState(false);
  const [showRetireDialog, setShowRetireDialog] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<SelectOption | null>(
    null
  );

  const initialValues = useMemo(() => {
    return {
      ...BASE_FORM_VALUES,
      asset_id: generateAssetCode(),
      purchase_date: dayjs(),
      grn_id: grnOptions?.[0] || null,
      vendor: supplierOptions?.[0] || null,
      status: statusOptions[0] || null,
      // ...(isCreateMode ? {} : rowDefaults),
    };
  }, [isCreateMode]);

  const edit = useEdit(initialValues);
  const handleUpdate = () => {};

  const assetIdValue = (edit.getValue('asset_id') as string) || '';
  const assetNameValue = (edit.getValue('asset_name') as string) || '';
  const assetCategoryValue =
    (edit.getValue('asset_category') as SelectOption | null) || null;
  const grnValue = (edit.getValue('grn_id') as SelectOption | null) || null;
  const purchaseDateValue = edit.getValue('purchase_date') as Dayjs | null;
  const assetValueRaw = (edit.getValue('asset_value') as string) || '';
  const serialNumberValue = (edit.getValue('serial_number') as string) || '';
  const vendorValue = (edit.getValue('vendor') as SelectOption | null) || null;
  const statusValue = (edit.getValue('status') as SelectOption | null) || null;
  const invoicePreview = (edit.getValue('invoice_preview') as string) || '';
  const invoiceFileName = (edit.getValue('invoice_file_name') as string) || '';
  const statusLabel = statusValue?.label || 'Update Pending';
  const barcodeAssetId = assetIdValue || 'AST 00/00-00';
  const barcodeAssetName = assetNameValue || 'Weighing Scale';
  const barcodeSerialNumber = serialNumberValue || 'SN-0000';

  const fieldErrors = {
    asset_id: !assetIdValue,
    asset_name: !assetNameValue,
    asset_category: !assetCategoryValue,
    grn_id: !grnValue,
    purchase_date: !purchaseDateValue,
    asset_value: !assetValueRaw,
    serial_number: !serialNumberValue,
    vendor: !vendorValue,
    status: !statusValue,
    invoice_preview: !invoicePreview,
  };

  const hasError = (specificError: boolean) => isError && specificError;

  const handleAssetValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isViewMode) return;
    const cleaned = event.target.value.replace(/[^\d.]/g, '');
    const sanitized = cleaned.replace(/(\..*?)\..*/g, '$1');
    edit.update({ asset_value: sanitized });
  };

  const handleInvoiceBrowse = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return;
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    edit.update({
      invoice_preview: preview,
      invoice_file_name: file.name,
    });
  };

  const handleInvoiceDelete = (_fileName?: string) => {
    void _fileName;
    if (isViewMode) return;
    edit.update({
      invoice_preview: '',
      invoice_file_name: '',
    });
  };

  const handlePrintTag = () => {
    if (!assetNameValue || !serialNumberValue) {
      toast.error('Enter asset name and serial number to generate the tag');
      return;
    }
    toast.success('Tag generated successfully (dummy data)');
  };

  const handleCreateAsset = () => {
    setIsError(true);
    const hasValidationError = Object.values(fieldErrors).some(Boolean);

    if (hasValidationError) {
      toast.error('Please fill all required fields');
      return;
    }

    const successMessage = isEditMode
      ? 'Asset details updated successfully (dummy)'
      : 'Asset created successfully (dummy)';

    toast.success(successMessage);
  };

  const handleCancel = () => {
    navigateTo('/admin/assetManagement');
  };

  const handleRetireDialogClose = () => {
    setShowRetireDialog(false);
    // Revert status to previous value when dialog is closed without selection
    if (previousStatus) {
      edit.update({ status: previousStatus });
      setPreviousStatus(null);
    }
  };

  const handleMoveToScrap = () => {
    // Handle move to scrap logic
    toast.success('Asset moved to scrap successfully');
    setShowRetireDialog(false);
    setPreviousStatus(null);
    // Status remains as "Retired" after confirmation
    // TODO: Implement API call to move asset to scrap
  };

  const handleAssetDisposal = () => {
    // Handle asset disposal logic
    toast.success('Asset disposal initiated successfully');
    setShowRetireDialog(false);
    setPreviousStatus(null);
    // Status remains as "Retired" after confirmation
    // TODO: Implement API call for asset disposal
  };

  const displayAssetValue = assetValueRaw
    ? `₹${Number(assetValueRaw).toLocaleString('en-IN')}`
    : '';

  return (
    <Grid
      container
      flexDirection="column"
      sx={{ flex: 1, minHeight: 0 }}
      spacing={2}
    >
      <PageHeader
        // title={
        //   isCreateMode
        //     ? 'CREATE ASSET'
        //     : isEditMode
        //       ? 'EDIT ASSET'
        //       : 'VIEW ASSET'
        // }
        title={'CREATE ASSET'}
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={false}
        navigateUrl="/admin/assetManagement"
        showBackButton
        titleStyle={{ color: theme.Colors.black }}
      />
      <Grid
        container
        size="grow"
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader title="ASSET DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Asset ID"
              value={assetIdValue}
              disabled
              {...commonTextInputProps}
              isError={hasError(fieldErrors.asset_id)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="GRN ID"
              options={grnOptions || []}
              value={grnValue}
              onChange={(_, value) => edit.update({ grn_id: value })}
              isError={hasError(fieldErrors.grn_id)}
              isReadOnly={isViewMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Asset Category"
              options={assetCategoryOptions}
              value={assetCategoryValue}
              onChange={(_, value) => edit.update({ asset_category: value })}
              isError={hasError(fieldErrors.asset_category)}
              isReadOnly={isViewMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Asset Name"
              value={assetNameValue}
              isReadOnly={isViewMode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleValidatedChange(
                  event,
                  edit,
                  'asset_name',
                  'alphanumericWithSpace'
                )
              }
              {...commonTextInputProps}
              isError={hasError(fieldErrors.asset_name)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              labelText="Purchase Date"
              required
              value={purchaseDateValue}
              handleChange={(newValue: Dayjs | null) => {
                if (isViewMode) return;
                edit.update({ purchase_date: newValue });
              }}
              handleClear={() => {
                if (isViewMode) return;
                edit.update({ purchase_date: null });
              }}
              isError={hasError(fieldErrors.purchase_date)}
              isReadOnly={isViewMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <TextInput
              inputLabel="Asset Value"
              value={displayAssetValue}
              isReadOnly={isViewMode}
              onChange={handleAssetValueChange}
              {...commonTextInputProps}
              placeholder="₹0"
              isError={hasError(fieldErrors.asset_value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <TextInput
              inputLabel="Serial Number"
              value={serialNumberValue}
              isReadOnly={isViewMode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleValidatedChange(
                  event,
                  edit,
                  'serial_number',
                  'alphanumericWithSpaceAndSlash'
                )
              }
              {...commonTextInputProps}
              isError={hasError(fieldErrors.serial_number)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Vendor Name"
              options={supplierOptions}
              value={vendorValue}
              onChange={(_, value) => edit.update({ vendor: value })}
              isError={hasError(fieldErrors.vendor)}
              isReadOnly={isViewMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <DragDropUpload
              required
              labelText="Upload Invoice"
              image_url={invoicePreview}
              fileName={invoiceFileName}
              onBrowseButtonClick={handleInvoiceBrowse}
              handleDeleteImage={handleInvoiceDelete}
              disabled={isViewMode}
              isError={hasError(fieldErrors.invoice_preview)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Status"
              options={statusOptions}
              value={statusValue}
              onChange={(_, value) => {
                if (isViewMode) return;

                // Check if status is being changed to "Retired"
                if (
                  value?.value === 'retired' &&
                  statusValue?.value !== 'retired'
                ) {
                  // Store current status before showing dialog
                  setPreviousStatus(statusValue);
                  // Update status first
                  edit.update({ status: value });
                  // Show dialog
                  setShowRetireDialog(true);
                } else {
                  // For other status changes, update normally
                  setPreviousStatus(statusValue);
                  edit.update({ status: value });
                }
              }}
              isError={hasError(fieldErrors.status)}
              isReadOnly={isViewMode}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        size="grow"
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader title="MAINTENANCE DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Maintenance Cycle"
              options={assetCategoryOptions}
              value={assetCategoryValue}
              onChange={(_, value) => edit.update({ asset_category: value })}
              isError={hasError(fieldErrors.asset_category)}
              isReadOnly={isViewMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <MUHDatePickerComponent
              labelText="Next Maintenance"
              required
              value={purchaseDateValue}
              handleChange={(newValue: Dayjs | null) => {
                if (isViewMode) return;
                edit.update({ purchase_date: newValue });
              }}
              handleClear={() => {
                if (isViewMode) return;
                edit.update({ purchase_date: null });
              }}
              isError={hasError(fieldErrors.purchase_date)}
              isReadOnly={isViewMode}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        size="grow"
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader title="WARRANTY DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <MUHDatePickerComponent
              labelText="Warranty Expiry Date"
              required
              value={purchaseDateValue}
              handleChange={(newValue: Dayjs | null) => {
                if (isViewMode) return;
                edit.update({ purchase_date: newValue });
              }}
              handleClear={() => {
                if (isViewMode) return;
                edit.update({ purchase_date: null });
              }}
              isError={hasError(fieldErrors.purchase_date)}
              isReadOnly={isViewMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <DragDropUpload
              required
              labelText="Upload Document"
              image_url={invoicePreview}
              fileName={invoiceFileName}
              onBrowseButtonClick={handleInvoiceBrowse}
              handleDeleteImage={handleInvoiceDelete}
              disabled={isViewMode}
              isError={hasError(fieldErrors.invoice_preview)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        size="grow"
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader title="LOCATION DETAILS" />
        <Grid container padding="20px">
          <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
            <AutoSearchSelectWithLabel
              required
              label="Branch"
              options={supplierOptions}
              value={vendorValue}
              onChange={(_, value) => edit.update({ vendor: value })}
              isError={hasError(fieldErrors.vendor)}
              isReadOnly={isViewMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
            <AutoSearchSelectWithLabel
              required
              label="Department"
              options={supplierOptions}
              value={vendorValue}
              onChange={(_, value) => edit.update({ vendor: value })}
              isError={hasError(fieldErrors.vendor)}
              isReadOnly={isViewMode}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        size="grow"
        flexDirection="column"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <FormSectionHeader
          title="TAG PRINTING"
          rightContent={
            <Button
              onClick={handlePrintTag}
              startIcon={<PrintTagIcon />}
              sx={{
                backgroundColor: theme.Colors.primary,
                color: theme.Colors.whitePrimary,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                fontFamily: theme.fontFamily.roboto,
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: theme.Colors.primaryDarkStart,
                },
              }}
            >
              Print Tag
            </Button>
          }
        />
        <Grid container padding="20px">
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                border: `1px solid ${theme.Colors.grayLight}`,
                borderRadius: '8px',
                backgroundColor: theme.Colors.whitePrimary,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                width: '388px',
                gap: 3,
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'initial',
                  gap: 1.5,
                  minWidth: 200,
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: 220 },
                    height: 90,
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #000, #000 3px, transparent 3px, transparent 6px)',
                    borderRadius: '6px',
                    border: `1px solid ${theme.Colors.grayLight}`,
                    backgroundColor: theme.Colors.whitePrimary,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: 500,
                      color: theme.Colors.black,
                    }}
                  >
                    {barcodeAssetName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: 400,
                      color: theme.Colors.grayDarkDim,
                    }}
                  >
                    {barcodeAssetId}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: 400,
                      color: theme.Colors.grayDarkDim,
                    }}
                  >
                    {barcodeSerialNumber}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: 400,
                      color: theme.Colors.grayDarkDim,
                    }}
                  >
                    {statusLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <FormAction
        firstBtntxt={type === 'update' ? 'Update' : 'Create'}
        secondBtntx="Cancel"
        handleCancel={handleCancel}
        handleCreate={type === 'update' ? handleUpdate : handleCreateAsset}
      />

      {/* Retire Asset Dialog */}
      <RetireDialog
        open={showRetireDialog}
        onClose={handleRetireDialogClose}
        onMoveToScrap={handleMoveToScrap}
        onAssetDisposal={handleAssetDisposal}
      />
    </Grid>
  );
};

export default CreateAsset;
