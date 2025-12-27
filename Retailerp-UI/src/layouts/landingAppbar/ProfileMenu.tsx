import { Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { AccountIcon, LogoutIcon } from '@assets/Images';
import Grid from '@mui/material/Grid2';
import { ButtonComponent } from '@components/index';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const commonMenuItemSx = {
  minHeight: '40px',
  fontSize: '16px',
  mx: 1.3,
};

const menuItems = [
  { label: 'My Order', path: '/home/profile/myOrders' },
  { label: 'Wishlist', path: '/home/profile/wishlist' },
  { label: 'My Cart', path: '/home/profile/myCart' },
  { label: 'Contact Us', path: '/home/contact' },
];

const ProfileMenu = ({ anchorEl, open, onClose }: ProfileMenuProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const GRADIENT_BG = `linear-gradient(90deg, ${theme.Colors.primaryDarkStart} 0%, ${theme.Colors.primaryDarkEnd} 100%)`;

  const handleMenuItemClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '8px',
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
          minWidth: '17%',
        },
      }}
      MenuListProps={{
        sx: { paddingTop: 0 },
      }}
    >
      <MenuItem
        sx={{
          background: GRADIENT_BG,
          color: theme.Colors.whitePrimary,
          padding: '22px 10px 13px 16px',
          '&:hover': { background: GRADIENT_BG },
          borderRadius: '8px',
        }}
      >
        <Grid container alignItems="center" gap={1.5} flexDirection="row">
          <Grid>
            <img src={AccountIcon} alt="Profile" />
          </Grid>
          <Grid>
            <Typography variant="h5" sx={{ color: theme.Colors.whitePrimary }}>
              Charan
            </Typography>
            <Typography variant="h6" sx={{ color: theme.Colors.whitePrimary }}>
              +91 9586958957
            </Typography>
          </Grid>
        </Grid>
      </MenuItem>
      {/* {menuItems.map((item, idx) => (
        <MenuItem
          key={item}
          sx={{ ...commonMenuItemSx, mt: idx === 0 ? 2 : 1 }}
          onClick={onClose}
        >
          <Typography>{item}</Typography>
        </MenuItem>
      ))} */}
      {menuItems.map((item, idx) => (
        <MenuItem
          key={item.label}
          sx={{ ...commonMenuItemSx, mt: idx === 0 ? 2 : 1 }}
          onClick={() => handleMenuItemClick(item.path)}
        >
          <Typography>{item.label}</Typography>
        </MenuItem>
      ))}

      <MenuItem
        sx={{ ':hover': { background: 'none' }, mt: 3 }}
        onClick={onClose}
      >
        <Grid sx={{ width: '100%' }}>
          <ButtonComponent
            startIcon={<LogoutIcon />}
            buttonText="Log Out"
            buttonFontSize={16}
            bgColor="transparent"
            buttonTextColor={theme.Colors.primary}
            buttonFontWeight={500}
            btnBorderRadius={1.7}
            btnHeight={40}
            border={`1px solid ${theme.Colors.primary}`}
          />
        </Grid>
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
