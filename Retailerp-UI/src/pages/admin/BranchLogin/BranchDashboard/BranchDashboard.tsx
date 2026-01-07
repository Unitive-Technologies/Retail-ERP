import Grid from '@mui/material/Grid2';
import { Box, Typography, useTheme } from '@mui/material';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import DonutChartComponent from '@components/DonutChartComponent';
import {
  TotalRevenueIcon,
  TotalStockValueIcon,
  CartIcon,
  PrintOutIcon,
  DownloadIconPdf,
} from '@assets/Images';

import { useState } from 'react';
import StatusCard from '@components/StatusCard';
import { ClearRounded } from '@mui/icons-material';
import React from 'react';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import { useEdit } from '@hooks/useEdit';
import SalesStatisticsChart from '@components/SalesStatisticsChart';
import BarChartSales from '@components/BarChartSalesComponent';
import JewellList from './JwellList';
import CustomerTable from './CustomerTable';
import EmployeeList from './EmployeeList';
import WelcomeCard from '@pages/admin/common/WelcomeCard';
import LowStockList from './LowStockTable';

const BranchDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);
  const edit = useEdit({
    today: null,
    branch: null,
  });
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
  const cardData = [
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Total Sales',
      value: '₹5,25,563',
      activeTab: activeTab,
    },
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Stock Weight',
      value: '250.25g',
      activeTab: activeTab,
    },
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,

      title: 'Revenue',
      value: '₹8,57,596',
      activeTab: activeTab,
    },
  ];

  // Revenue Cards
  const revenueCards = [
    {
      img: CartIcon,
      title: 'Cash',
      value: '₹3,44,563',
    },
    {
      img: CartIcon,
      title: 'UPI',
      value: '₹1,28,585',
    },
    {
      img: CartIcon,
      title: 'Card',
      value: '₹95,858',
    },
  ];

  // Stock Cards
  const stockCards = [
    {
      img: CartIcon,
      title: 'Opening Stock',
      value: '850.00 g',
    },
    {
      img: CartIcon,
      title: 'Sales',
      value: '120.00 g',
    },
    {
      img: CartIcon,
      title: 'Old Silver',
      value: '₹25.00 g',
    },
    {
      img: CartIcon,
      title: 'Closing Stock',
      value: '770.00 g',
    },
  ];

  const salesByGroupData = {
    series: [245858, 150000, 129705],
    labels: ['Sales', 'Repair', 'Scheme'],
    colors: ['#7A1B2F', '#F3CC86', '#FFE5E5'],
  };
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  const handleFilterClear = () => {
    setDateRange(null);
  };
  const workingData = [
    { branch: 'Mon', value: 12500000 },
    { branch: 'Tue', value: 20500000 },
    { branch: 'Wed', value: 11500000 },
    { branch: 'Thu', value: 14000000 },
    { branch: 'Fri', value: 11600000 },
    { branch: 'Sat', value: 11500000 },
    { branch: 'Sun', value: 11500000 },
  ];
  return (
    <>
      <WelcomeCard />
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
              options={[]}
              placeholder="Today"
              value={edit.getValue('today')}
              onChange={(e, value) => edit.update({ today: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>

          <Grid size={1.3}>
            <AutoSearchSelectWithLabel
              options={[]}
              placeholder="Branch"
              value={edit.getValue('branch')}
              onChange={(e, value) => edit.update({ branch: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>

          <Grid size={2.3}>
            <MUHDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
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
      <StatusCard data={cardData} onClickCard={onclickActiveTab} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Revenue Section */}
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: 3,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: theme.Colors.black,
                mb: 2,
              }}
            >
              Revenue
            </Typography>
            <StatusInactiveCard data={revenueCards} layout="vertical" />
          </Box>

          {/* Stock Section */}
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: theme.Colors.black,
                mb: 2,
              }}
            >
              Stock
            </Typography>
            <StatusInactiveCard data={stockCards} layout="vertical" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <DonutChartComponent
            title="Sales by Group"
            donutTitle="5,25,563"
            chartData={salesByGroupData}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
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
              { month: 'JAN', value: 62000 },
              { month: 'FEB', value: 100000 },
              { month: 'MAR', value: 50000 },
              { month: 'APR', value: 68000 },
              { month: 'MAY', value: 102000 },
              { month: 'JUN', value: 600000 },
              { month: 'JUL', value: 98000 },
              { month: 'AUG', value: 65348 },
              { month: 'SEP', value: 78000 },
              { month: 'OCT', value: 70000 },
              { month: 'NOV', value: 56000 },
              { month: 'DEC', value: 95000 },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartSales
            data={workingData}
            title="Working Hours"
            height={270}
            maxValue={30000000}
          />{' '}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LowStockList />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <JewellList />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EmployeeList />
        </Grid>
      </Grid>
    </>
  );
};

export default BranchDashboard;
