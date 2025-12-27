import { useState } from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { createTheme, styled, ThemeProvider, useTheme } from '@mui/material/styles';
import { ArrowBackIos, NotificationsNoneOutlined } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { ButtonComponent } from '@components/index';
import {
  BillingIcon,
  GoldRateArrowIcon,
  LandingAppbarLogo,
} from '@assets/Images';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { GoldRates } from '@constants/DummyData';
import { Badge } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminProfileMenu from './AdminProfileMenu';

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

interface AppBarProps extends MuiAppBarProps {
  open: boolean;
  drawerWidth: number;
  onMenuClick: () => void;
}

const AppbarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.Colors.whitePrimary,
  boxShadow: 'none',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    backgroundColor: theme.Colors.whitePrimary,
    boxShadow: 'none',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;

const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    height: '13px',
    minWidth: '24px',
    borderRadius: '500px',
    fontSize: '9px',
    backgroundColor: theme.palette.warning.main,
    color: theme.Colors.whitePrimary,
    top: -4,
  },
}));
const Appbar = (props: AppBarProps) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [goldRate, setGoldRate] = useState('');
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const handleProfileClick = (e:any) => {
    setProfileAnchorEl(e.currentTarget);
  };
  const handleProfileClose = () => setProfileAnchorEl(null);

  const left = () => {
    return (
      <IconButton
        sx={{
          background: theme.Colors.primaryLight,
          width: '24px',
          height: '24px',
          ':hover': { background: theme.Colors.primaryLight },
          transform: props.open ? 'rotate(360deg)' : 'rotate(180deg)',
        }}
        onClick={props.onMenuClick}
      >
        <ArrowBackIos sx={{ color: theme.Colors.primaryDarkEnd, p: 0.5, pl: 1 }} />
      </IconButton>
    );
  };

  const right = () => {
    return (
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ mr: 2 }}>
          <ButtonComponent
            startIcon={<BillingIcon />}
            buttonText="Billing"
            buttonFontSize={12}
            bgColor={theme.Colors.primary}
            buttonTextColor={theme.Colors.whitePrimary}
            buttonFontWeight={500}
            btnBorderRadius={100}
            btnHeight={35}
            buttonStyle={{ fontFamily: 'Roboto slab' }}
          />
        </Box>

        <ThemeProvider theme={CustomTheme}>
          <MUHSelectBoxComponent
            isCheckbox={false}
            value={goldRate}
            placeholderText="Gold & Silver Rate"
            onChange={(e) => setGoldRate(e.target.value)}
            selectItems={GoldRates}
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
              fontFamily: 'Roboto slab',
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
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
        <Box sx={{ ml: 2 }}>
          <CustomBadge badgeContent={3} color="warning">
            <NotificationsNoneOutlined sx={{ color: theme.Colors.blackLight }} />
          </CustomBadge>
        </Box>
        <Box
          sx={{
            width: '33px',
            height: '33px',
            background: GRADIENT_BG,
            borderRadius: '100px',
            ml: 4,
          }}
        >
          <img
            src={LandingAppbarLogo}
            style={{ objectFit: 'cover', width: '33px', height: '33px' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 1,
            cursor: 'pointer',
          }}
          onClick={handleProfileClick}
        >
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <MUHTypography
              text="Chaneira Jewel"
              size={13}
              color={theme.Colors.blackSecondary}
              sx={{ lineHeight: '14px' }}
            />
            <MUHTypography text="Super Admin" size={10} color={theme.Colors.blackLight} />
          </Box>
          <Box>
            <ArrowDownIcon
              sx={{
                fontSize: 18,
                ml: 0.1,
                color: '#1C1B1F',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <AppbarStyled {...props} position="fixed">
      <Toolbar
        sx={{
          minHeight: '60px !important',
          height: '60px !important',
          p: '18px !important',
          pr: '14px !important',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.Colors.grayLight}`,
        }}
      >
        {left()} {right()}
        <AdminProfileMenu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
        />
      </Toolbar>
    </AppbarStyled>
  );
};

export default Appbar;
