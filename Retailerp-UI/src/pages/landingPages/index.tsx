import { LandingAppbar } from '../../layouts/landingAppbar/LandingAppbar';

import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NavigationBar from '@layouts/landingAppbar/NavigationBar';
import Footer from './Footer/Footer';

const LandingPage = () => {
  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <LandingAppbar />
      <NavigationBar />
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
      <Footer />
    </Grid>
  );
};

export default LandingPage;
