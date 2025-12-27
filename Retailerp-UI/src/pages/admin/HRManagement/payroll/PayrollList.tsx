import { TabComponent } from '@components/index';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import Payroll from './Payroll';
import PayrollMaster from './PayrollMaster';
import {
  PayrollIcon,
  PayrollMasterIcon,
  PayrollMasterWhiteIcon,
} from '@assets/Images';

const PayrollList = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsData = [
    {
      label: 'Payroll',
      tabIcon: PayrollIcon,
      activeIcon: PayrollIcon,
      content: () => <Payroll />,
      id: 0,
    },
    {
      label: 'Payroll Master',
      tabIcon: PayrollMasterIcon,
      activeIcon: PayrollMasterWhiteIcon,
      content: () => <PayrollMaster />,
      id: 1,
    },
  ];

  const onTabChange = (value: any) => {
    setSelectedTab(value);
  };

  const renderTabContent = (tabVal: any) => {
    const findactiveTab = tabsData.find(({ id }) => id === tabVal);
    return <>{findactiveTab ? findactiveTab.content() : null}</>;
  };

  return (
    <TabComponent
      tabContent={tabsData}
      currentTabVal={selectedTab}
      selectedTabBackgroundColor={`linear-gradient(to right, ${theme.Colors.primaryDarkStart}, ${theme.Colors.primaryDarkEnd})`}
      unSelectedFontColor={theme.Colors.primary}
      tabLabelStyle={{ fontSize: '16px' }}
      onTabChange={onTabChange}
      renderTabContent={renderTabContent}
      tabIndicatorColor="transparent"
      isDivider={true}
      showBorder={false}
    />
  );
};

export default PayrollList;
