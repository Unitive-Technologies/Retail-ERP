import { createTheme, ThemeOptions } from '@mui/material';

export const Colors = {
  // Primary set
  primary: '#6D2E3D',
  primaryDarkStart: '#471923',
  primaryDarkEnd: '#7F3242',
  primaryLight: '#F3D8D9',
  primaryLightDark: '#F8EBF0',
  secondaryLight: '#F9EAEA',
  secondaryDimDark: '#F0D0D2',
  secondaryDim: '#FBF3F4',

  // Black set
  black: '#000000',
  blackPrimary: '#0D0D0D',
  blackSecondary: '#313131',
  blackLight: '#555B6D',
  blackLightLow: '#494949',

  // Gray set
  grayPrimary: '#AEAFB0',
  graySecondary: '#505355',
  grayLight: '#E4E4E4',
  grayLightLow: '#EFEFEF',
  grayLightSecondary: '#E2E2E2',
  grayBorderLight: '#CBCBCB',
  grayDim: '#BCB4B4',
  grayBorderFrame: '#AFAFAF',
  dustyGray: '#968C8C',
  grayBlue: '#3C4456',
  stormGray: '#848587',
  grayDarkDim: '#D8D8D8',
  grayBorder: '#D1D2D3',
  grayWhite:'#E6E6E6',
  grayWhiteDim: '#E5E5E5',
  graniteGray:'#676767',
  grayBorderDim: '#CED4DA',
  grayLightDark: '#E8E8E8',
  grayStormDark: '#A6A6A6',
  grayWhiteDark: '#9B9A9A',
  
  // Blue set
  blueDark: '#3400FF',
  blueLight: '#6A7187',
  blueLightSecondary: '#74788D',
  blueLightLow: '#EFF2F7',
  blueGray: '#667085',
  lightGrayishCyan: '#E0EAEA',
  blueDarkPrimary: '#152257',

  // White set
  whitePrimary: '#FFFFFF',
  whiteSecondary: '#F8F8FB',
  whitePrimaryDark: '#F9F9F9',
  whiteLight: '#F8F9FA',
  whitePure: '#F5F5F5',
  halfWhite: '#FFF4DE',
  snowWhite: '#FCFCFC',
  silverFoilWhite: '#AEAFB0',

  // Green set
  greenPrimary: '#6CB044',
  greenLight: '#DAFFD7',

  // Red set
  redPrimary: '#F63614',
  redPrimarySecondary: '#FF0000',
  redRequiredPrimary:'#EC3900',

  platinum: '#E0E2E7',
  silver: '#B9B9B9',

  //Orange set
  orangePrimary:'#FF742F',
  orangeDark:'#FF0000',
  orangeSecondary:'#FF6200'
};

const fontWeight = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  mediumBold: 600,
  bold: 700,
  dark: 800,
  black: 900,
};

export const MetricsSizes = {
  tiny: 4,
  tiny_x: 6,
  tiny_xx: 8,
  tiny_xxx: 10,

  small: 12,
  small_x: 13,
  small_xx: 14,
  small_x3: 15,
  small_xxx: 16,

  regular: 18,
  regular_x: 20,
  regular_xx: 22,
  regular_xxx: 24,

  medium: 26,
  medium_x: 28,
  medium_xx: 30,
  medium_xxx: 32,

  large: 34,
  large_x: 36,
  large_xx: 40,
  large_xxx: 48,

  x_large: 52,
  xx_large: 56,
  xxx_large: 60,
  x_large_3: 64,
};

const SpacingValue = Object.fromEntries(
  Object.entries(MetricsSizes).map(([key, value]) => [key, value / 8])
);

export const Breakpoints = {
  values: {
    xs: 400,
    sm: 680,
    md: 1024,
    lg: 1280,
    xl: 1920,
  },
};

export const fontFamily = {
  inter: 'Inter-Medium',
  interRegular: 'Inter-Regular',
  interLight: 'Inter-Light',
  roboto: 'Roboto-Regular',
  poppins: 'Poppins-Medium',
  poppinsRegular: 'Poppins-Regular',
};

export const PureLightTheme = (options?: ThemeOptions) =>
  createTheme(
    { ...options },
    {
      MetricsSizes: { ...MetricsSizes },
      Colors: {
        ...Colors,
      },
      fontWeight: { ...fontWeight },
      fontFamily: { ...fontFamily },
      Spacing: { ...SpacingValue },
      general: {
        borderRadiusSm: MetricsSizes.tiny_x,
        borderRadius: MetricsSizes.tiny_xx,
        borderRadiusLg: MetricsSizes.small,
        borderRadiusXl: MetricsSizes.small_xx,
      },
      sidebar: {
        width: ' 304px',
      },
      header: {
        appBarHeight: '120px',
      },
      palette: {
        primary: {
          //   light: Colors.blueLight,
          main: Colors.primary,
          //   dark: Colors.blueDark,
        },
        // secondary: {
        //   light: Colors.darkGreen,
        //   main: Colors.secondary,
        //   dark: Colors.blueGreen,
        // },
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1840,
        },
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              fontFamily: fontFamily.interRegular,
            },
          },
        },
      },
      typography: {
        fontFamily: 'Inter-Medium',
        h1: {
          fontSize: 32,
          fontFamily: 'Poppins-Medium',
          color: Colors.blackPrimary,
          fontWeight: fontWeight.mediumBold,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.medium_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.medium_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
        },
        h2: {
          fontSize: MetricsSizes.regular_xxx,
          fontWeight: 500,
          color: Colors.black,
          fontFamily: 'Poppins-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
        },
        h3: {
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'Inter-Medium',
        },
        h4: {
          fontSize: MetricsSizes.regular_xxx,
          fontWeight: fontWeight.mediumBold,
          fontFamily: 'Inter-Medium',
          color: Colors.black,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
        },
        h5: {
          fontSize: MetricsSizes.regular,
          fontWeight: fontWeight.regular,
          fontFamily: 'Poppins-Regular',
          color: Colors.graySecondary,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small,
          },
        },
        h6: {
          fontSize: MetricsSizes.small_xxx,
          fontWeight: 500,
          fontFamily: 'Inter-Medium',
          color: Colors.black,
        },
        body1: {
          fontSize: MetricsSizes.small_xx,
          fontWeight: fontWeight.medium,
          fontFamily: 'Roboto-Regular',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.tiny_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.tiny_xxx,
          },
        },
        body2: {
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Poppins-Medium',
        },
        button: {
          fontWeight: 600,
          fontSize: MetricsSizes.regular_xx,
          fontFamily: 'Inter-Medium',
        },
        caption: {
          fontSize: 15,
          fontWeight: 400,
          fontFamily: 'Inter-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.small_x3,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small,
          },
        },
        subtitle1: {
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Poppins-Regular',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        subtitle2: {
          fontWeight: 400,
          fontSize: 11,
          fontFamily: 'Poppins-Regular',
        },
        overline: {
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Poppins-Regular',
        },
        headingLabel: {
          fontSize: 32,
          fontFamily: 'Poppins-Regular',
          color: Colors.whitePrimary,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.medium_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
        },
        descriptionLabel: {
          fontSize: 15,
          fontWeight: 500,
          fontFamily: 'Poppins-Regular',
          color: Colors.whitePrimary,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.small_x3,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.tiny_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.tiny_xxx,
          },
        },
        // powerfulLabel: {
        //   fontSize: MetricsSizes.regular,
        //   fontWeight: fontWeight.mediumBold,
        //   color: Colors.grayPrimary,
        //   fontFamily: 'Poppins-Medium',
        //   [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
        //     fontSize: MetricsSizes.regular,
        //   },
        //   [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
        //     fontSize: MetricsSizes.regular,
        //   },
        //   [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
        //     fontSize: MetricsSizes.small_xxx,
        //   },
        //   [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
        //     fontSize: MetricsSizes.small_xxx,
        //   },
        //   [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
        //     fontSize: MetricsSizes.small_xxx,
        //   },
        // },
        switchLabel: {
          fontSize: MetricsSizes.regular_xxx,
          fontWeight: 500,
          color: Colors.black,
          fontFamily: 'Poppins-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
        },
        planBoxHeading: {
          fontSize: MetricsSizes.medium_x,
          fontWeight: fontWeight.medium,
          color: Colors.primary,
          fontFamily: 'Poppins-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.medium_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
        },
        amountLabel: {
          fontSize: MetricsSizes.regular_xxx,
          fontWeight: fontWeight.bold,
          color: Colors.black,
          fontFamily: 'Poppins-Regular',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
        },
        spanLabel: {
          fontSize: MetricsSizes.regular_x,
          fontWeight: fontWeight.medium,
          color: Colors.black,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
        },
        planLabel: {
          fontSize: MetricsSizes.regular_x,
          fontWeight: fontWeight.regular,
          color: Colors.black,
          fontFamily: 'Poppins-Regular',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small_x,
          },
        },
        tabLabel: {
          fontSize: MetricsSizes.regular,
          fontWeight: fontWeight.mediumBold,
          // color: Colors.grayPrimary,
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.small_xx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.small,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.small,
          },
        },
        contactLabel: {
          fontSize: MetricsSizes.regular_x,
          fontWeight: fontWeight.medium,
          color: Colors.graySecondary,
          fontFamily: 'Poppins-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.regular,
          },
        },
        contactImageLabel: {
          fontSize: MetricsSizes.x_large_3,
          fontWeight: fontWeight.mediumBold,
          color: Colors.whitePrimary,
          fontFamily: 'Inter-Medium',
          [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
            fontSize: MetricsSizes.x_large_3,
          },
          [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
            fontSize: MetricsSizes.x_large,
          },
          [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
            fontSize: MetricsSizes.regular_xxx,
          },
          [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
          [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
            fontSize: MetricsSizes.regular_x,
          },
        },
      },
    }
  );
