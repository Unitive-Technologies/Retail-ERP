import {
  ActiveIcon,
  DownloadIconPdf,
  InActiveIcon,
  PrintOutIcon,
  TotalBranchIcon,
} from '@assets/Images';
import { Box, useTheme } from '@mui/material';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import React, { useState } from 'react';
import { ClearRounded } from '@mui/icons-material';
import PageHeader from '@components/PageHeader';
import Grid from '@mui/material/Grid2';
import BarChartSales from '@components/BarChartSalesComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { CommonFilterAutoSearchProps } from '@components/CommonStyles';
import { useEdit } from '@hooks/useEdit';
import CustomerTable from './CustomerTable';
import EmployeeTable from './EmployeeTable';
import BranchStatusTable from './BranchStatusTable';
import StatusCard from '@components/StatusCard';

const BranchOverview = () => {
  const theme = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const edit = useEdit({
    today: null,
    branch: null,
  });
  const navigateTo = useNavigate();
  const [, setSelectedBranch] = React.useState<unknown>(null);

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
      img: TotalBranchIcon,
      img2: TotalBranchIcon,
      title: 'Today Branch',
      value: '10',
      activeTab: activeTab,
    },
    {
      img: ActiveIcon,
      img2: ActiveIcon,
      title: 'Active',
      value: '8',
      activeTab: activeTab,
    },
    {
      img: InActiveIcon,
      img2: InActiveIcon,
      title: 'In Active',
      value: '2',
      activeTab: activeTab,
    },
  ];
  const onclickActiveTab = (index: number) => {
    setActiveTab(index);
  };
  const handleTabChange = (val: number | string) => {
    setCurrentTab(val);
    if (val === 0) navigateTo('/admin/branch/overview');
    if (val === 1) navigateTo('/admin/branch/list');
  };
  const handleFilterClear = () => {
    setDateRange(null);
  };
  const customData = [
    { branch: 'Thomgesday silver', value: 28000000 },
    { branch: 'Vieil Malojah', value: 25000000 },
    { branch: 'Sv Ivell Atanparan', value: 20000000 },
    { branch: 'Aatrina Silver Mart', value: 15000000 },
    { branch: 'Anagaroran Vieil Chiamnal', value: 10000000 },
    { branch: 'Simacrahl Silver', value: 5000000 },
    { branch: 'Simacrahl Silver', value: 4500000 },
    { branch: 'Simacrahl Silver', value: 4000000 },
  ];
  return (
    <>
      <PageHeader
        title="BRANCH OVERVIEW"
        useSwitchTabDesign={true}
        tabContent={[
          { label: 'Branch Overview', id: 0 },
          { label: 'Branch-Wise', id: 1},
        ]}
        showlistBtn={false}
        showDownloadBtn={false}
        showCreateBtn={false}
        showBackButton={false}
        currentTabVal={currentTab}
        onTabChange={handleTabChange}
        switchTabContainerWidth="fit-content"
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
              onChange={(_e, value) => edit.update({ today: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Box>

          <Box sx={{ width: '150px' }}>
            <AutoSearchSelectWithLabel
              options={[]}
              placeholder="Branch"
              value={edit.getValue('branch')}
              onChange={(_e, value) => edit.update({ branch: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Box>

          <Box sx={{ width: '220px' }}>
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
              width: 28,
              height: 28,
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

      <StatusCard data={card} onClickCard={onclickActiveTab} />

      {/* Charts Section */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerTable />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EmployeeTable />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <BarChartSales
            data={customData}
            title="Branch Sales Comparison"
            height={270}
            maxValue={30000000}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <BranchStatusTable />
        </Grid>
      </Grid>
    </>
  );
};

export default BranchOverview;
