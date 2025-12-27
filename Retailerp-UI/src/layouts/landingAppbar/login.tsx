import Grid from '@mui/material/Grid2';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Close, HighlightOff } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { LoginBackground, LoginImage } from '@assets/Images';
import MUHTypography from '@components/MUHTypography';
import MUHTextInput from '@components/MUHTextInput';
import { ButtonComponent } from '@components';
import { useEdit } from '@hooks/useEdit';
import { isPhoneNumber } from '@utils/form-util';
import OtpInput from './OtpInput';

const GRADIENT_BACKGROUND =
  'linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)';

const STATIC_OTP = '1234';

type AuthStep = 'ENTER_MOBILE' | 'VERIFY_OTP' | 'REGISTER_USER';

const inputStyle = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: '44px',
    borderRadius: '8px',
    width: '100%',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23) !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7D3141 !important',
      borderWidth: '1px !important',
    },
  },
};
interface LoginContainerProps {
  onSuccess: () => void;
  onClose?: () => void;
}

const Login = ({ onSuccess, onClose }: LoginContainerProps) => {
  const theme = useTheme();

  const [currentStep, setCurrentStep] = useState<AuthStep>('ENTER_MOBILE');
  const [otpCountdown, setOtpCountdown] = useState<number>(60);
  const [isResendOtpEnabled, setIsResendOtpEnabled] = useState<boolean>(false);
  const [hasInputError, setHasInputError] = useState<boolean>(false);

  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formState = useEdit({
    mobileNo: '',
    otp: '',
    name: '',
    email: '',
    registerMobileNo: '',
  });

  const handleBackNavigation = () => {
    if (currentStep === 'VERIFY_OTP') {
      setCurrentStep('ENTER_MOBILE');
    }

    if (currentStep === 'REGISTER_USER') {
      setCurrentStep('ENTER_MOBILE');
      formState.update({ mobileNo: '' });
    }
  };

  const handleMobileNumberSubmit = () => {
    if (!isPhoneNumber(formState.getValue('mobileNo'))) {
      return toast.error('Please enter a valid mobile number');
    }

    setCurrentStep('VERIFY_OTP');
    setOtpCountdown(60);
    setIsResendOtpEnabled(false);
  };

  const handleClearMobileNumber = () => {
    formState.update({ mobileNo: '' });
    setHasInputError(false);
  };

  const handleOtpVerification = () => {
    if (formState.getValue('otp') !== STATIC_OTP) {
      return toast.error('Invalid OTP');
    }

    toast.success('Login successful');
    onSuccess();
  };

  const handleResendOtpClick = () => {
    setOtpCountdown(60);
    setIsResendOtpEnabled(false);
    toast.success('OTP resent successfully');
  };

  const handleUserRegistration = () => {
    const name = formState.getValue('name');
    const email = formState.getValue('email');
    const registerMobileNo = formState.getValue('registerMobileNo');

    if (!name || !email || !registerMobileNo) {
      return toast.error('Please fill all fields');
    }

    if (!isPhoneNumber(registerMobileNo)) {
      return toast.error('Please enter a valid mobile number');
    }

    if (!email.includes('@')) {
      return toast.error('Please enter a valid email');
    }

    toast.success('Registration successful');
    onSuccess();
  };

  useEffect(() => {
    if (currentStep === 'VERIFY_OTP' && otpCountdown > 0) {
      otpTimerRef.current = setTimeout(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (otpCountdown === 0) {
      setIsResendOtpEnabled(true);
    }

    return () => {
      if (otpTimerRef.current) {
        clearTimeout(otpTimerRef.current);
      }
    };
  }, [currentStep, otpCountdown]);

  const maskedMobileLastFourDigits =
    formState.getValue('mobileNo')?.slice(-4);

  return (
    <Grid container height="100%">
      {/* CLOSE ICON */}
      {onClose && (
        <Box sx={{ position: 'absolute', top: 15, right: 20, zIndex: 1 }}>
          <IconButton
            onClick={onClose}
            sx={{ height: 30, width: 30, backgroundColor: '#F0F0F0' }}
          >
            <Close sx={{ color: '#1F1F29' }} />
          </IconButton>
        </Box>
      )}

      {/* LEFT IMAGE SECTION */}
      <Grid
        size={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: `${GRADIENT_BACKGROUND}, url(${LoginBackground})`,
          backgroundBlendMode: 'hard-light',
        }}
      >
        <img src={LoginImage} height="61%" width="88%" />
      </Grid>

      {/* RIGHT FORM SECTION */}
      <Grid size={6} container direction="column" justifyContent="center" gap={5} p={4}>
        {/* HEADER */}
        <Box display="flex" flexDirection="column" gap={2}>
          <MUHTypography
            text={currentStep === 'ENTER_MOBILE' ? 'Log in/Sign up' : 'Register'}
            size={24}
            weight={600}
          />
          <MUHTypography
            text={
              currentStep === 'ENTER_MOBILE'
                ? 'Login with your mobile number to continue shopping & manage all your invoice'
                : 'Kindly fill the below information'
            }
            size={16}
          />
        </Box>

        {/* STEP 1 – MOBILE */}
        {currentStep === 'ENTER_MOBILE' && (
          <MUHTextInput
            inputLabel="Enter Mobile Number"
            isLogin
            sx={inputStyle}
            value={formState.getValue('mobileNo')}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value) || value.length > 10) return;
              formState.update({ mobileNo: value });
            }}
            isError={hasInputError}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleClearMobileNumber}>
                  <HighlightOff sx={{ color: '#1F1F29' }} />
                </IconButton>
              ),
            }}
          />
        )}

        {/* STEP 2 – OTP */}
        {currentStep === 'VERIFY_OTP' && (
          <Box>
            <MUHTypography
              text={`Enter OTP sent to ******${maskedMobileLastFourDigits}`}
              size={16}
              sx={{ mb: 1 }}
            />
            <OtpInput onChange={(otp) => formState.update({ otp })} />

            <Box mt={1} display="flex" gap={1}>
              {!isResendOtpEnabled ? (
                <MUHTypography text={`Resend OTP in ${otpCountdown}s`} size={14} />
              ) : (
                <MUHTypography
                  text="Resend OTP"
                  size={14}
                  sx={{
                    color: '#7D3141',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                  onClick={handleResendOtpClick}
                />
              )}
            </Box>
          </Box>
        )}

        {/* STEP 3 – REGISTER */}
        {currentStep === 'REGISTER_USER' && (
          <Box display="flex" flexDirection="column" gap={1}>
            <MUHTextInput
            isLogin={true}
              inputLabel="Name"
              value={formState.getValue('name')}
              onChange={(e) => formState.update({ name: e.target.value })}
              sx={inputStyle}
            />

            <MUHTextInput
              inputLabel="Mobile Number"
            isLogin={true}
              value={formState.getValue('registerMobileNo')}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^\d*$/.test(value) || value.length > 10) return;
                formState.update({ registerMobileNo: value });
              }}
              sx={inputStyle}
            />

            <MUHTextInput
              inputLabel="Email ID"
            isLogin={true}
              value={formState.getValue('email')}
              onChange={(e) => formState.update({ email: e.target.value })}
              sx={inputStyle}
            />
          </Box>
        )}

        {/* ACTION BUTTONS */}
        <Box display="flex" flexDirection="column" gap={2}>
          <ButtonComponent
            buttonText={
              currentStep === 'ENTER_MOBILE'
                ? 'Request OTP'
                : currentStep === 'VERIFY_OTP'
                ? 'Login'
                : 'Continue'
            }
            bgColor="#7D3141"
            btnHeight={44}
            btnBorderRadius={2}
            onClick={
              currentStep === 'ENTER_MOBILE'
                ? handleMobileNumberSubmit
                : currentStep === 'VERIFY_OTP'
                ? handleOtpVerification
                : handleUserRegistration
            }
          />

          {currentStep !== 'ENTER_MOBILE' && (
            <ButtonComponent
              buttonText="Back"
              bgColor="#F3D8D9"
              buttonTextColor="black"
              btnHeight={44}
              btnBorderRadius={2}
              border="1px solid #7D3141"
              onClick={handleBackNavigation}
            />
          )}

          {currentStep === 'ENTER_MOBILE' && (
            <Typography fontSize={12} textAlign="center">
              Don't have an account?{' '}
              <span
                onClick={() => setCurrentStep('REGISTER_USER')}
                style={{
                  color: theme.Colors.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign Up
              </span>
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
