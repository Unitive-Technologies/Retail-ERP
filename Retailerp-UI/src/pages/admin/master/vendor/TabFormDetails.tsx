import {
  Account,
  AccountSelected,
  KycSelectedImages,
  KycUnSelectedImages,
  LoginDetailsActiveIcon,
  LoginDetailsUnActiveIcon,
  SelectedBankImages,
  UnselectedBankImages,
} from '@assets/Images/AdminImages';
import { TabComponent } from '@components/index';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import LoginDetails from '@pages/admin/common/LoginDetails';
import KYCDetails from '@pages/admin/common/KYCDetails';
import BankDetails from '@pages/admin/common/BankDetails';
import SPOCDetails from '@pages/admin/common/SPOCDetails';

type Props = {
  edit: any;
  isError: boolean;
  bankDetailsFieldErrors: any;
  loginDetailsFieldErrors: any;
  type?: string | null;
};

const TabFormDetails = ({
  edit,
  isError,
  bankDetailsFieldErrors,
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
          fieldErrors={bankDetailsFieldErrors}
          type={type}
        />
      ),
      id: 0,
    },
    {
      label: 'KYC Details',
      tabIcon: KycUnSelectedImages,
      activeIcon: KycSelectedImages,
      content: () => <KYCDetails edit={edit} type={type} />,
      id: 1,
    },
    {
      label: 'SPOC Details',
      tabIcon: Account,
      activeIcon: AccountSelected,
      content: () => <SPOCDetails edit={edit} type={type} />,
      id: 2,
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
      id: 3,
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

export default TabFormDetails;
