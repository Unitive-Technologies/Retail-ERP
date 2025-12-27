import {
  DownloadIconPdf,
  LowStockIcon,
  OutOfStockIcon,
  PrintOutIcon,
  StockWeightIcon,
  TotalPayableIcon,
  TotalPurchaseIcon,
  TotalQuantityIcon,
  TotalSaleIcon,
} from '@assets/Images';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import { ClearRounded } from '@mui/icons-material';
import React, { useState } from 'react';
import WelcomeBanner from './WelcomeBanner';
import StatusCard from '@components/StatusCard';
import SalesStatisticsChart from '@components/SalesStatisticsChart';
import VendorContributionChart from '@components/VendorContributionChart';
import TopSellingTable from './TopSellingTable';
import DonutChartComponent from '@components/DonutChartComponent';
import BarChartSales from '@components/BarChartSalesComponent';
import PurchaseTable from './PurchaseTable';
import OverallStockTable from './OverallStockTable';

const Dashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);

  const [selectedBranch, setSelectedBranch] = React.useState<any | null>(null);
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);
  const [selectedPeriod, setSelectedPeriod] = React.useState<any | null>({
    label: 'Today',
    value: 'today',
  });

  const dateFilterOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Year', value: 'this_year' },
  ];

  const iconBox = {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.Colors.grayBorderLight}`,
    cursor: 'pointer',
  };
  const handleFilterClear = () => {
    setDateRange(null);
    setSelectedBranch(null);
    setSelectedPeriod({ label: 'Today', value: 'today' });
  };
  const card = [
    {
      img: TotalSaleIcon,
      img2: TotalSaleIcon,
      title: 'Total Sales',
      value: '₹ 15,45,256',
      activeTab: activeTab,
    },
    {
      img: TotalPurchaseIcon,
      img2: TotalPurchaseIcon,
      title: 'Total Purchase Value',
      value: '₹ 13,45,256',
      activeTab: activeTab,
    },
    {
      img: TotalPayableIcon,
      img2: TotalPayableIcon,
      title: 'Total Payables',
      value: '₹ 8,45,256',
      activeTab: activeTab,
    },
    {
      img: StockWeightIcon,
      img2: StockWeightIcon,
      title: 'Stock Weight',
      value: '850 g',
      activeTab: activeTab,
    },
  ];
  const card2 = [
    {
      img: TotalSaleIcon,
      img2: TotalSaleIcon,
      title: 'Total Stock Value',
      value: '₹ 1,25,45,256',
      activeTab: activeTab,
    },

    {
      img: TotalQuantityIcon,
      img2: TotalQuantityIcon,
      title: 'Total Quantity',
      value: '1,850 g',
      activeTab: activeTab,
    },
    {
      img: LowStockIcon,
      img2: LowStockIcon,
      title: 'Low Stock',
      value: '24',
      activeTab: activeTab,
    },
    {
      img: OutOfStockIcon,
      img2: OutOfStockIcon,
      title: 'Out Of Stock',
      value: '10',
      activeTab: activeTab,
    },
  ];
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  const statsData = [
    { month: 'JAN', value: 500000 },
    { month: 'FEB', value: 620000 },
    { month: 'MAR', value: 450000 },
    { month: 'APR', value: 700000 },
    { month: 'MAY', value: 850000 },
    { month: 'JUN', value: 780000 },
    { month: 'JUL', value: 900000 },
    { month: 'AUG', value: 1045000 },
    { month: 'SEP', value: 820000 },
    { month: 'OCT', value: 730000 },
    { month: 'NOV', value: 690000 },
    { month: 'DEC', value: 1200000 },
  ];
  const customData = [
    { branch: 'Golden Hub Pvt., Ltd.,', value: 12500000 },
    { branch: 'ThangaSelvi Silver', value: 20500000 },
    { branch: 'Velli Maligai', value: 11500000 },
    { branch: 'Sri Velli Alangaram', value: 14000000 },
    { branch: 'Annapoorani Velli Chemmal', value: 11600000 },
    { branch: 'ShineCraft Silver', value: 11500000 },
  ];
  return (
    <>
      <WelcomeBanner />

      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pr: 2,
          pl: 2,
          // mb: 2,
          mt: 2,
          backgroundColor: 'white',
          borderRadius: '8px',
          minHeight: '50px',
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
          }}
        >
          <Grid size={1.3}>
            <AutoSearchSelectWithLabel
              options={dateFilterOptions}
              placeholder="Today"
              value={selectedPeriod}
              onChange={(_e, value) => setSelectedPeriod(value)}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.3}>
            <AutoSearchSelectWithLabel
              options={[]}
              placeholder="Branch"
              value={selectedBranch}
              onChange={(_e, value) => setSelectedBranch(value)}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>

          <Grid size={2.3}>
            <MUHDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="01/05/2025 - 30/05/2025"
              isError={false}
              disabled={false}
            />
          </Grid>

          <Box
            sx={{
              ...iconBox,
              '&:hover': {
                borderColor: theme.Colors.primary,
              },
            }}
            onClick={handleFilterClear}
          >
            <ClearRounded
              sx={{ fontSize: '18px', color: theme.Colors.blackLightLow }}
            />
          </Box>
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
            <img src={DownloadIconPdf} width={24} height={24} alt="Download" />
          </Box>

          <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
            <img src={PrintOutIcon} width={22.5} height={23} alt="Print" />
          </Box>
        </Box>
      </Grid>

      <Box
        sx={{
          background: theme.Colors.whitePrimary,
          p: 2,
          borderRadius: '10px',
          mt: 3,
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: 8,
            color: theme.Colors.black,
          }}
        >
          OVERALL STATES
        </Typography>

        <StatusCard data={card} onClickCard={onclickActiveTab} />
        <SalesStatisticsChart
          labels={[
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
          ]}
          data={[
            { month: 'JAN', value: 2700000 },
            { month: 'FEB', value: 3200000 },
            { month: 'MAR', value: 2100000 },
            { month: 'APR', value: 2400000 },
            { month: 'MAY', value: 3600000 },
            { month: 'JUN', value: 3100000 },
            { month: 'JUL', value: 3000000 },
            { month: 'AUG', value: 2323480 },
            { month: 'SEP', value: 2800000 },
            { month: 'OCT', value: 2600000 },
            { month: 'NOV', value: 2500000 },
            { month: 'DEC', value: 3400000 },
          ]}
        />
      </Box>
      <Box
        sx={{
          background: theme.Colors.whitePrimary,
          p: 2,
          borderRadius: '10px',
          mt: 3,
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: 8,
            color: theme.Colors.black,
          }}
        >
          BRANCH PERFORMANCE
        </Typography>
        <Grid container spacing={2}>
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
                {
                  vendor: 'Golden Wrap & Co.',
                  gold: 18000000,
                  silver: 11000000,
                },
                {
                  vendor: 'Kiran Kasting Studio',
                  gold: 18000000,
                  silver: 11000000,
                },
              ]}
              title="Branch Wise Sales Status"
              height={270}
              maxValue={30000000}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TopSellingTable />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DonutChartComponent
              title="Sales By Material "
              donutTitle="70%"
              chartData={{
                series: [70, 30],
                labels: ['Gold', 'Silver'],
                colors: ['#BB4E65', '#F3CC86'],
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          background: theme.Colors.whitePrimary,
          p: 2,
          borderRadius: '10px',
          mt: 3,
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: 8,
            color: theme.Colors.black,
          }}
        >
          PURCHASE OVERVIEW
        </Typography>
        <Grid size={{ xs: 12, md: 8 }}>
          <BarChartSales
            data={customData}
            title="Vendor Purchase Statistics"
            height={270}
            maxValue={30000000}
          />
        </Grid>
        <PurchaseTable />
      </Box>
      <Box
        sx={{
          background: theme.Colors.whitePrimary,
          p: 2,
          borderRadius: '10px',
          mt: 3,
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: 8,
            color: theme.Colors.black,
          }}
        >
          CURRENT STOCK DETAILS
        </Typography>

        <StatusCard data={card2} onClickCard={onclickActiveTab} />
        <OverallStockTable />
      </Box>
    </>
  );
};

export default Dashboard;
