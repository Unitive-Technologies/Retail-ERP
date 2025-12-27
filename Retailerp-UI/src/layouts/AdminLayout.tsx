import { Suspense, useCallback, useState } from 'react';
import { Outlet } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import AppBar from './Appbar';
import SideNav from './SideNav';
import Main from './Main';
import DrawerHeader from './Header';

const drawerWidth = 250;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);

  const onMenuClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <Box
      id="dashboard-layout"
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <AppBar open={open} drawerWidth={drawerWidth} onMenuClick={onMenuClick} />
      <SideNav drawerWidth={drawerWidth} open={open} />
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<CircularProgress />}>
            <Outlet />
          </Suspense>
        </Box>
      </Main>
    </Box>
  );
};

export default AdminLayout;
