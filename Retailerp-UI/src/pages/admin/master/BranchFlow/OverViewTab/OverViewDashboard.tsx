import { DownloadIconPdf, PrintOutIcon } from '@assets/Images';
import { Box, useTheme } from '@mui/material';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import React from 'react';
import { ClearRounded } from '@mui/icons-material';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from '@components/ProjectCommon/ProfileCard';
import OverView from './OverView';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import SalesDashboard from '../SalesTab/SalesDashboard';
import StockDashboard from '../StockTab/StockDashboard';
import EmployeeList from '../EmployeeTab/EmployeeList';
import CustomerList from '../CustomerTab/CustomerList';
import VendorList from '../VendorTab/VendorList';

const OverViewDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigateTo = useNavigate();

  const [selectedBranch, setSelectedBranch] = React.useState<any | null>(null);
  const [currentTab, setCurrentTab] = React.useState<number | string>(1);

  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);
  const [selectedTab, setSelectedTab] = React.useState<number | string>(0);
  React.useEffect(() => {
    if (location.state) {
      sessionStorage.setItem('selectedBranch', JSON.stringify(location.state));
      setSelectedBranch(location.state);
      setSelectedTab(0);
      return;
    }

    const saved = sessionStorage.getItem('selectedBranch');
    if (saved) {
      setSelectedBranch(JSON.parse(saved));
    }
  }, [location.state]);

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

  const tabsData = [
    {
      label: 'Overview',
      id: 0,

      content: () => <OverView />,
    },
    {
      label: 'Sales',
      id: 1,
      content: () => <SalesDashboard />,
    },
    {
      label: 'Stock',
      id: 2,
      content: () => <StockDashboard />,
    },
    {
      label: 'Employee',
      id: 3,
      content: () => <EmployeeList />,
    },
    {
      label: 'Customer',
      id: 4,
      content: () => <CustomerList />,
    },
    {
      label: 'Vendor',
      id: 5,
      content: () => <VendorList />,
    },
  ];

  const onTabChange = (val: number | string) => {
    setSelectedTab(val);
  };

  const renderTabContent = (val: number | string) => {
    const active = tabsData.find((item) => item.id === val);
    return active ? active.content() : null;
  };
  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/branch/overview');
    if (val === 1) navigateTo('/admin/branch/list');
  };
  return (
    <>
      <PageHeader
        title="BRANCH OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Branch Overview', id: 0 },
          { label: 'Branch-Wise', id: 1 },
        ]}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={handleTabChange}
        switchTabContainerWidth="fit-content"
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
      <PageHeader
        showTabNavigation={true}
        tabContent={tabsData}
        currentTabVal={selectedTab}
        onTabChange={onTabChange}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
      />

      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pr: 2,
          pl: 2,
          mb: 2,
          backgroundColor: 'white',
          borderRadius: '8px',
          mt: 2,
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
          {/* Branch Dropdown */}
          <Grid size={1.3}>
            <AutoSearchSelectWithLabel
              options={[]}
              placeholder="Branch"
              value={selectedBranch}
              onChange={(_e, value) => setSelectedBranch(value)}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>

          {/* Date Range Picker */}
          <Grid size={2.3}>
            <MUHDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="01/05/2025 - 30/05/2025"
              isError={false}
              disabled={false}
            />
          </Grid>

          {/* Clear Button */}
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
            <img src={DownloadIconPdf} width={24} height={24} alt="Download" />
          </Box>

          <Box sx={{ ...iconBox, background: theme.Colors.primaryLight }}>
            <img src={PrintOutIcon} width={22.5} height={23} alt="Print" />
          </Box>
        </Box>
      </Grid>
      <Grid py={2}>{renderTabContent(selectedTab)}</Grid>
    </>
  );
};
export default OverViewDashboard;
