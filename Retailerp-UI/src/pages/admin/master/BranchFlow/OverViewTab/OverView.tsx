import Grid from '@mui/material/Grid2';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import SalesStatisticsChart from '@components/SalesStatisticsChart';
import BarChartSales from '@components/BarChartSalesComponent';
import JewellCategory from './JewellCategory';
import StockUpdateTable from './StockUpdateTable';
import {
  TotalCustomerIcon,
  TotalRevenueIcon,
  TotalStockValueIcon,
  TotalStockWeightIcon,
} from '@assets/Images';
import StatusCard from '@components/StatusCard';
import { useState } from 'react';

const OverView = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const card = [
    {
      img: TotalCustomerIcon,
      img2: TotalCustomerIcon,
      title: 'Total Customer',
      value: '875',
      activeTab: activeTab,
    },
    {
      img: TotalRevenueIcon,
      img2: TotalRevenueIcon,
      title: 'Total Revenue',
      value: '₹5,25,563',
      activeTab: activeTab,
    },
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,
      title: 'Total Stock Value',
      value: '₹8,57,596',
      activeTab: activeTab,
    },
    {
      img: TotalStockWeightIcon,
      img2: TotalStockWeightIcon,
      title: 'Total Stock Weight',
      value: '240 Kg',
      activeTab: activeTab,
    },
  ];

  const weekData = [
    { branch: 'Mon', value: 1700 },
    { branch: 'Tue', value: 800 },
    { branch: 'Wed', value: 1600 },
    { branch: 'Thu', value: 1000 },
    { branch: 'Fri', value: 2200 },
    { branch: 'Sat', value: 500 },
    { branch: 'Sun', value: 1500 },
  ];
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  return (
    <>
      <StatusCard data={card} onClickCard={onclickActiveTab} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
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
              { month: 'JAN', value: 2700000 },
              { month: 'FEB', value: 3200000 },
              { month: 'MAR', value: 2100000 },
              { month: 'APR', value: 2400000 },
              { month: 'MAY', value: 3600000 },
              { month: 'JUN', value: 3100000 },
              { month: 'AUG', value: 2323480 },
              { month: 'SEP', value: 2800000 },
              { month: 'OCT', value: 2600000 },
              { month: 'NOV', value: 2500000 },
              { month: 'DEC', value: 3400000 },
            ]}
          />{' '}
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <JewellCategory />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BarChartSales
            data={weekData}
            title="Customer Visits"
            height={270}
            maxValue={4000}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StockUpdateTable />
        </Grid>
      </Grid>
    </>
  );
};

export default OverView;
