import {
  DownloadIconPdf,
  GoldenPlanImages,
  LowStockIcon,
  PrintOutIcon,
  TotalStockValueIcon,
  TotalWeightIcon,
} from '@assets/Images';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import PageHeader from '@components/PageHeader';
import { ClearRounded } from '@mui/icons-material';
import { Box, Chip, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Grid from '@mui/system/Grid';
import { useNavigate } from 'react-router-dom';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import BarChartSales from '@components/BarChartSalesComponent';
import DonutChartComponent from '@components/DonutChartComponent';
import { MUHTable } from '@components/index';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';

import MUHTypography from '@components/MUHTypography';
const iconBox = {
  width: '35px',
  height: '35px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
const customData = [
  { branch: 'Avadi', value: 12500000 },
  { branch: 'Ambathur 1', value: 20500000 },
  { branch: 'Ambathur 2', value: 11500000 },
  { branch: 'Coimbatore', value: 14000000 },
  { branch: 'Salem', value: 11600000 },
  { branch: 'Ambathur 3', value: 11500000 },
];
const vendorSalesData = [
  {
    id: 1,
    s_no: 1,
    vendor_name: 'Golden Hub Pvt., Ltd.',
    gold: '152.25 g',
    silver: '152.25 g',
    totalValue: 585585,
  },
  {
    id: 2,
    s_no: 2,
    vendor_name: 'Shiva Silver Suppliers',
    gold: '152.25 g',
    silver: '152.25 g',
    totalValue: 585585,
  },
  {
    id: 3,
    s_no: 3,
    vendor_name: 'Jai Shree Jewels',
    gold: '152.25 g',
    silver: '152.25 g',
    totalValue: 585585,
  },
  {
    id: 4,
    s_no: 4,
    vendor_name: 'Kalash Gold & Silver Mart',
    gold: '152.25 g',
    silver: '152.25 g',
    totalValue: 585585,
  },
  {
    id: 5,
    s_no: 5,
    vendor_name: 'Sai Precious Metals',
    gold: '152.25 g',
    silver: '152.25 g',
    totalValue: 585585,
  },
];

const topBuyingCategories = [
  { category: 'Earrings', value: 60 },
  { category: 'Rings', value: 42 },
  { category: 'Bangles', value: 40 },
  { category: 'Bangles', value: 35 },
  { category: 'Necklace', value: 18 },
];
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

const VendorOverview = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [activeTab] = useState<number>(0);
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >([null, null]);
  const [currentTab, setCurrentTab] = React.useState<number | string>(
    location.pathname.includes('branchWise') ? 1 : 0
  );
  const [tableData] = useState<object[]>(transactionHistoryDummy);
  const handleClear = () => {
    const todayDate = new Date();
    setDateRange([todayDate, todayDate]);
  };
  const formatCurrency = (value?: number | string) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value.toLocaleString('en-IN');
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const numericValue = Number(value.replace(/[^0-9.-]/g, ''));
      if (!Number.isNaN(numericValue)) {
        return numericValue.toLocaleString('en-IN');
      }
    }

    return '0';
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
  const columnss: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor Name',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const row = params?.row || {};
        const src = row.vendor_image_url || GoldenPlanImages;
        return (
          <Grid
            sx={{
              display: 'flex',
              gap: 1,
              height: '100%',
              alignItems: 'center',
            }}
          >
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
            <Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: theme.Colors.black,
                }}
              >
                {row.vendor_name}
              </Typography>
              {/* <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: theme.Colors.graniteGray,
                }}
              >
                {row.vendor_code}
              </Typography> */}
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'gold',
      headerName: 'Gold',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'silver',
      headerName: 'Silver',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography
          sx={{ fontSize: 14, fontWeight: 500, color: theme.Colors.black }}
        >
          ₹{formatCurrency(params.row.totalValue)}
        </Typography>
      ),
    },
  ];
  const card = [
    {
      img: TotalStockValueIcon,

      title: 'Total Vendor',
      value: '45',
      activeTab,
    },
    {
      img: TotalWeightIcon,
      title: 'Active Vendors',
      value: '32',

      activeTab,
    },
    {
      img: LowStockIcon,

      title: 'Outstanding Payables',
      value: '₹1,25,525',
      activeTab,
    },
  ];

  return (
    <>
      <PageHeader
        title="VENDOR OVERVIEW"
        useSwitchTabDesign={true}
        showDownloadBtn={false}
        tabContent={[
          { label: 'Vendor Overview', id: 0 },
          { label: 'Vendor List', id: 1 },
        ]}
        showlistBtn={false}
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
        <StatusInactiveCard data={card} />
      </Grid>
      <Grid container size={12} spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <BarChartSales
            data={customData}
            title="Vendor Sales Contribution"
            height={270}
            maxValue={30000000}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DonutChartComponent
            title="Sales By Material Type"
            donutTitle="70%"
            chartData={{
              series: [70, 30],
              labels: ['Gold', 'Silver'],
              colors: ['#BB4E65', '#F3CC86'],
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '12px',
              backgroundColor: theme.Colors.whitePrimary,
              p: 2.5,
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                mb: 2,
              }}
            >
              Vendor Sales Contribution
            </Typography>
            <MUHTable
              columns={columnss}
              rows={vendorSalesData}
              checkboxSelection={false}
              hideFooter
              isPagination={false}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: `1px solid ${theme.Colors.grayLight}`,
              borderRadius: '12px',
              backgroundColor: theme.Colors.whitePrimary,
              p: 2.5,
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                mb: 2,
              }}
            >
              Top Buying Categories
            </Typography>
            <BarChart
              height={360}
              dataset={topBuyingCategories}
              margin={{ top: 10, right: 16, left: 16, bottom: 36 }}
              xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'category',
                  tickLabelStyle: {
                    fontSize: 12,
                    fontWeight: 600,
                    fill: '#776F89',
                  },
                },
              ]}
              yAxis={[
                {
                  min: 0,
                  max: 100,
                  tickNumber: 5,
                  tickLabelStyle: { fontSize: 11, fill: '#9B9B9B' },
                },
              ]}
              series={[
                {
                  dataKey: 'value',
                  color: '#C4B3FF',
                },
              ]}
              grid={{ horizontal: true, vertical: false }}
              sx={{
                '& .MuiBarElement-root': {
                  rx: 8,
                  ry: 8,
                  fill: '#E7D8FF',
                  transition: '0.2s',
                },
                '& .MuiBarElement-root:nth-of-type(1)': {
                  fill: '#8F2FE8',
                },
                '& .MuiBarElement-root:hover': {
                  opacity: 0.9,
                },
                '& .MuiChartsGrid-line': {
                  stroke: '#DFDFE7',
                  strokeDasharray: '6 6',
                },
                '& .MuiChartsAxis-line': { stroke: '#EFEFF4' },
                '& .MuiChartsAxis-tick': { stroke: '#EFEFF4' },
              }}
            />
          </Box>
        </Grid>
      </Grid>
      {/* <TranscationHistory /> */}
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
            // getRowActions={renderRowAction}
            loading={false}
            isPagination={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default VendorOverview;
