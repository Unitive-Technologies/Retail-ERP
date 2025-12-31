import { TabComponent } from '@components/index';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import EmployeeList from './EmployeeList';
import RoleAccess from './RoleAccess';
import Incentives from './Incentives';
import {
  EmployeeSelectIcon,
  EmployeeUnselectIcon,
  IncentiveSelectIcon,
  IncentiveUnselectIcon,
  RoleSelectIcon,
  RoleUnselectIcon,
} from '@assets/Images';

type Props = {
  edit: any;
  isError: boolean;
  bankDetailsFieldErrors: any;
  loginDetailsFieldErrors: any;
  type?: string | null;
};

const Employee = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem('employee-selected-tab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const tabsData = [
    {
      label: 'Employee List',
      tabIcon: EmployeeUnselectIcon,
      activeIcon: EmployeeSelectIcon,
      content: () => <EmployeeList />,

      id: 0,
    },
    {
      label: 'Role Access',
      tabIcon: RoleUnselectIcon,
      activeIcon: RoleSelectIcon,
      content: () => <RoleAccess />,
      id: 1,
    },
    {
      label: 'Incentives',
      tabIcon: IncentiveUnselectIcon,
      activeIcon: IncentiveSelectIcon,
      content: () => <Incentives />,

      id: 2,
    },
  ];

  const onTabChange = (value: any) => {
    setSelectedTab(value);
    localStorage.setItem('employee-selected-tab', value.toString());
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

export default Employee;
