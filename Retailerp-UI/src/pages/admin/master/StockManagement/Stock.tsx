import { useState } from 'react';
import { Box, Chip, IconButton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import {
  DownloadIconPdf,
  LowStockIcon,
  OutOfStockIcon,
  PrintOutIcon,
  SchemeCartIcon,
  TotalStockValueIcon,
  TotalWeightIcon,
} from '@assets/index';

import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';

import { ClearRounded } from '@mui/icons-material';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import React from 'react';

import { MUHTable, StatusCard } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { StockList } from '@constants/DummyData';
import MUHTypography from '@components/MUHTypography';
import BarChartSales from '@components/BarChartSalesComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import VendorContributionChart from '@components/VendorContributionChart';

export const BranchList = [{ value: 1, label: 'Today' }];

export const StatusList = [
  { value: 1, label: 'Update pending' },
  { value: 2, label: 'Under Maintenance' },
  { value: 3, label: 'In Use' },
  { value: 4, label: 'Retired' },
];

const iconBox = {
  width: '35px',
  height: '35px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
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
const customData = [
  { branch: 'Avadi', value: 12500000 },
  { branch: 'Ambathur 1', value: 20500000 },
  { branch: 'Ambathur 2', value: 11500000 },
  { branch: 'Coimbatore', value: 14000000 },
  { branch: 'Salem', value: 11600000 },
  { branch: 'Ambathur 3', value: 11500000 },
];
const Stock = () => {
  const theme = useTheme();
  const [tableData, setTableData] = useState<object[]>(StockList);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const today = new Date();
  const navigateTo = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = React.useState<number | string>(
    location.pathname.includes('branchWise') ? 1 : 0
  );
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >([today, today]);

  const handleClear = () => {
    const todayDate = new Date();
    setDateRange([todayDate, todayDate]);
  };
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  React.useEffect(() => {
    if (location.pathname.includes('branchWise')) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [location.pathname]);

  const card = [
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,

      title: 'Total Stock Value',
      value: '₹1,25,55,585',
      activeTab,
    },
    {
      img: TotalWeightIcon,
      img2: TotalWeightIcon,

      title: 'Total Weight',
      value: '185.52',
      valueUnit: 'g',
      quantity: 1234,
      quantityLabel: 'Qty',
      activeTab,
    },
    {
      img: LowStockIcon,
      img2: LowStockIcon,

      title: 'Low Stock',
      value: 25,
      activeTab,
    },
    {
      img: OutOfStockIcon,
      img2: OutOfStockIcon,

      title: 'Out of Stock',
      value: 10,
      activeTab,
    },
  ];

  return (
    <>
      {/* Header */}
      {/* <PageHeader
        title="STOCK OVERVIEW"
        titleStyle={{
          color: theme.Colors.black,
        }}
        btnName="Create New Scheme"
      /> */}
      <PageHeader
        title="STOCK OVERVIEW"
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

      {/* Filter Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #E0E2E7',
          // boxShadow: '0 0 4px rgba(0,0,0,0.1)',
          padding: '8px 12px',
          mt: 2,
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Left Section */}
        <Grid container spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
          <Grid size={1.5}>
            <AutoSearchSelectWithLabel
              options={[]} // empty options for now
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
              <Box
                sx={{
                  ...iconBox,
                  ':hover': {
                    borderColor: theme.Colors.primary,
                  },
                }}
              >
                <ClearRounded
                  sx={{ fontSize: '18px', color: theme.Colors.blackLightLow }}
                />
              </Box>
            </IconButton>
          </Grid>
        </Grid>

        {/* Right Section */}
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
            <img src={PrintOutIcon} width={22.5} height={23} alt="Print" />
          </Box>
        </Box>
      </Box>
      <Grid container sx={{ display: 'flex', gap: '20px' }}>
        <StatusCard data={card} onClickCard={onclickActiveTab} />
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
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
              Stock List
            </MUHTypography>
          </Grid>
          <Grid>
            <Chip
              label="View All"
              // onClick={() => navigateTo(AccountManagerPaths.Client)}
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
            // getRowActions={renderRowAction}
            loading={false}
            isPagination={false}
            isCheckboxSelection={false}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
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
            filterBy="material"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Stock;
