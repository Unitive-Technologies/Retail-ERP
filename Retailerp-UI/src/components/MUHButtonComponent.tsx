import React, { useRef } from 'react';
import { Button, ButtonProps, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = ButtonProps & {
  bgColor?: string;
  padding?: string | number;
  buttonText?: string;
  buttonFontSize?: number;
  variant?: 'text' | 'outlined' | 'contained';
  buttonTextColor?: string;
  buttonFontWeight?: number;
  btnWidth?: string | number;
  btnBorderRadius?: number;
  iconImage?: React.ReactNode;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  backgroundImage?: string;
  border?: string;
  isBrowseButton?: boolean;
  onBrowseButtonClick?: (event: any) => void;
  acceptType?: string;
  btnHeight?: number;
  buttonStyle?: React.CSSProperties;
  sideLabel?: string;
  required?: boolean;
  isError?: boolean;
  labelColor?: string
};

const MUHButtonComponent = (props: Props) => {
  const {
    bgColor,
    padding,
    buttonText,
    buttonFontSize,
    variant = 'contained',
    buttonTextColor,
    buttonFontWeight,
    btnWidth,
    btnBorderRadius,
    onClick,
    iconImage,
    startIcon,
    backgroundImage,
    border,
    isBrowseButton = false,
    disabled,
    acceptType,
    onBrowseButtonClick,
    btnHeight,
    buttonStyle,
    sideLabel,
    required = false,
    isError = false,
    labelColor,
    ...rest
  } = props;
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseButtonClick = (event: any) => {
    if (isBrowseButton) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick(event);
    }
  };

  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
    >
      {sideLabel ? (
        <Grid size={4}>
          <Typography
            variant="h6"
            sx={
              {
                fontSize: theme.MetricsSizes.small_xx,
                color: isError ? theme.Colors.redPrimary : labelColor
                // marginTop: marginTop ? marginTop : 0,
                // ...inputLabelStyle,
              }
            }
          >
            {sideLabel}
            {required && (
              <span
                style={{
                  color: theme.Colors.redPrimary,
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.small_xxx,
                }}
              >
                &nbsp;*
              </span>
            )}
          </Typography>
        </Grid>
      ) : null}
      <Grid size={'grow'}>
        <Button
          sx={{
            display: 'flex',
            width: btnWidth || '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: bgColor || theme.Colors.primary,
            color: buttonTextColor || theme.Colors.whitePrimary,
            fontSize: buttonFontSize || theme.MetricsSizes.small_xxx,
            fontWeight: buttonFontWeight || theme.fontWeight.medium,
            borderRadius: btnBorderRadius || theme.Spacing.tiny_xx,
            textTransform: 'none',
            boxShadow: 'none',
            padding: padding || '8px 22px',
            border: border,
            backgroundImage: backgroundImage || '',
            height: btnHeight || 'auto',
            '&:hover': {
              backgroundColor: bgColor || theme.Colors.primary,
              backgroundImage: backgroundImage || '',
              boxShadow: 'none',
            },
            '& .MuiButton-contained': {
              boxShadow: 'none',
            },
            ...buttonStyle,
          }}
          disableElevation
          variant={variant}
          onClick={handleBrowseButtonClick}
          endIcon={iconImage}
          startIcon={startIcon}
          disabled={disabled}
          {...rest}
        >
          {buttonText}
          {isBrowseButton && (
            <input
              type="file"
              accept={acceptType}
              hidden
              ref={fileInputRef}
              onChange={onBrowseButtonClick}
            />
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export default MUHButtonComponent;
