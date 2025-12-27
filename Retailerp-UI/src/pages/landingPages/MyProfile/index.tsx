import { Box, Button, List, ListItem, Typography, useTheme } from '@mui/material';
import { LogoutIcon } from '@assets/Images';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import AccountDetails from './AccountDetails';
import MyOrder from './MyOrder';
import Wishlist from './Wishlist';
import CartPage from './MyCart';

interface ProfileSideNavProps {
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
}

const ProfileSideNav: React.FC<ProfileSideNavProps> = ({
  selectedTab: initialSelectedTab = 'Account Details',
  setSelectedTab: externalSetSelectedTab,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [internalSelectedTab, setInternalSelectedTab] =
    useState(initialSelectedTab);

  const selectedTab = internalSelectedTab;
  const setSelectedTab = externalSetSelectedTab || setInternalSelectedTab;

  // Update selected tab based on current URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/accountDetails')) {
      setSelectedTab('Account Details');
    } else if (path.includes('/myCart')) {
      setSelectedTab('My Cart');
    } else if (path.includes('/myOrders')) {
      setSelectedTab('My Order');
    } else if (path.includes('/wishlist')) {
      setSelectedTab('Wishlist');
    } else if (path === '/home/profile') {
      setSelectedTab('Account Details');
    }
  }, [location.pathname, setSelectedTab]);

  // Navigation mapping for menu items
  const navigationMap: { [key: string]: string } = {
    'Account Details': '/home/profile/accountDetails',
    'My Cart': '/home/profile/myCart',
    'My Order': '/home/profile/myOrders',
    Wishlist: '/home/profile/wishlist',
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedTab(item);
    if (navigationMap[item]) {
      navigate(navigationMap[item], { replace: true });
    }
  };

  const handleLogout = () => {
    navigate('/home');
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'Account Details':
        return <AccountDetails />;

      case 'My Order':
        return <MyOrder />;

      case 'Wishlist':
        return <Wishlist />;

      case 'My Cart':
        return <CartPage />;

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 3 }}>
      <Typography
        style={{
          fontWeight: 500,
          color: '#782F3E',
          fontSize: '24px',
          paddingLeft: '18px',
          marginBottom: '24px',
          fontFamily: 'Roboto Slab',
        }}
      >
        My Profile
      </Typography>
      <Grid container sx={{ bgcolor: 'white' }}>
        {/* Sidebar */}
        <Grid
          size={{ xs: 12, sm: 3, md: 2.5 }}
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              height: '450px',
              border: '1px solid #E1E1E1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <List>
              {['Account Details', 'My Order', 'Wishlist', 'My Cart'].map(
                (item, idx) => {
                  const isSelected = selectedTab === item;
                  return (
                    <ListItem
                      key={idx}
                      onClick={() => handleMenuItemClick(item)}
                      sx={{
                        position: 'relative',
                        bgcolor: isSelected ? theme.Colors.primaryLight : 'transparent',
                        color: isSelected ? theme.Colors.primary : theme.Colors.black,
                        borderRadius: 2,
                        mb: 1,
                        cursor: 'pointer',
                        fontWeight: 600,
                        pl: 2,
                        fontFamily: 'Roboto Slab',
                        fontSize: '16px',
                      }}
                    >
                      {item}
                    </ListItem>
                  );
                }
              )}
            </List>
            <Button
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                color: theme.Colors.primary,
                border: `1px solid ${theme.Colors.primary}`,
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '16px',
                gap: 1,
                display: 'flex',
                justifyContent: 'left',
                fontFamily: 'Roboto Slab',
              }}
            >
              <LogoutIcon />
              Log Out
            </Button>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, sm: 9, md: 9.5 }} sx={{ p: 2 }}>
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSideNav;
