import Grid from '@mui/material/Grid2';
import {
  Box,
  Divider,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Typography,
  Drawer,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown as ArrowDownIcon, Close } from '@mui/icons-material';
import {
  FavouriteIcon,
  GoldRateArrowIcon,
  ProfileIcon,
  ShoppingBag,
  LineLoginIcon,
} from '@assets/Images';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import DeliveryPincode from './DeliveryPincode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import ProfileMenu from './ProfileMenu';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MUHDialogComp from '@components/MUHDialogComp';
import Login from './login';
import { MaterialTypeService } from '@services/materialTypeService';
import { formatCurrency } from '@constants/AmountFormats';

const LoginTitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.Colors.primary,
}));

const LoginSubtitle = styled(Typography)(() => ({
  fontSize: 12,
  opacity: 0.8,
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('md')]: {
    gap: 0,
  },
}));

const GoldRateContainer = styled(Grid)(() => ({
  minWidth: '23%',
}));

const VerticalDivider = styled(Divider)(() => ({
  mx: { xs: 0.2, xl: 0.9 },
  borderColor: '#B9B9B9',
  background: 'yellow',
}));

const ProfileContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const ProfileClickBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}));

const ArrowIcon = styled(ArrowDownIcon)(() => ({
  fontSize: 18,
  color: '#1C1B1F',
}));

const LoginMenuItem = styled(MenuItem)(() => ({
  padding: '10px 24px',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const DrawerCloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
}));

const CustomTheme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '20px',
        },
      },
    },
  },
});

interface RightContainerProps {
  goldRate: string;
  setGoldRate: (value: string) => void;
}

interface GoldRateItem {
  label: string;
  value: string;
}

const RightContainer = ({ goldRate, setGoldRate }: RightContainerProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [goldRates, setGoldRates] = useState<GoldRateItem[]>([]);

  const menuOpen = Boolean(anchorEl);
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  const fetchGoldRates = useCallback(async () => {
    try {
      const response: any = await MaterialTypeService.getAll();
      const materials = response?.data?.data?.materialTypes ?? [];

      const rates = materials
        .filter((item: any) => item.website_visibility)
        .map((item: any) => ({
          label: `${item?.purity_name || ''} ${item.material_type} - ${formatCurrency(
            item.material_price
          )}/g`,
          value: item.id,
        }));

      setGoldRates(rates);
    } catch (err) {
      console.error('Error fetching gold rates:', err);
    }
  }, []);

  useEffect(() => {
    fetchGoldRates();
  }, [fetchGoldRates]);

  const handleNavigate = useCallback(
    (path: string) => () => navigate(path),
    [navigate]
  );

  const closeLogin = useCallback(() => setLoginDialogOpen(false), []);

  return (
    <MainContainer>
      <DeliveryPincode />

      {!isMobile && (
        <GoldRateContainer>
          <ThemeProvider theme={CustomTheme}>
            <MUHSelectBoxComponent
              isCheckbox={false}
              value={goldRate}
              placeholderText="Gold & Silver Rate"
              onChange={(e) => setGoldRate(e.target.value)}
              selectItems={goldRates}
              menuItemTextColor={theme.Colors.primaryDarkStart}
              menuItemTextSize={12}
              placeholderColor={theme.Colors.primaryDarkStart}
              selectBoxStyle={{
                background: theme.Colors.primaryLight,
                borderRadius: '100px',
                fontSize: '12px',
                padding: '5px',
                color: theme.Colors.primaryDarkStart,
                height: '35px',
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': {
                  backgroundColor: 'rgba(255, 255, 255, 0.39)',
                  borderRadius: '100px',
                  padding: '6px',
                  width: '24px',
                  height: '24px',
                  mt: -0.7,
                },
              }}
              IconComponent={GoldRateArrowIcon}
            />
          </ThemeProvider>
        </GoldRateContainer>
      )}

      <VerticalDivider orientation="vertical" flexItem />

      <IconButton onClick={handleNavigate('home/profile/myCart')}>
        <img src={ShoppingBag} />
      </IconButton>

      <IconButton onClick={handleNavigate('home/profile/wishlist')}>
        <img src={FavouriteIcon} />
      </IconButton>

      <ProfileContainer>
        <ProfileClickBox
          onClick={(e) => setProfileMenuAnchorEl(e.currentTarget)}
        >
          <img src={ProfileIcon} alt="Profile" />
        </ProfileClickBox>

        <Box onClick={(e) => setAnchorEl(e.currentTarget)}>
          <ArrowIcon />
        </Box>
      </ProfileContainer>

      <ProfileMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
      />

      <Menu
        anchorEl={profileMenuAnchorEl}
        open={profileMenuOpen}
        onClose={() => setProfileMenuAnchorEl(null)}
        PaperProps={{
          style: {
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '250px',
          },
        }}
      >
        <LoginMenuItem
          onClick={() => {
            setProfileMenuAnchorEl(null);
            setLoginDialogOpen(true);
          }}
        >
          <Grid container alignItems="center" gap={1.5}>
            <img src={LineLoginIcon} width={24} height={24} />
            <Box>
              <LoginTitle>Log in now</LoginTitle>
              <LoginSubtitle>Access your account</LoginSubtitle>
            </Box>
          </Grid>
        </LoginMenuItem>
      </Menu>

      {!isMobile && (
        <MUHDialogComp
          open={loginDialogOpen}
          showTitle={false}
          dialogWidth="65.5%"
          maxWidth="lg"
          dialogHeight="68.5%"
          dialogPadding={0}
          dialogContentStyle={{ overflow: 'visible' }}
          contentPadding={0}
        >
          <Login onSuccess={closeLogin} onClose={closeLogin} />
        </MUHDialogComp>
      )}

      {isMobile && (
        <Drawer
          anchor="bottom"
          open={loginDialogOpen}
          onClose={closeLogin}
          PaperProps={{
            style: {
              borderRadius: '20px 20px 0px 0px',
              maxHeight: '90vh',
              width: '100%',
            },
          }}
        >
          <Box position="relative">
            <DrawerCloseButton>
              <IconButton
                onClick={closeLogin}
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                <Close />
              </IconButton>
            </DrawerCloseButton>
            <Login onSuccess={closeLogin} onClose={closeLogin} />
          </Box>
        </Drawer>
      )}
    </MainContainer>
  );
};

export default RightContainer;
