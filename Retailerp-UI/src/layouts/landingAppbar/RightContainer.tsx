import Grid from '@mui/material/Grid2';
import { Box, Divider, IconButton, useMediaQuery } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import {
  FavouriteIcon,
  GoldRateArrowIcon,
  ProfileIcon,
  ShoppingBag,
} from '@assets/Images';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import DeliveryPincode from './DeliveryPincode';
import { GoldRates } from '@constants/DummyData';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import ProfileMenu from './ProfileMenu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MUHDialogComp from '@components/MUHDialogComp';
import Login from './login';

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

const RightContainer = ({ goldRate, setGoldRate }: RightContainerProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setLoginDialogOpen(true);
  };

  return (
    <Grid
      display={'flex'}
      flexGrow={1}
      alignItems="center"
      justifyContent="flex-end"
    >
      <DeliveryPincode />
      {!isMobile && (
        <Grid minWidth={'23%'} ml={1} mr={1}>
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
        </Grid>
      )}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 0.9, borderColor: '#B9B9B9', background: 'yellow' }}
      />
      <Box ml={0.1}>
        <IconButton>
          <img src={ShoppingBag} />
        </IconButton>
      </Box>

      <Box ml={0.5}>
        <IconButton>
          <img src={FavouriteIcon} />
        </IconButton>
      </Box>

      <Box ml={1}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',

            cursor: 'pointer',
          }}
        >
          <Box
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <img
              src={ProfileIcon}
              style={{ cursor: 'pointer' }}
              alt="Profile"
            />
          </Box>

          <Box
            onClick={handleMenuOpen}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
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

        <ProfileMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        />
      </Box>
      <MUHDialogComp
        open={loginDialogOpen}
        showTitle={false}
        dialogWidth={'65.5%'}
        maxWidth={'lg'}
        dialogHeight={'68.5%'}
        dialogPadding={0}
        contentPadding={0}
        children={<Login onSuccess={() => setLoginDialogOpen(false)} onClose={() => setLoginDialogOpen(false)} />}
      />
    </Grid>
  );
};

export default RightContainer;
