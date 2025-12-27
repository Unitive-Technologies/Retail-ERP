import React from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';
import MUHTypography from '@components/MUHTypography';

interface Option {
  label: string;
  value: number | string;
}

interface MUHRadioGroupProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  row?: boolean;
  gap?: number;
}

const MUHRadioGroupComponent: React.FC<MUHRadioGroupProps> = ({
  value,
  options,
  onChange,
  row = true,
  gap = 5,
}) => {
  const theme = useTheme();

  return (
    <RadioGroup
      row={row}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        display: 'flex',
        gap: gap,
      }}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              sx={{
                color: theme.Colors.black,
                '&.Mui-checked': {
                  color: theme.Colors.primary,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 22,
                },
                zIndex: 0
              }}
            />
          }
          label={
            <MUHTypography
              text={option.label}
              family={theme.fontFamily.roboto}
              weight={500}
            />
          }
        />
      ))}
    </RadioGroup>
  );
};

export default MUHRadioGroupComponent;
