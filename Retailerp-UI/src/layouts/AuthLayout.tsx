import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { CircularProgress } from '@mui/material';
import { Grid } from '@mui/system';
import { LandingAppbar } from './landingAppbar/LandingAppbar';
import Footer from '@pages/landingPages/Footer/Footer';
import ScrollToTop from '@components/ScrollToTop';

const AuthLayout = () => {
  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <ScrollToTop />
      <LandingAppbar />
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
      <Footer />
    </Grid>
  );
};

export default AuthLayout;
