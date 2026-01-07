import { DownloadIconPdf, PrintOutIcon, SchemeCartIcon } from '@assets/Images';
import { SendQuotationIcon } from '@assets/Images/AdminImages';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import PageHeader from '@components/PageHeader';
import StatusCard from '@components/StatusCard';
import { ClearRounded } from '@mui/icons-material';
import { Box, Chip, IconButton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import DonutChartComponent from '@components/DonutChartComponent';
import ConversionRateChart from '@components/ConversionRateChart';
import WelcomeCard from '../../common/WelcomeCard';
import QuotationTable from './QuotationTable';
import DueListTable from './DueListTable';
import NotificationList from './NotificationList';

const VendorDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navigateTo = useNavigate();
  const [currentTab, setCurrentTab] = React.useState<number | string>(0);
  const onclickActiveTab = (index: number) => setActiveTab(index);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { rowData } = location.state || {};

  const card = [
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Gold Value',
      value: 12555585,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Silver Value',
      value: 185.52,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Amount Received',
      value: 25,
      activeTab,
    },
    {
      img: SendQuotationIcon,
      img2: SendQuotationIcon,
      title: 'Outstanding Amount',
      value: 10,
      activeTab,
    },
  ];

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
        title="Dashboard"
        showlistBtn={false}
        showDownloadBtn={true}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
      />

      <Grid size={12}>
        <WelcomeCard />
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
          <ConversionRateChart
            quotationData={[80, 70, 75, 90, 85, 78, 70, 65, 60, 50, 40, 35]}
            salesOrderData={[45, 55, 48, 40, 32, 30, 35, 50, 48, 46, 32, 28]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatusInactiveCard
            layout="vertical"
            containerDirection="column"
            data={[
              {
                img: SchemeCartIcon,
                title: 'Total Quotation Received',
                value: '86',
              },
              {
                img: SchemeCartIcon,
                title: 'Total Sales Order',
                value: '77',
              },
              {
                img: SchemeCartIcon,
                title: 'Rejected Quotation',
                value: '86',
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <QuotationTable />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <DonutChartComponent
            title="Revenue Statistics "
            donutTitle="70%"
            chartData={{
              series: [70, 30, 50],
              labels: [
                'Sales Order Amount',
                'Received Amount',
                'Outstanding Amount',
              ],
              colors: ['#BB4E65', '#F3CC86', '#F3D8D9'],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <DueListTable />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <NotificationList />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VendorDashboard;
