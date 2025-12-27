import { useState, useRef } from 'react';
import { Box } from '@mui/material';
import MUHTextInput from '@components/MUHTextInput';

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
}
const inputStyle = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: '44px',
    borderRadius: '8px',
    width: '100%',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23) !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#424242 !important',
      borderWidth: '1px !important',
    },
  },
};
const OtpInput = ({ length = 4, onChange }: OtpInputProps) => {
  const [otpValues, setOtpValues] = useState(Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    onChange(newOtp.join(''));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const newOtp = [...otpValues];
      newOtp[index - 1] = '';
      setOtpValues(newOtp);
      onChange(newOtp.join(''));
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('Text').slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtpValues(newOtp);
      onChange(newOtp.join(''));
      inputsRef.current[newOtp.length - 1]?.focus();
    }
    e.preventDefault();
  };

  return (
    <Box display="flex" gap={1.6} onPaste={handlePaste}>
      {otpValues.map((val, idx) => (
        <MUHTextInput
          key={idx}
          height={42}
          sx={inputStyle}
          fontSize={16}
          fontWeight={400}
          fontFamily="Roboto Slab"
          borderRadius={2}
          borderColor="#2D2D2D"
          value={val}
          inputRef={(el) => {
            if (el) inputsRef.current[idx] = el;
          }}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center' },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
