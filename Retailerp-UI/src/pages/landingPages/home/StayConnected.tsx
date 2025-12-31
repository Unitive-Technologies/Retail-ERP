import { StayConnectBackgroundImage } from '@assets/Images';
import { ButtonComponent } from '@components/index';
import MUHTextInput from '@components/MUHTextInput';
import { Box, Typography, useTheme, Snackbar, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

const GRADIENT =
  'linear-gradient(180deg, rgba(71, 25, 35, 1) 0%, rgba(127, 50, 66, 1) 100%)';
const StayConnected = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSendClick = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // If validation passes, clear the input and show success
    setEmail('');
    setEmailError('');
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    // Here you can add the actual newsletter subscription logic
    console.log('Newsletter subscription:', email);
  };

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
          value={email}
          onChange={handleEmailChange}
          placeholderText="Enter your email"
          placeholderColor={theme.Colors.whitePrimary}
          placeholderFontSize={14}
          fontSize={14}
          fontWeight={400}
          inputColor={theme.Colors.whitePrimary}
          height={40}
          borderWidth={1.5}
          borderColor={emailError ? theme.Colors.redPrimary : "#C3C3C3"}
          focusBorderColor={emailError ? theme.Colors.redPrimary : theme.Colors.whitePrimary}
          backgroundColor="transparent"
          isError={!!emailError}
          helperText={emailError}
          fieldSetStyle={{
            '&.Mui-focused': {
              backgroundColor: 'transparent !important',
            },
            '&:hover': {
              backgroundColor: 'transparent !important',
            },
          }}
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
          onClick={handleSendClick}
        />
      </Box>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Thank you for subscribing!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShowSuccess(false)}
            sx={{
              color: theme.Colors.whitePrimary,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: theme.Colors.primary,
            color: theme.Colors.whitePrimary,
            fontFamily: 'Roboto Slab',
            fontSize: '14px',
            borderRadius: '8px',
          },
        }}
      />
    </Grid>
  );
};

export default StayConnected;
