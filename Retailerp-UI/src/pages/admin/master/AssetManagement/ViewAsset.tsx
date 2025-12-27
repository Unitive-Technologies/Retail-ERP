import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageHeader from '@components/PageHeader';
import { Box, useTheme } from '@mui/material';
import { MUHTable, ButtonComponent } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { MaintenanceHistory } from '@constants/DummyData';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import MUHTypography from '@components/MUHTypography';
import FormAction from '@components/ProjectCommon/FormAction';
import { useNavigate } from 'react-router-dom';

const ViewAsset = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tableData] = useState<object[]>(MaintenanceHistory);
  const [hiddenColumns] = useState<string[]>([]);

  const assetData = {
    serialNo: 'DDCS224316532',
    assetCategory: 'Machinery',
    assetName: 'Weighing Scale',
    purchaseDate: '12/09/2025',
    purchaseValue: '₹2500',
    grnId: 'GRN 14/24-25',
    vendorName: 'Shree Machinery Supploes',
    maintenanceCycle: 'Monthly',
    nextMaintenance: '12/10/2025',
    warrantyExpiryDate: '12/09/2025',
    warrantyDocument: 'Warrenty.pdf',
    branch: 'Avadi Branch',
    department: 'Sales',
  };

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'maintenance_type',
      headerName: 'Maintenance Type',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'technician_name',
      headerName: 'Technician Name',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'machine_performance',
      headerName: 'Machine Performance',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const InfoRow = ({
    label,
    value,
    isLink = false,
  }: {
    label: string;
    value: string;
    isLink?: boolean;
  }) => (
    <Grid container sx={{ mb: 1.5 }} alignItems="center">
      <Grid size={5}>
        <MUHTypography
          text={label}
          size={theme.MetricsSizes.small_xxx}
          weight={theme.fontWeight.medium}
          color={theme.Colors.primary}
          family={theme.fontFamily.roboto}
        />
      </Grid>
      <Grid
        size="auto"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <MUHTypography
          text=":"
          size={theme.MetricsSizes.small_xxx}
          weight={theme.fontWeight.medium}
          color={theme.Colors.primary}
          family={theme.fontFamily.roboto}
        />
      </Grid>
      <Grid size="grow">
        {isLink ? (
          <MUHTypography
            text={value}
            size={theme.MetricsSizes.small_xxx}
            weight={theme.fontWeight.medium}
            color={theme.Colors.primary}
            family={theme.fontFamily.roboto}
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          />
        ) : (
          <MUHTypography
            text={value}
            size={theme.MetricsSizes.small_xxx}
            weight={theme.fontWeight.medium}
            color={theme.Colors.black}
            family={theme.fontFamily.roboto}
          />
        )}
      </Grid>
    </Grid>
  );
  const handleSave = () => {};
  const handleReject = () => {};

  return (
    <Grid container spacing={2}>
      <PageHeader
        title="WEIGHING SCALE - AST 25/24-25"
        showDownloadBtn={false}
        titleStyle={{ color: theme.Colors.black }}
        showCreateBtn={false}
        showlistBtn={true}
        navigateUrl="/admin/assetManagement"
      />
      <Grid container size={12} spacing={2}>
        {/* Left Panel - Maintenance History */}
        <Grid size={8}>
          <Grid
            container
            size="grow"
            padding={'12px'}
            flexDirection="column"
            sx={{
              border: `1px solid ${theme.Colors.grayLight}`,
              borderBottom: 'none',
              borderRadius: '8px 8px 0px 0px',
              backgroundColor: theme.Colors.whitePrimary,
            }}
          >
            <FormSectionHeader
              title="MAINTENANCE HISTORY"
              sx={{ border: 'none' }}
              rightContent={
                <ButtonComponent
                  buttonText="+ Update"
                  buttonFontSize={14}
                  bgColor={theme.Colors.whitePrimary}
                  buttonTextColor={theme.Colors.primary}
                  buttonFontWeight={500}
                  btnBorderRadius={2}
                  btnHeight={30}
                  padding="6px 16px"
                  buttonStyle={{ fontFamily: 'Roboto-Regular' }}
                  onClick={() =>
                    navigate('/admin/assetManagement/view/addMaintenance')
                  }
                  border={`1px solid ${theme.Colors.primary}`}
                />
              }
            />
          </Grid>
          <Grid
            sx={{
              padding: '15px',
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '0px 0px 8px 8px',
              backgroundColor: theme.Colors.whitePrimary,
            }}
          >
            <MUHTable
              columns={columns.filter(
                (column) =>
                  column.headerName &&
                  !hiddenColumns.includes(column.headerName)
              )}
              rows={tableData}
              loading={false}
              isCheckboxSelection={false}
              isPagination={false}
            />
          </Grid>
        </Grid>

        {/* Right Panel - Sidebar */}
        <Grid size={4}>
          <Grid
            container
            flexDirection="column"
            gap={2}
            sx={{
              position: 'sticky',
              top: 20,
            }}
          >
            {/* Barcode */}
            <Box
              sx={{
                border: `1px solid ${theme.Colors.grayLight}`,
                borderRadius: '8px',
                backgroundColor: theme.Colors.whitePrimary,
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 90,
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #000, #000 3px, transparent 3px, transparent 6px)',
                  borderRadius: '6px',
                  border: `1px solid ${theme.Colors.grayLight}`,
                  backgroundColor: theme.Colors.whitePrimary,
                }}
              />

              <Box sx={{ mt: 2 }}>
                <InfoRow label="Serial No" value={assetData.serialNo} />
                <InfoRow
                  label="Asset Category"
                  value={assetData.assetCategory}
                />
                <InfoRow label="Asset Name" value={assetData.assetName} />
                <InfoRow label="Purchase Date" value={assetData.purchaseDate} />
                <InfoRow
                  label="Purchase Value"
                  value={assetData.purchaseValue}
                />
                <InfoRow label="GRN ID" value={assetData.grnId} />
                <InfoRow label="Vendor Name" value={assetData.vendorName} />
              </Box>
            </Box>

            {/* Maintenance Details */}

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
              <Box sx={{ mt: 2, ml: 3 }}>
                <InfoRow
                  label="Maintenance Cycle"
                  value={assetData.maintenanceCycle}
                />
                <InfoRow
                  label="Next Maintenance"
                  value={assetData.nextMaintenance}
                />
              </Box>
            </Grid>

            {/* Warranty Details */}
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
              <Box sx={{ mt: 2, ml: 3 }}>
                <InfoRow
                  label="Warranty Expiry Date"
                  value={assetData.warrantyExpiryDate}
                />
                <InfoRow
                  label="Document"
                  value={assetData.warrantyDocument}
                  isLink={true}
                />
              </Box>
            </Grid>

            {/* Location Details */}
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
              <Box sx={{ mt: 2, ml: 3 }}>
                <InfoRow label="Branch" value={assetData.branch} />
                <InfoRow label="Department" value={assetData.department} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container size={12} justifyContent="center" sx={{ mt: 3, mb: 2 }}>
        <FormAction
          firstBtntxt="Save"
          secondBtntx="Reject"
          handleCancel={handleReject}
          handleCreate={handleSave}
        />
      </Grid>
    </Grid>
  );
};

export default ViewAsset;
