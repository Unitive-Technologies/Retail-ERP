import {
  KycSelectedImages,
  KycUnSelectedImages,
  LoginDetailsActiveIcon,
  LoginDetailsUnActiveIcon,
  SelectedBankImages,
  UnselectedBankImages,
} from '@assets/Images/AdminImages';
import BankDetails from '../common/BankDetails';
import KYCDetails from '../common/KYCDetails';
import { TabComponent } from '@components/index';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import LoginDetails from '../common/LoginDetails';

type Props = {
  edit: any;
  isError: boolean;
  fieldErrors: any;
  loginDetailsFieldErrors?: any;
  type?: string | null;
};

const TabFormDetails = ({
  edit,
  isError,
  fieldErrors,
  loginDetailsFieldErrors,
  type,
}: Props) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsData = [
    {
      label: 'Bank Details',
      tabIcon: UnselectedBankImages,
      activeIcon: SelectedBankImages,
      content: () => (
        <BankDetails
          edit={edit}
          isError={isError}
          fieldErrors={fieldErrors}
          isProfile={true}
        />
      ),
      id: 0,
    },
    {
      label: 'KYC Details',
      tabIcon: KycUnSelectedImages,
      activeIcon: KycSelectedImages,
      content: () => <KYCDetails edit={edit} />,
      id: 1,
    },
    {
      label: 'Login Details',
      tabIcon: LoginDetailsUnActiveIcon,
      activeIcon: LoginDetailsActiveIcon,
      content: () => (
        <LoginDetails
          edit={edit}
          isError={isError}
          fieldErrors={loginDetailsFieldErrors}
          type={type}
        />
      ),
      id: 2,
    },
  ];

  const onTabChange = (value: number) => {
    setSelectedTab(value);
  };

  const renderTabContent = (tabVal: number) => {
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

export default TabFormDetails;
