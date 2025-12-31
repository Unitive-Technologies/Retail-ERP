import React from 'react';
import { TextField, TextFieldProps, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Breakpoints } from '../theme/schemes/PurelightTheme';

type Props = TextFieldProps & {
  variant?: string;
  borderColor?: string;
  isError?: boolean;
  required?: boolean;
  placeholderText?: string;
  borderRadius?: number | string;
  marginBottom?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: number;
  type?: React.HTMLInputTypeAttribute;
  marginTop?: number;
  padding?: any;
  helperText?: string;
  width?: string;
  inputLabel?: string;
  labelColor?: string;
  inputColor?: string;
  placeholderColor?: string;
  placeholderFontWeight?: number;
  placeholderFontSize?: number;
  isLogin?: boolean;
  inputLabelStyle?: React.CSSProperties;
  fontFamily?: string;
  borderWidth?: string | number;
  focusBorderColor?: string;
  inputBoxTextStyle?: React.CSSProperties;
  isReadOnly?: boolean;
  labelFlexSize?: number;
  backgroundColor?: string;
  fieldSetStyle?: any;
};

const MUHTextInput = (props: Props) => {
  const theme = useTheme();

  const {
    variant = 'outlined',
    borderColor,
    isError = false,
    isReadOnly = false,
    borderRadius = '8px',
    padding,
    fontSize,
    fontWeight,
    type = 'text',
    marginTop,
    helperText,
    height,
    width,
    placeholderText,
    labelColor,
    inputLabel,
    required = false,
    marginBottom,
    inputColor,
    placeholderColor,
    placeholderFontWeight,
    placeholderFontSize,
    isLogin = false,
    inputLabelStyle,
    fontFamily,
    borderWidth = theme.Spacing.tiny_x,
    focusBorderColor = isReadOnly
      ? theme.Colors.silverFoilWhite
      : theme.Colors.primary,
    inputBoxTextStyle,
    labelFlexSize = 5,
    backgroundColor,
    fieldSetStyle,
    ...rest
  } = props;

  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ width: '100%' }}
    >
      {isLogin
        ? null
        : inputLabel && (
            <Grid size={labelFlexSize}>
              <Typography
                variant="h6"
                sx={{
                  color: isError ? theme.Colors.redPrimary : labelColor,
                  marginTop: marginTop ? marginTop : 0,
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.small_xx,
                  ...inputLabelStyle,
                }}
              >
                {inputLabel}
                {required && (
                  <span
                    style={{
                      color: theme.Colors.redPrimary,
                      fontWeight: theme.fontWeight.medium,
                      fontSize: theme.MetricsSizes.small_xx,
                    }}
                  >
                    &nbsp;*
                  </span>
                )}
              </Typography>
            </Grid>
          )}
      <Grid size={'grow'}>
        {isLogin
          ? inputLabel && (
              <Typography
                variant="h6"
                sx={{
                  color: isError ? theme.Colors.redPrimary : labelColor,
                  marginTop: marginTop ? marginTop : 0,
                  [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]:
                    {
                      fontSize: theme.MetricsSizes.small_x3,
                    },
                  [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]:
                    {
                      fontSize: theme.MetricsSizes.small_x3,
                    },
                  [`@media screen and (max-width: ${Breakpoints.values.md}px)`]:
                    {
                      fontSize: theme.MetricsSizes.small_x3,
                    },
                  [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]:
                    {
                      fontSize: theme.MetricsSizes.small,
                    },
                  [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]:
                    {
                      fontSize: theme.MetricsSizes.small,
                    },
                  ...inputLabelStyle,
                }}
              >
                {inputLabel}
                {required && (
                  <span
                    style={{
                      color: theme.Colors.redPrimary,
                      fontWeight: theme.fontWeight.medium,
                      fontSize: theme.MetricsSizes.small_xx,
                    }}
                  >
                    &nbsp;*
                  </span>
                )}
              </Typography>
            )
          : null}
        <TextField
          size="medium"
          sx={{
            width: width || '100%',
            marginTop: inputLabel ? theme.Spacing.tiny_xx : 0,
            marginBottom: marginBottom ? marginBottom : 0,
            fontFamily: theme.fontFamily.interRegular,
            '& .MuiInputBase-input::placeholder': {
              fontFamily: theme.fontFamily.interRegular,
              color: placeholderColor || theme.Colors.stormGray,
              fontWeight: placeholderFontWeight || theme.fontWeight.regular,
              opacity: 1,
              fontSize: placeholderFontSize || theme.MetricsSizes.small_x3,
            },
            '& .MuiOutlinedInput-multiline': {
              padding: padding || '0.75rem 1rem',
              alignItems: 'initial',
            },
            '& .MuiOutlinedInput-input': {
              fontSize: fontSize || theme.MetricsSizes.small_xx,
              fontFamily: fontFamily || theme.fontFamily.inter,
              fontWeight: fontWeight || theme.fontWeight.medium,
              color: inputColor || theme.Colors.black,
              padding: padding || '0.75rem 1rem',
              ...inputBoxTextStyle,
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor:
                borderColor ||
                (isError
                  ? theme.Colors.redPrimary
                  : theme.Colors.silverFoilWhite),
              borderWidth: borderWidth,
              borderRadius: borderRadius || theme.Spacing.small_xx,
            },
            '& .MuiOutlinedInput-root': {
              height: height ? `${height}px` : '40px',
              backgroundColor: backgroundColor || 'transparent',
              '&.Mui-focused fieldset': {
                borderColor:
                  // borderColor ||
                  isError ? theme.Colors.redPrimary : focusBorderColor,
                borderWidth: theme.Spacing.tiny_x,
              },
              paddingRight: 0,
              // paddingLeft: '0px',
              ...fieldSetStyle,
            },
            '&:hover:not(.Mui-focused)': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor:
                  // borderColor ||
                  isError ? theme.Colors.redPrimary : focusBorderColor,
              },
            },
          }}
          variant={variant}
          error={isError}
          helperText={isError && helperText}
          {...rest}
          type={type}
          placeholder={placeholderText}
          inputProps={{ ...(rest.inputProps || {}), readOnly: isReadOnly }}
          onChange={(e) => {
            const value = e.target.value;
            if (value.startsWith(' ')) return;

            // Call parent onChange if exists
            if (rest.onChange) rest.onChange(e);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default MUHTextInput;
