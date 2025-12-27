import React from 'react';
import { InputAdornment, useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';

interface MUHInputAdornmentProps {
  text: string;
  position?: 'start' | 'end';
  width?: string | number;
  textStyle?: any;
}

const TextInputAdornment: React.FC<MUHInputAdornmentProps> = ({
  text,
  position = 'end',
  width = '45px',
  textStyle,
}) => {
  const theme = useTheme();

  return (
    <InputAdornment
      position={position}
      sx={{
        borderRadius:
          position === 'end' ? '0px 8px 8px 0px' : '8px 0px 0px 8px',
        borderLeft:
          position === 'end'
            ? `1px solid ${theme.Colors.grayPrimary}`
            : 'none',
        borderRight:
          position === 'start'
            ? `1px solid ${theme.Colors.grayPrimary}`
            : 'none',
        maxHeight: 'none',
        height: '100%',
        width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MUHTypography
        text={text}
        size={13}
        weight={600}
        family={theme.fontFamily.roboto}
        sx={{ ...textStyle }}
      />
    </InputAdornment>
  );
};

export default TextInputAdornment;
