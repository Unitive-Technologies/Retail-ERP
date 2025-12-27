import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useTheme } from '@mui/material';

interface MUHTypographyProps extends TypographyProps {
  text?: string;
  size?: number | string;
  weight?: number;
  color?: string;
  family?: string;
}

const MUHTypography: React.FC<MUHTypographyProps> = ({
  text,
  size = '14px',
  weight = 400,
  color,
  family = 'Roboto Slab',
  sx,
  children,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Typography
      variant="inherit"
      sx={{
        fontFamily: family,
        fontSize: size,
        fontWeight: weight,
        color: color || theme.Colors.black,
        ...sx,
      }}
      {...props}
    >
      {text || children}
    </Typography>
  );
};

export default MUHTypography;
