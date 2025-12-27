import Grid from '@mui/material/Grid2';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import BarChartSales from '@components/BarChartSalesComponent';
import {
  LowStockIcon,
  OutOfStockIcon,
  TotalStockValueIcon,
} from '@assets/Images';
import LowStockTable from './LowStockTable';
import OutOfStockTable from './OutOfStockTable';
import VendorContributionChart from '@components/VendorContributionChart';
import StatusCard from '@components/StatusCard';
import { useState } from 'react';

const StockDashboard = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const cardData = [
    {
      img: TotalStockValueIcon,
      img2: TotalStockValueIcon,
      title: 'Total Quantity',
      value: '1,850',
      quantity: '185.52 g',
      quantityLabel: '',
      activeTab: activeTab,
    },
    {
      img: LowStockIcon,
      img2: LowStockIcon,
      title: 'Low Stock',
      value: '25',
      quantity: '25.52 g',
      quantityLabel: '',
      activeTab: activeTab,
    },
    {
      img: OutOfStockIcon,
      img2: OutOfStockIcon,
      title: 'Out of Stock',
      value: '10',
      quantity: '12.25 g',
      quantityLabel: '',
      activeTab: activeTab,
    },
  ];

  const stockByCategoryData = [
    { branch: 'Earrings', value: 40 },
    { branch: 'Rings', value: 62 },
    { branch: 'Necklace', value: 28 },
    { branch: 'Anklets', value: 60 },
    { branch: 'Coins', value: 45 },
    { branch: 'Bars', value: 65 },
  ];
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  return (
    <>
      <StatusCard data={cardData} onClickCard={onclickActiveTab} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <BarChartSales
            data={stockByCategoryData}
            title="Stock By Category"
            height={350}
            maxValue={100}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LowStockTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <OutOfStockTable />
        </Grid>

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
            title="Vendor Contribution"
            height={270}
            maxValue={30000000}
            filterBy="value"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StockDashboard;
