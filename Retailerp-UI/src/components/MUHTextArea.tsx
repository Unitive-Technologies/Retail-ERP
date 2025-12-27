import React, { useState } from 'react';
import { TextareaAutosize, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  width?: string | number;
  labelWidth?: string | number;
  placeholder?: string;
  readOnly?: boolean;
  borderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  borderRadius?: number | string;
  padding?: string;
  isError?: boolean;
  helperText?: string;
  labelStyle?: any;
  resize?: React.CSSProperties['resize'];
  labelFlexSize?: number;
};

const MUHTextArea: React.FC<Props> = ({
  label,
  required = false,
  value,
  onChange,
  minRows = 3,
  maxRows = 6,
  width = '100%',
  placeholder,
  readOnly = false,
  borderColor,
  focusBorderColor,
  errorBorderColor,
  borderRadius = 8,
  padding = '10px',
  isError = false,
  helperText,
  labelStyle,
  resize = 'none',
  labelFlexSize = 5,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const defaultBorderColor = isError
    ? theme.Colors.redPrimary
    : borderColor
      ? borderColor
      : theme.Colors.grayPrimary;

  const focusColor = isError
    ? errorBorderColor || theme.Colors.redPrimary
    : focusBorderColor || theme.Colors.primary;

  return (
    <Grid
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      {label && (
        <Grid size={labelFlexSize}>
          <Typography
            sx={{
              color: isError ? theme.Colors.redPrimary : theme.Colors.black,
              fontWeight: 400,
              fontFamily: theme.fontFamily.roboto,
              fontSize: '14px',
              ...labelStyle,
            }}
          >
            {label}
            {required && (
              <span
                style={{
                  color: theme.Colors.redPrimary,
                  marginLeft: 2,
                }}
              >
                *
              </span>
            )}
          </Typography>
        </Grid>
      )}

      <Grid size={'grow'}>
        <TextareaAutosize
          minRows={minRows}
          maxRows={maxRows}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          style={{
            width: width as string,
            borderRadius: borderRadius as number,
            border: `1px solid ${defaultBorderColor}`,
            resize: resize,
            overflow: 'auto',
            outline: 'none',
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
            padding,
            color: theme.Colors.black,
          }}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.style.border = `1px solid ${focusColor}`;
          }}
          onBlur={(e) => {
            setIsFocused(false);
            e.target.style.border = `1px solid ${defaultBorderColor}`;
          }}
          onMouseEnter={(e: any) => {
            if (!readOnly && !isFocused)
              e.target.style.border = `1px solid ${focusBorderColor}`;
          }}
          onMouseLeave={(e: any) => {
            if (!readOnly && !isFocused)
              e.target.style.border = `1px solid ${defaultBorderColor}`;
          }}
        />
        {isError && helperText && (
          <Typography
            sx={{
              color: theme.Colors.redPrimary,
              fontSize: '12px',
              marginTop: '4px',
            }}
          >
            {helperText}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default MUHTextArea;
