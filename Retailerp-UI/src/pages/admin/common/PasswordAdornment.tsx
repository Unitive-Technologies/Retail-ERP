import React from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { PasswordIcon, PasswordOffIcon } from '@assets/Images/AdminImages';

interface PasswordAdornmentProps {
  showPassword: boolean;
  onToggle: () => void;
  iconSize?: number;
}

const PasswordAdornment: React.FC<PasswordAdornmentProps> = ({
  showPassword,
  onToggle,
  iconSize = 20,
}) => {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="start">
        {showPassword ? (
          <PasswordIcon width={iconSize} height={iconSize} />
        ) : (
          <PasswordOffIcon width={iconSize} height={iconSize} />
        )}
      </IconButton>
    </InputAdornment>
  );
};

export default PasswordAdornment;
