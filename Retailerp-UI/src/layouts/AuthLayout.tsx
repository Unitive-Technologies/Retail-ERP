import { Suspense } from 'react';
import { Outlet } from 'react-router';
// import Container from '@mui/material/Container';
import { Box, CircularProgress, useTheme } from '@mui/material';

const AuthLayout = () => {
  const theme = useTheme();
  return (
    // <Container id="auth-layout" component="main" disableGutters maxWidth="lg">
    <Box sx={{ backgroundColor: theme.Colors.snowWhite, height: '100vh' }}>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </Box>
    // </Container>
  );
};

export default AuthLayout;
