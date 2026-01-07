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
import { Box, useTheme } from '@mui/material';
import BankDetails from '@pages/admin/common/BankDetails';
import LoginDetails from '@pages/admin/common/LoginDetails';
import KYCDetails from '@pages/admin/common/KYCDetails';
import PreviousExp from './PreviousExp';
import ContactDetails from './ContactDetails';
import { ContactSelectIcon, ContactUnselectIcon } from '@assets/Images';

type Props = {
  edit: any;
  isError: boolean;
  bankDetailsFieldErrors: any;
  loginDetailsFieldErrors: any;
  contactDetailsFieldErrors: any;
  type?: string | null;
};

const EmployeeTabDetails = ({
  edit,
  isError,
  bankDetailsFieldErrors,
  loginDetailsFieldErrors,
  contactDetailsFieldErrors,
  type,
}: Props) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsData = [
    {
      label: 'Contact Details',
      tabIcon: ContactUnselectIcon,
      activeIcon: ContactSelectIcon,
      content: () => (
        <ContactDetails
          edit={edit}
          isError={isError}
          fieldErrors={contactDetailsFieldErrors}
          type={type}
        />
      ),
      id: 0,
    },
    {
      label: 'Previous Exp',
      tabIcon: UnselectedBankImages,
      activeIcon: SelectedBankImages,
      content: () => (
        <PreviousExp
          edit={edit}
          isError={isError}
          fieldErrors={{}}
          type={type}
        />
      ),
      id: 1,
    },
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
      id: 2,
    },
    {
      label: 'KYC Details',
      tabIcon: KycUnSelectedImages,
      activeIcon: KycSelectedImages,
      content: () => (
        <Box sx={{ width: '100%' }}>
          <KYCDetails edit={edit} type={type} />
        </Box>
      ),
      id: 3,
    },
    {
      label: 'Login Details',
      tabIcon: Account,
      activeIcon: AccountSelected,
      content: () => (
        <Box sx={{ width: '100%' }}>
          <LoginDetails
            edit={edit}
            isError={isError}
            fieldErrors={loginDetailsFieldErrors}
            type={type}
          />
        </Box>
      ),
      id: 4,
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

export default EmployeeTabDetails;
