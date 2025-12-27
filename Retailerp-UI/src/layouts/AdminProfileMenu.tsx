import { Menu, MenuItem, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ButtonComponent } from '@components/index';
import { useNavigate } from 'react-router-dom';
import {
  AdminLogout,
  ForgotMenuIcon,
  ProfileIcon,
  ProfileLocation,
  ProfileMenuLogo,
} from '@assets/Images/AdminImages';

interface AdminProfileProps {
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
  { label: 'My Profile', path: '/admin/myProfile', icon: <ProfileIcon /> },
  {
    label: 'Location Master',
    path: '/admin/locationMaster',
    icon: <ProfileLocation />,
  },
  {
    label: 'Forgot Password',
    path: '/home/profile/myCart',
    icon: <ForgotMenuIcon />,
  },
];

const AdminProfileMenu = ({ anchorEl, open, onClose }: AdminProfileProps) => {
  const navigate = useNavigate();

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
          background: '#E4E4E4',
          color: '#FFFFFF',
          padding: '22px 10px 13px 16px',
          borderRadius: '8px',
        }}
      >
        <Grid container alignItems="center" gap={1.5} flexDirection="row">
          <Grid>
            <ProfileMenuLogo />
          </Grid>
          <Grid>
            <Typography variant="h5" sx={{ color: '#313131' }}>
              Charan
            </Typography>
            <Typography variant="h6" sx={{ color: '#555B6D' }}>
              Super Admin
            </Typography>
          </Grid>
        </Grid>
      </MenuItem>

      {menuItems.map((item, idx) => (
        <MenuItem
          key={item.label}
          sx={{ ...commonMenuItemSx, mt: idx === 0 ? 2 : 1 }}
          onClick={() => handleMenuItemClick(item.path)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {item.icon}
            <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
              {item.label}
            </Typography>
          </Box>
        </MenuItem>
      ))}

      <MenuItem
        sx={{ ':hover': { background: 'none' }, mt: 3 }}
        onClick={onClose}
      >
        <Grid sx={{ width: '100%' }}>
          <ButtonComponent
            startIcon={<AdminLogout />}
            buttonText="Log Out"
            buttonFontSize={16}
            bgColor="transparent"
            buttonTextColor="#7C7C7C"
            buttonFontWeight={500}
            btnBorderRadius={1.7}
            btnHeight={40}
            border="1px solid #7C7C7C"
          />
        </Grid>
      </MenuItem>
    </Menu>
  );
};

export default AdminProfileMenu;
