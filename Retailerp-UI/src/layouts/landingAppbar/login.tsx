import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Close, HighlightOff } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { LoginLeftSideImage } from '@assets/Images';
import MUHTypography from '@components/MUHTypography';
import MUHTextInput from '@components/MUHTextInput';
import { ButtonComponent } from '@components';
import { useEdit } from '@hooks/useEdit';
import { isPhoneNumber, isValidEmail } from '@utils/form-util';
import OtpInput from './OtpInput';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentStep, setCurrentStep] = useState<AuthStep>('ENTER_MOBILE');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isResendOtpEnabled, setIsResendOtpEnabled] = useState(false);
  const [hasInputError, setHasInputError] = useState(false);

  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formState = useEdit({
    mobileNo: '',
    otp: '',
    name: '',
    email: '',
  });

  const mobileNo = formState.getValue('mobileNo');
  const otp = formState.getValue('otp');
  const name = formState.getValue('name');
  const email = formState.getValue('email');

  const maskedMobileLastFourDigits = useMemo(
    () => mobileNo?.slice(-4),
    [mobileNo]
  );

  const handleBackNavigation = useCallback(() => {
    setCurrentStep((prev) =>
      prev === 'REGISTER_USER' ? 'VERIFY_OTP' : 'ENTER_MOBILE'
    );
  }, []);

  const handleMobileNumberSubmit = useCallback(() => {
    if (!isPhoneNumber(mobileNo)) {
      setHasInputError(true);
      return toast.error('Please enter a valid mobile number');
    }

    setCurrentStep('VERIFY_OTP');
    setOtpCountdown(60);
    setIsResendOtpEnabled(false);
  }, [mobileNo]);

  const handleClearMobileNumber = useCallback(() => {
    formState.update({ mobileNo: '' });
    setHasInputError(false);
  }, [formState]);

  const handleOtpVerification = useCallback(() => {
    if (otp !== STATIC_OTP) {
      return toast.error('Invalid OTP');
    }

    toast.success('Login successful');
    setCurrentStep('REGISTER_USER');
  }, [otp]);

  const handleResendOtpClick = useCallback(() => {
    setOtpCountdown(60);
    setIsResendOtpEnabled(false);
    toast.success('OTP resent successfully');
  }, []);

  const handleUserRegistration = useCallback(() => {
    if (!name || !email || !mobileNo) {
      return toast.error('Please fill all fields');
    }

    if (!isPhoneNumber(mobileNo)) {
      return toast.error('Please enter a valid mobile number');
    }

    if (!isValidEmail(email)) {
      return toast.error('Please enter a valid email address');
    }

    toast.success('Registration successful');
    onSuccess();
  }, [name, email, mobileNo, onSuccess]);

  useEffect(() => {
    if (currentStep !== 'VERIFY_OTP') return;

    if (otpCountdown > 0) {
      otpTimerRef.current = setTimeout(
        () => setOtpCountdown((prev) => prev - 1),
        1000
      );
    } else {
      setIsResendOtpEnabled(true);
    }

    return () => {
      if (otpTimerRef.current) {
        clearTimeout(otpTimerRef.current);
      }
    };
  }, [currentStep, otpCountdown]);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'stretch', height: '100%',margin:0,padding:0 }}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          display: 'flex',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? 'auto' : '100%',
          overflow: 'hidden',
        }}
      >
        <LoginLeftSideImage style={{ width: '100%', height: '100%',objectFit:'cover' }} />
      </Box>

      {/* RIGHT FORM */}
      <Box
        sx={{
          flex: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 5,
          p: isMobile ? 2 : 3,
          height: '100%',
          margin: 0,
        }}
      >
        {!isMobile && (
          <Box sx={{ position: 'absolute', top: 15, right: 20 }}>
            <IconButton
              onClick={onClose}
              sx={{ height: 30, width: 30, backgroundColor: '#F0F0F0' }}
            >
              <Close sx={{ color: '#1F1F29' }} />
            </IconButton>
          </Box>
        )}

        {/* HEADER */}
        <Box display="flex" flexDirection="column" gap={2}>
          <MUHTypography
            text={
              currentStep === 'ENTER_MOBILE' ? 'Log in/Sign up' : 'Register'
            }
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

        {/* STEP 1 */}
        {currentStep === 'ENTER_MOBILE' && (
          <MUHTextInput
            inputLabel="Enter Mobile Number"
            isLogin
            sx={inputStyle}
            value={mobileNo}
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

        {/* STEP 2 */}
        {currentStep === 'VERIFY_OTP' && (
          <Box>
            <MUHTypography
              text={`Enter OTP sent to ******${maskedMobileLastFourDigits}`}
              size={16}
              sx={{ mb: 1 }}
            />
            <OtpInput onChange={(otp) => formState.update({ otp })} />

            <Box mt={1}>
              {!isResendOtpEnabled ? (
                <MUHTypography
                  text={`Resend OTP in ${otpCountdown}s`}
                  size={14}
                />
              ) : (
                <MUHTypography
                  text="Resend OTP"
                  size={14}
                  sx={{ color: '#7D3141', cursor: 'pointer', fontWeight: 500 }}
                  onClick={handleResendOtpClick}
                />
              )}
            </Box>
          </Box>
        )}

        {/* STEP 3 */}
        {currentStep === 'REGISTER_USER' && (
          <Box display="flex" flexDirection="column" gap={1}>
            <MUHTextInput
              inputLabel="Name"
              isLogin
              value={name}
              onChange={(e) => formState.update({ name: e.target.value })}
              sx={inputStyle}
            />
            <MUHTextInput
              inputLabel="Mobile Number"
              isLogin
              value={mobileNo}
              disabled
              sx={inputStyle}
            />
            <MUHTextInput
              inputLabel="Email ID"
              isLogin
              value={email}
              onChange={(e) => formState.update({ email: e.target.value })}
              sx={inputStyle}
            />
          </Box>
        )}

        {/* ACTIONS */}
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
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
