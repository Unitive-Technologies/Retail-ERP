import { StayConnectBackgroundImage } from '@assets/Images';
import { ButtonComponent } from '@components/index';
import MUHTextInput from '@components/MUHTextInput';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

const GRADIENT =
  'linear-gradient(180deg, rgba(71, 25, 35, 1) 0%, rgba(127, 50, 66, 1) 100%)';
const StayConnected = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        mt: 2,
        background: {
          xs: GRADIENT,
          sm: GRADIENT,
          md: `${GRADIENT}, url(${StayConnectBackgroundImage})`,
        },
        backgroundBlendMode: 'overlay',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        py: 5,
        px: 2,
      }}
    >
      <Grid
        container
        width={{ xs: '100%', sm: '100%', md: '42%' }}
        sx={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        <Typography
          variant="planBoxHeading"
          sx={{ fontWeight: 700, color: theme.Colors.whitePrimary, fontFamily: 'Roboto Slab' }}
        >
          Stay Connected
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, color: theme.Colors.whitePrimary, fontFamily: 'Roboto Slab' }}
        >
          Subscribe to our newsletter and never miss an update, offer, or
          inspiration.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 3, lg: 3 }} mt={2}>
        <MUHTextInput
          placeholderText="Enter your email"
          placeholderColor={theme.Colors.whitePrimary}
          placeholderFontSize={14}
          fontSize={14}
          fontWeight={400}
          inputColor={theme.Colors.whitePrimary}
          height={40}
          borderWidth={1.5}
          borderColor="#C3C3C3"
        />
      </Grid>
      <Box minWidth={'120px'} mt={2}>
        <ButtonComponent
          buttonText="Send"
          buttonFontSize={16}
          bgColor={theme.Colors.whitePrimary}
          buttonTextColor={theme.Colors.primary}
          buttonFontWeight={500}
          btnBorderRadius={1.5}
          btnHeight={38}
        />
      </Box>
    </Grid>
  );
};

export default StayConnected;
