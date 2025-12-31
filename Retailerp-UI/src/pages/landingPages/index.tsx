import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NavigationBar from '@layouts/landingAppbar/NavigationBar';

const LandingPage = () => {
  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavigationBar />
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </Grid>
  );
};

export default LandingPage;
