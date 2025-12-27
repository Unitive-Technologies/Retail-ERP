import LedgerGroupList from './ledgerGroupList';
import LedgerList from './ledgerList';
import {
  SelectedSubCategoryIcon,
  SubCategoryIcon,
  SelectedCategoryIcon,
  CategoryIcon,
} from '@assets/Images';
import { TabComponent } from '@components/index';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

const Account = () => {
   const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem('account-selected-tab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  const theme = useTheme();

  const tabsData = [
    {
      label: 'LedgerGroup',
      tabIcon: CategoryIcon,
      activeIcon: SelectedCategoryIcon,
      content: () => <LedgerGroupList />,
      id: 0,
    },
    {
      label: 'Ledger',
      tabIcon: SubCategoryIcon,
      activeIcon: SelectedSubCategoryIcon,
      content: () => <LedgerList />,
      id: 1,
    },
  ];
  const onTabChange = (value: any) => {
    setSelectedTab(value);
    localStorage.setItem('account-selected-tab', value.toString());
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

export default Account;
