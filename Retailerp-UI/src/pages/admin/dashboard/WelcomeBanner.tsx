import { WelcomeBannerImg } from '@assets/Images';
import { Box, Typography } from '@mui/material';

const WelcomeBanner = () => {
  return (
    <Box
      sx={{
        border: '1px solid #E0E2E7',
        background: 'linear-gradient(90.47deg, #6D2E3D 4.63%, #7F3242 95.37%)',
        width: '100%',
        height: '100px',
        borderRadius: '8px',
        opacity: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, pr: 3 }}>
        <Typography
          variant="inherit"
          sx={{
            color: '#FFFFFF',
            fontWeight: 500,
            fontFamily: 'Roboto-Medium',
            fontSize: 24,
          }}
        >
          Welcome, Chaneira Jewels
        </Typography>
        <Typography
          style={{
            color: '#FFFFFF',
            fontWeight: 400,
            fontSize: 16,
          }}
        >
          Here&apos;s your organization&apos;s performance snapshot at a glance.
          Stay on top of branches, vendors, customers, and more – all in one
          place.
        </Typography>
      </Box>

      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <WelcomeBannerImg
          style={{
            height: '100%',
            width: 'auto',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
};

export default WelcomeBanner;
