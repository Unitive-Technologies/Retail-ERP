import { Box, Button, List, ListItem, useTheme } from '@mui/material';
import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import PlanSelection from './PlanSelection';
import KYCDetails from './KYCDetails';
import PaymentCheckout from './PaymentCheckout';
import BasicDetail from './BasicDetail';
import { ButtonComponent } from '@components/index';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TickIcon } from '@assets/Images';

interface ProfileSideNavProps {
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
  onClose?: () => void;
}

const SchemeSideNav: React.FC<ProfileSideNavProps> = ({
  selectedTab: initialSelectedTab = 'Basic Details',
  setSelectedTab: externalSetSelectedTab,
  onClose,
}) => {
  const theme = useTheme();

  const [internalSelectedTab, setInternalSelectedTab] =
    useState(initialSelectedTab);

  const selectedTab = internalSelectedTab;
  const setSelectedTab = externalSetSelectedTab || setInternalSelectedTab;
  const initialData = {
    idProof: 'PAN Card',
    idProofNo: 'GMTPP587DF8',
    nominee: 'Kannan',
    nomineeRelation: 'Kannan',
  };
  const handleFormChange = () => {
    console.log('KYC Form Data Updated:');
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedTab(item);
  };
  const handlePayNow = () => {};

  const handleContinue = () => {
    const tabs = [
      'Basic Details',
      'Plan Details',
      'KYC Details',
      'Payment Checkout',
    ];

    const currentIndex = tabs.indexOf(selectedTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      setSelectedTab(nextTab);
    } else {
      onClose?.();
    }
  };

  const getStepStatus = (item: string) => {
    const tabs = [
      'Basic Details',
      'Plan Details',
      'KYC Details',
      'Payment Checkout',
    ];

    const currentIndex = tabs.indexOf(selectedTab);
    const itemIndex = tabs.indexOf(item);

    if (itemIndex < currentIndex) return 'completed';
    if (itemIndex === currentIndex) return 'active';
    return 'pending';
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'Basic Details':
        return (
          <>
            <BasicDetail />
          </>
        );

      case 'Plan Details':
        return <PlanSelection />;

      case 'KYC Details':
        return (
          <KYCDetails
            onFormChange={handleFormChange}
            initialData={initialData}
          />
        );

      case 'Payment Checkout':
        return <PaymentCheckout />;

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Grid container>
        {/* Sidebar */}
        <Grid size={{ xs: 12, sm: 3, md: 4 }} sx={{ pr: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              height: '525px',
              border: '1px solid #E1E1E1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <List>
              {[
                'Basic Details',
                'Plan Details',
                'KYC Details',
                'Payment Checkout',
              ].map((item, idx) => {
                const status = getStepStatus(item);
                const isCompleted = status === 'completed';
                const isActive = status === 'active';

                return (
                  <ListItem
                    key={idx}
                    onClick={() => handleMenuItemClick(item)}
                    sx={{
                      fontFamily: 'Roboto Slab',
                      position: 'relative',
                      bgcolor: isActive ? '#F4D4D6' : 'transparent',
                      color: isCompleted
                        ? theme.Colors.primary
                        : isActive
                          ? theme.Colors.primary
                          : theme.Colors.black,
                      borderRadius: isActive ? '12px 40px 40px 12px' : '8px',
                      mb: 1,
                      cursor: 'pointer',
                      fontWeight: isCompleted || isActive ? 600 : 400,
                      fontSize: '16px',
                      pl: 2,
                      py: 1.5,
                      pr: isActive ? 4 : 2,
                      mr: isActive ? -2 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {isCompleted && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1,
                        }}
                      >
                        <TickIcon />
                      </Box>
                    )}
                    {item}
                  </ListItem>
                );
              })}
            </List>
            <Button
              onClick={onClose}
              sx={{
                textTransform: 'none',
                color: theme.Colors.primary,
                border: `1px solid ${theme.Colors.primary}`,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                gap: 1,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                fontFamily: 'Roboto Slab',
              }}
            >
              <ArrowBackIcon
                sx={{ fontSize: '16px', color: theme.Colors.primary }}
              />
              Back To Scheme
            </Button>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid
          size={{ xs: 12, sm: 9, md: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              mt: 4,
              mr: 2,
            }}
          >
            <ButtonComponent
              buttonText={
                selectedTab === 'Payment Checkout' ? 'Pay Now' : 'Continue'
              }
              buttonFontSize={12}
              bgColor={`linear-gradient(90deg, ${theme.Colors.primary} 0%, ${theme.Colors.primaryDarkEnd} 100%)`}
              buttonTextColor={theme.Colors.whitePrimary}
              buttonFontWeight={500}
              btnBorderRadius={1.7}
              endIcon={<ArrowForwardIcon />}
              btnWidth={200}
              btnHeight={40}
              // onClick={handleContinue}
              onClick={
                selectedTab === 'Payment Checkout'
                  ? handlePayNow
                  : handleContinue
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchemeSideNav;
