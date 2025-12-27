import Grid from '@mui/material/Grid2';
import { Box, Typography, useTheme } from '@mui/material';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import DonutChartComponent from '@components/DonutChartComponent';
import {
  TotalRevenueIcon,
  TotalStockValueIcon,
  CartIcon,
} from '@assets/Images';
import JewellCategory from '../OverViewTab/JewellCategory';
import CustomerTable from '../CustomerTable';
import EmployeeTable from '../EmployeeTable';
import RecentSalesTable from './RecentSalesTable';
import { useState } from 'react';
import StatusCard from '@components/StatusCard';

const SalesDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);

  const cardData = [
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Total Sales Value',
      value: '₹5,25,563',
      activeTab: activeTab,
    },
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Total Purchase Value',
      value: '₹8,25,563',
      activeTab: activeTab,
    },
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,

      title: 'Total Stock Value',
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
  return (
    <>
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
          <JewellCategory />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EmployeeTable />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <RecentSalesTable />
        </Grid>
      </Grid>
    </>
  );
};

export default SalesDashboard;
