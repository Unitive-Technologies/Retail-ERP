import { DownloadIconPdf, PrintOutIcon, SchemeCartIcon } from '@assets/Images';
import { SendQuotationIcon } from '@assets/Images/AdminImages';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import PageHeader from '@components/PageHeader';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import StatusCard from '@components/StatusCard';
import { ClearRounded } from '@mui/icons-material';
import { Box, Chip, IconButton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MUHTable } from '@components/index';
import MUHTypography from '@components/MUHTypography';
import { GridColDef } from '@mui/x-data-grid';
import { StockList } from '@constants/DummyData';
import BarChartSales from '@components/BarChartSalesComponent';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import VendorContributionChart from '@components/VendorContributionChart';

const BranchWiseStock = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navigateTo = useNavigate();
  const [currentTab, setCurrentTab] = React.useState<number | string>(0);
  const onclickActiveTab = (index: number) => setActiveTab(index);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tableData, setTableData] = useState<object[]>(StockList);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const { rowData } = location.state || {};
  const customData = [
    { branch: 'Avadi', value: 12500000 },
    { branch: 'Ambathur 1', value: 20500000 },
    { branch: 'Ambathur 2', value: 11500000 },
    { branch: 'Coimbatore', value: 14000000 },
    { branch: 'Salem', value: 11600000 },
    { branch: 'Ambathur 3', value: 11500000 },
  ];
  const card = [
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Total Stock Value',
      value: 12555585,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Total Quantity',
      value: 185.52,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Low Stock',
      value: 25,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Out of Stock',
      value: 10,
      activeTab,
    },
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
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'gold_quantity',
      headerName: 'Gold Quantity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'gold_value',
      headerName: 'Gold Value',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'silver_quantity',
      headerName: 'Silver Quantity',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'silver_value',
      headerName: 'Silver Value',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'old_jewel_weight',
      headerName: 'Old Jewel Weight',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const branchProfileData = {
    name: rowData?.branch_name || 'ShineCraft Silver',
    code: rowData?.branch_id || 'CJ_SLM_001',
    phone: rowData?.phone || 'N/A',
    address: rowData?.address || 'Address Not Provided',
    city: rowData?.location || 'City',
    pinCode: rowData?.pinCode || '000000',
  };

  const today = new Date();
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([
    today,
    today,
  ]);

  const handleClear = () => {
    const todayDate = new Date();
    setDateRange([todayDate, todayDate]);
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
        title="BRANCH WISE STOCK"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Stock Overview', id: 0 },
          { label: 'Branch-Wise Stock', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={true}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={(val) => {
          setCurrentTab(val);

          if (val === 0 && currentTab !== 0) {
            navigateTo('/admin/stock');
          } else if (val === 1 && currentTab !== 1) {
            navigateTo('/admin/stock/branchWise');
          }
        }}
        switchTabContainerWidth="262px"
      />

      {/* PROFILE CARD */}
      <Grid size={12}>
        <ProfileCard
          profileData={branchProfileData}
          type="customer"
          mode="view"
        />
      </Grid>

      {/* FILTER BOX */}
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
      <Grid container size={12} sx={{ display: 'flex', gap: '20px' }}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
      </Grid>

      <Grid container size={12} spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <BarChartSales
            data={customData}
            title="Branch Stock"
            height={270}
            maxValue={30000000}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatusInactiveCard
            layout="vertical"
            containerDirection="column"
            data={[
              {
                img: SchemeCartIcon,
                title: 'Gold Value',
                value: '₹55,15,525',
                quantity: '185.52',
                quantityLabel: 'g',
              },
              {
                img: SchemeCartIcon,
                title: 'Silver Value',
                value: '₹75,25,855',
                quantity: '185.52',
                quantityLabel: 'g',
              },
              {
                img: SchemeCartIcon,
                title: 'Old Jewel',
                value: '₹6,25,855',
                quantity: '85.52',
                quantityLabel: 'g',
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid
        container
        size={12}
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
              Stock List
            </MUHTypography>
          </Grid>
          <Grid>
            <Chip
              label="View All"
              onClick={() => navigate('/admin/stock/branchWise/StockList')}
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
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={tableData}
            loading={false}
            isPagination={false}
            isCheckboxSelection={false}
          />
        </Grid>
      </Grid>
      <Grid container size={12} spacing={2} sx={{ mt: 2 }}>
        <Grid size={12}>
          <VendorContributionChart
            data={[
              {
                vendor: 'Golden Hub Pvt., Ltd.',
                gold: 18000000,
                silver: 11000000,
              },
              {
                vendor: 'Shivasilver Suppliers',
                gold: 16558585,
                silver: 11000000,
              },
              {
                vendor: 'Elegant Silver Works',
                gold: 18000000,
                silver: 11000000,
              },
              {
                vendor: 'Sparakle Designer Hub',
                gold: 18000000,
                silver: 11000000,
              },
              { vendor: 'Golden Wrap & Co.', gold: 18000000, silver: 11000000 },
              {
                vendor: 'Kiran Kasting Studio',
                gold: 18000000,
                silver: 11000000,
              },
            ]}
            title="Vendor Contribution"
            height={270}
            maxValue={30000000}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BranchWiseStock;
