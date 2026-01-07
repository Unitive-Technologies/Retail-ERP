import { DownloadIconPdf, PrintOutIcon, SchemeCartIcon } from '@assets/Images';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import PageHeader from '@components/PageHeader';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import { ClearRounded } from '@mui/icons-material';
import { Chip, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import BarChartSales from '@components/BarChartSalesComponent';
import MUHTypography from '@components/MUHTypography';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import PurchaseByCategory from './PurchaseByCategory';
const transactionHistoryDummy = [
  {
    id: 1,
    s_no: 1,
    date: '12/02/2025',
    grn_no: 'GRN 01/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 2,
    s_no: 2,
    date: '15/02/2025',
    grn_no: 'GRN 02/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 3,
    s_no: 3,
    date: '20/02/2025',
    grn_no: 'GRN 03/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 4,
    s_no: 4,
    date: '25/02/2025',
    grn_no: 'GRN 04/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 5,
    s_no: 5,
    date: '03/03/2025',
    grn_no: 'GRN 05/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 6,
    s_no: 6,
    date: '12/02/2025',
    grn_no: 'GRN 06/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 7,
    s_no: 7,
    date: '12/02/2025',
    grn_no: 'GRN 07/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
  {
    id: 8,
    s_no: 8,
    date: '12/02/2025',
    grn_no: 'GRN 08/24-25',
    total_purchase: '₹1,50,00,000',
    total_paid: '₹1,20,00,000',
    outstanding: '₹30,00,000',
  },
];

const Overview = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [tableData] = useState<object[]>(transactionHistoryDummy);
  const location = useLocation();
  const [activeTab] = useState<number>(0);
  const today = new Date();
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >([today, today]);
  const customData = [
    { branch: 'Avadi', value: 12500000 },
    { branch: 'Ambathur 1', value: 20500000 },
    { branch: 'Ambathur 2', value: 11500000 },
    { branch: 'Coimbatore', value: 14000000 },
    { branch: 'Salem', value: 11600000 },
    { branch: 'Ambathur 3', value: 11500000 },
  ];
  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',

      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'grn_no',
      headerName: 'GRN No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_purchase',
      headerName: 'Total Purchase',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'total_paid',
      headerName: 'Total Paid',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'outstanding',
      headerName: 'Outstanding',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const handleClear = () => {
    const todayDate = new Date();
    setDateRange([todayDate, todayDate] as [Date | null, Date | null]);
  };
  const card = [
    {
      img: SchemeCartIcon,

      title: 'Total Purchase Order',
      value: '2,525',
      activeTab,
    },
    {
      img: SchemeCartIcon,
      title: 'Completed Purchase Order',
      value: '2,510',

      activeTab,
    },
    {
      img: SchemeCartIcon,

      title: 'Pending Purchase Order',
      value: 15,
      activeTab,
    },
    {
      img: SchemeCartIcon,
      title: 'Cancelled Purchase Order',
      value: 15,
      activeTab,
    },
  ];
  const [currentTab, setCurrentTab] = React.useState<number | string>(
    location.pathname.includes('vendorListTable') ? 1 : 0
  );
  const { rowData } = location.state || {};
  const vendorProfileData = {
    name: rowData?.branch_name || 'Golden Hub Pvt.,Ltd.,',
    code: rowData?.branch_id || 'VEN1023',
    phone: rowData?.phone || '+91 9635895968',
    address: rowData?.address || 'Address Not Provided',
    city: rowData?.location || 'Bangalore',
    pinCode: rowData?.pinCode || '000000',
  };
  const iconBox = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <Grid container spacing={2}>
      <PageHeader
        title="OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Vendor Overview', id: 0 },
          { label: 'Vendor List', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={true}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={(val) => {
          setCurrentTab(val);

          if (val === 0 && currentTab !== 0) {
            navigateTo('/admin/vendorOverview');
          } else if (val === 1 && currentTab !== 1) {
            navigateTo('/admin/vendorOverview/vendorListTable');
          }
        }}
        switchTabContainerWidth="fit-content"
      />
      {/* PROFILE CARD */}
      <Grid size={12}>
        <ProfileCard
          profileData={vendorProfileData}
          type="customer"
          mode="view"
        />
      </Grid>
      <Grid size={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #E0E2E7',
            padding: '10px 12px',
            // mt: 1,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* LEFT FILTER SECTION */}
          <Grid container spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
            {/* Today Dropdown */}
            <Grid size={1.5}>
              <AutoSearchSelectWithLabel
                options={[]} // empty options
                placeholder="Today"
                value={null}
                onChange={() => {}}
                {...CommonFilterAutoSearchProps}
              />
            </Grid>

            {/* Date Range Picker */}
            <Grid sx={{ padding: 0, display: 'flex', alignItems: 'center' }}>
              <MUHDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
                isError={false}
                disabled={false}
              />
            </Grid>

            {/* Clear Button */}
            <Grid>
              <IconButton
                onClick={handleClear}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  width: 36,
                  height: 36,
                }}
              >
                <ClearRounded
                  sx={{ fontSize: 18, color: theme.Colors.blackLightLow }}
                />
              </IconButton>
            </Grid>
          </Grid>

          {/* RIGHT ACTION BUTTONS */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
              <img
                src={DownloadIconPdf}
                width={24}
                height={24}
                alt="Download PDF"
              />
            </Box>

            <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
              <img src={PrintOutIcon} width={23} height={23} alt="Print" />
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid size={12} container sx={{ display: 'flex', gap: '20px' }}>
        <StatusInactiveCard data={card} />
      </Grid>
      <Grid container size={12} spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatusInactiveCard
            layout="vertical"
            containerDirection="column"
            data={[
              {
                img: SchemeCartIcon,
                title: 'Purchase Order Value',
                value: '₹55,15,525',
              },
              {
                img: SchemeCartIcon,
                title: 'Total Amount Paid',
                value: '₹75,25,855',
              },
              {
                img: SchemeCartIcon,
                title: 'Outstanding Amount To Pay',
                value: '₹6,25,855',
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <BarChartSales
            data={customData}
            title="Purchase Values"
            height={270}
            maxValue={30000000}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <PurchaseByCategory />
        </Grid>

        <Grid
          container
          size="grow"
          flexDirection={'column'}
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            marginTop: '12px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <Grid
            container
            size={12}
            justifyContent={'space-between'}
            alignItems="center"
            borderRadius={8}
            sx={{ width: '100%', paddingX: 2, paddingTop: 2 }}
          >
            <Grid>
              <MUHTypography
                size={theme.MetricsSizes.small_xxx}
                padding="20px"
                weight={theme.fontWeight.mediumBold}
                color={theme.Colors.black}
                fontFamily={theme.fontFamily.roboto}
                sx={{
                  width: '100%',
                  height: '50px',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                Transaction History
              </MUHTypography>
            </Grid>
            <Grid>
              <Chip
                label="View All"
                onClick={() =>
                  navigateTo('/admin/vendorOverview/transactionHistory')
                }
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: theme.Colors.black,
                  backgroundColor: '#EFEFEF',
                  borderRadius: '50px',
                  border: '1px solid #E6E6E6',
                }}
              />
            </Grid>
          </Grid>
          <Grid sx={{ padding: '20px' }}>
            <MUHTable
              columns={columns}
              rows={tableData}
              loading={false}
              isPagination={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Overview;
