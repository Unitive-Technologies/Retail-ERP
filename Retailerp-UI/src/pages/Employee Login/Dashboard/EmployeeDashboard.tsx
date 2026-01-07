import Grid from '@mui/material/Grid2';
import { Box, Typography, useTheme } from '@mui/material';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import DonutChartComponent from '@components/DonutChartComponent';
import {
  TotalRevenueIcon,
  TotalStockValueIcon,
  CartIcon,
  DownloadIconPdf,
  PrintOutIcon,
} from '@assets/Images';
import { useState } from 'react';
import StatusCard from '@components/StatusCard';
import JewellCategory from '../master/BranchFlow/OverViewTab/JewellCategory';
import { ClearRounded } from '@mui/icons-material';
import PageHeader from '@components/PageHeader';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import React from 'react';
import { useEdit } from '@hooks/useEdit';
import SalesStatisticsChart from '@components/SalesStatisticsChart';
import BarChartSales from '@components/BarChartSalesComponent';
import OutOfTable from './OutOfTable';

const EmployeeDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);
  const edit = useEdit({
    today: null,
    branch: null,
  });
  const cardData = [
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Total Working Days',
      value: '670',
      activeTab: activeTab,
    },
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Present',
      value: '590',
      activeTab: activeTab,
    },
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,

      title: 'Absent',
      value: '₹8,57,596',
      activeTab: activeTab,
    },
  ];

  const leaveCards = [
    {
      img: CartIcon,
      title: 'Sick Leave',
      value: '5',
    },
    {
      img: CartIcon,
      title: 'Casual Leave',
      value: '3',
    },
    {
      img: CartIcon,
      title: 'Permission',
      value: '2',
    },
  ];

  // Stock Cards
  const salesCards = [
    {
      img: CartIcon,
      title: 'Sales Value',
      value: '850.00 g',
    },
    {
      img: CartIcon,
      title: 'Today Stock',
      value: '150',
    },
    {
      img: CartIcon,
      title: 'Stock Load',
      value: '50',
    },
  ];
  const customData = [
    { branch: 'Jan', value: 12500000 },
    { branch: 'Feb', value: 20500000 },
    { branch: 'Mar', value: 11500000 },
    { branch: 'Apr', value: 14000000 },
    { branch: 'May', value: 11600000 },
    { branch: 'Jun', value: 11500000 },
    { branch: 'Jul', value: 11500000 },
    { branch: 'Aug', value: 11500000 },
    { branch: 'Sep', value: 11500000 },
    { branch: 'Oct', value: 11500000 },
    { branch: 'Nov', value: 11500000 },
    { branch: 'Dec', value: 11500000 },
  ];
  const workingData = [
    { branch: 'Mon', value: 12500000 },
    { branch: 'Tue', value: 20500000 },
    { branch: 'Wed', value: 11500000 },
    { branch: 'Thu', value: 14000000 },
    { branch: 'Fri', value: 11600000 },
    { branch: 'Sat', value: 11500000 },
    { branch: 'Sun', value: 11500000 },
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
  return (
    <>
      <PageHeader
        title="DASHBOARD"
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
      />
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          gap: 2,
          width: '100%',
          mt: 2,
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
            marginBottom: 1,
          }}
        >
          <Box sx={{ width: '150px' }}>
            <AutoSearchSelectWithLabel
              options={[]}
              placeholder="Today"
              value={edit.getValue('today')}
              onChange={(e, value) => edit.update({ today: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Box>

          <Box sx={{ width: '240px' }}>
            <MUHDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
              isError={false}
              disabled={false}
            />
          </Box>

          <Box
            sx={{
              width: 35,
              height: 35,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${theme.Colors.grayBorderLight}`,
              cursor: 'pointer',
              backgroundColor: 'white',
              ':hover': {
                borderColor: theme.Colors.primary,
              },
            }}
            onClick={handleFilterClear}
          >
            <ClearRounded
              sx={{ fontSize: 18, color: theme.Colors.blackLightLow }}
            />
          </Box>
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 35,
              height: 35,
              background: theme.Colors.primaryLight,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={DownloadIconPdf} width={22} height={22} />
          </Box>

          <Box
            sx={{
              width: 35,
              height: 35,
              background: theme.Colors.primaryLight,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={PrintOutIcon} width={22} height={22} />
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
              Leave
            </Typography>
            <StatusInactiveCard data={leaveCards} layout="vertical" />
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
              Sales
            </Typography>
            <StatusInactiveCard data={salesCards} layout="vertical" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BarChartSales
            data={customData}
            title="Incentive Details"
            height={270}
            maxValue={30000000}
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
          <OutOfTable />
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDashboard;
