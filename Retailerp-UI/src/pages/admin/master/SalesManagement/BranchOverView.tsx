import {
  DownloadIconPdf,
  NewCardIcon,
  PartiallyDeliveredCardIcon,
  PrintOutIcon,
  ShippedCardIcon,
} from '@assets/Images';
import { Box, useTheme } from '@mui/material';
import StatusInactiveCard from '@components/StatusInactiveCardComponent';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import React from 'react';
import { ClearRounded } from '@mui/icons-material';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import DonutChart from './DonutChart';
import TopBuyingTable from './TopBuyingTable';
import CustomerStatistics from './CustomerStatics';
import BarChartSales from '@components/BarChartSalesComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import SalesInvoiceViewTable from './SalesInvoiceViewTable';

const BranchOverView = () => {
  const theme = useTheme();
  const location = useLocation();

  const navigateTo = useNavigate();
  const [selectedBranch, setSelectedBranch] = React.useState<any | null>(null);

  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);
  const [currentTab, setCurrentTab] = React.useState<number | string>(0);
  React.useEffect(() => {
    if (location.state) {
      sessionStorage.setItem('selectedBranch', JSON.stringify(location.state));
      setSelectedBranch(location.state);
      setCurrentTab(0);
      return;
    }

    const saved = sessionStorage.getItem('selectedBranch');
    if (saved) {
      setSelectedBranch(JSON.parse(saved));
    }
  }, [location.state]);

  const card = [
    {
      img: NewCardIcon,
      img2: NewCardIcon,
      title: 'Today Sales',
      value: '₹5,25,255',
    },
    {
      img: ShippedCardIcon,
      img2: ShippedCardIcon,
      title: 'This Month Sales',
      value: '₹13,45,256',
    },
    {
      img: PartiallyDeliveredCardIcon,
      img2: PartiallyDeliveredCardIcon,
      title: 'This Year',
      value: '₹1,40,45,256',
    },
  ];
  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/salesManagement');
    if (val === 1) navigateTo('/admin/salesManagement/branch');
  };
  const handleCardClick = (index: number) => {
    console.log('Card clicked:', index);
  };
  const handleFilterClear = () => {
    setDateRange(null);
  };
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

  return (
    <>
      <PageHeader
        title="SALES OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Sales Overview', id: 0 },
          { label: 'Branch-Wise Sales', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={handleTabChange}
        switchTabContainerWidth="262px"
      />
      {selectedBranch && (
        <Grid size={{ xs: 12, md: 12 }} mt={2}>
          <ProfileCard
            type="customer"
            mode="view"
            profileData={{
              name: selectedBranch.branch_name,
              code: `Branch ID ${selectedBranch.id}`,
              phone: selectedBranch.phone,
              address: selectedBranch.address,
              city: selectedBranch.city,
              pinCode: selectedBranch.pin,
            }}
            showAvatar
          />
        </Grid>
      )}
      <Grid
        container
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '50px',
          width: '100%',
          pr: 2,
          pl: 2,
          //   mt: 2,
          mb: 2,
          backgroundColor: 'white',
        }}
      >
        {/* LEFT SIDE */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
          <MUHDateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="DD/MM/YYYY - DD/MM/YYYY"
            isError={false}
            disabled={false}
          />

          <Box
            sx={{
              ...iconBox,
              border: `1px solid ${theme.Colors.grayBorderLight}`,
              backgroundColor: 'white',
              ':hover': {
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
            <img src={DownloadIconPdf} width={24} height={24} />
          </Box>

          <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
            <img src={PrintOutIcon} width={22.5} height={23} />
          </Box>
        </Box>
      </Grid>

      {/* All cards will be white - no active state */}
      <StatusInactiveCard
        data={card}
        onClickCard={handleCardClick}
        showActiveState={false}
      />

      {/* Charts Section */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <BarChartSales
            data={customData}
            title="Branch Wise Sales"
            height={270}
            maxValue={30000000}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DonutChart />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TopBuyingTable />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomerStatistics />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <SalesInvoiceViewTable />
        </Grid>
      </Grid>
    </>
  );
};
export default BranchOverView;
