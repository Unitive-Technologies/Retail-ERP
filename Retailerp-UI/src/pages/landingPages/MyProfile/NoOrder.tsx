import { Box, Typography, Button, useTheme } from '@mui/material';
import { NoOrderImg } from '@assets/Images';

const NoOrder = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '18px',
          alignSelf: 'flex-start',
          width: 'fit-content',
          borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
          mb: 10,
        }}
      >
        Wishlist
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.Colors.whitePrimary,
        }}
      >
        <NoOrderImg />

        <Typography
          style={{
            marginTop: 2,
            fontWeight: 600,
            fontSize: '24px',
            color: theme.Colors.black,
          }}
        >
          No Items In Your Wishlist
        </Typography>

        <Button
          sx={{
            mt: 3,
            bgcolor: '#782F3E',
            color: theme.Colors.whitePrimary,
            borderRadius: '6px',
            px: 3,
            width: '2',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '16px',
            '&:hover': { bgcolor: '#5a202c' },
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
};

export default NoOrder;
