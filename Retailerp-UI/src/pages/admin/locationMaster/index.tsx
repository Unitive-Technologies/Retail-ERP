import { TabComponent } from '@components/index';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import LocationList from './countryList';
import {
  CountryIcon,
  DistrictIcon,
  SelectedCountryIcon,
  SelectedDistrictIcon,
  SelectedState,
  StateIcon,
} from '@assets/Images/AdminImages';
import { useTheme } from '@mui/material/styles';
import StateList from './stateList';
import DistrictList from './districtList';
import PageHeader from '@components/PageHeader';

const LocationMaster = () => {
  // const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem('selected-tab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  const theme = useTheme();

  const tabsData = [
    {
      label: 'Country',
      tabIcon: CountryIcon,
      activeIcon: SelectedCountryIcon,
      content: () => <LocationList />,
      id: 0,
    },
    {
      label: 'State',
      tabIcon: StateIcon,
      activeIcon: SelectedState,
      content: () => <StateList />,
      id: 1,
    },
    {
      label: 'District',
      tabIcon: DistrictIcon,
      activeIcon: SelectedDistrictIcon,
      content: () => <DistrictList />,
      id: 2,
    },
  ];

  // const onTabChange = (value: any) => {
  //   setSelectedTab(value);
  // };
  const onTabChange = (value: any) => {
    setSelectedTab(value);
    localStorage.setItem('selected-tab', value.toString());
  };
  const renderTabContent = (tabVal: any) => {
    const findactiveTab = tabsData.find(({ id }) => id === tabVal);
    return (
      <Grid sx={{ minHeight: '200px' }}>
        {findactiveTab ? findactiveTab.content() : null}
      </Grid>
    );
  };
  return (
    <>
      <PageHeader
        title="Location MASTER"
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={false}
        titleStyle={{ color: '#000000' }}
      />
      <TabComponent
        tabContent={tabsData}
        currentTabVal={selectedTab}
        selectedTabBackgroundColor={`linear-gradient(to right, ${theme.Colors.primaryDarkStart}, ${theme.Colors.primaryDarkEnd})`}
        unSelectedFontColor={theme.Colors.primary}
        showBorder={false}
        tabParentStyle={{
          '& .MuiTab-root': {
            marginRight: 0,
            minWidth: 'max-content',
            width: 'auto',
            flexShrink: 0,
          },
        }}
        tabLabelStyle={{ fontSize: 28 }}
        onTabChange={onTabChange}
        renderTabContent={renderTabContent}
        tabIndicatorColor="transparent"
        isDivider={true}
      />
    </>
  );
};

export default LocationMaster;
