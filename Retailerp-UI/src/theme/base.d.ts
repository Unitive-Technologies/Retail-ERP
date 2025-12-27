import { Theme } from '@mui/material/styles';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography';

// This is custom variant for Typography
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headingLabel: true;
    descriptionLabel: true;
    // powerfulLabel: true;
    switchLabel: true;
    planBoxHeading: true;
    amountLabel: true;
    spanLabel: true;
    planLabel: true;
    tabLabel: true;
    contactLabel: true;
    contactImageLabel: true;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    MetricsSizes: {
      tiny: number;
      tiny_x: number;
      tiny_xx: number;
      tiny_xxx: number;
      small: number;
      small_x: number;
      small_xx: number;
      small_x3: number;
      small_xxx: number;
      regular: number;
      regular_x: number;
      regular_xx: number;
      regular_xxx: number;
      medium: number;
      medium_x: number;
      medium_xx: number;
      medium_xxx: number;
      large: number;
      large_x: number;
      large_xx: number;
      large_xxx: number;
      x_large: number;
      xx_large: number;
      xxx_large: number;
      x_large_3: number;
    };
    Spacing: {
      tiny: number;
      tiny_x: number;
      tiny_xx: number;
      tiny_xxx: number;
      small: number;
      small_x: number;
      small_xx: number;
      small_x3: number;
      small_xxx: number;
      regular: number;
      regular_x: number;
      regular_xx: number;
      regular_xxx: number;
      medium: number;
      medium_x: number;
      medium_xx: number;
      medium_xxx: number;
      large: number;
      large_x: number;
      large_xx: number;
      large_xxx: number;
      x_large: number;
      xx_large: number;
      xxx_large: number;
      x_large_x: number;
    };
    Colors: {
      // Primary set
      primary: string;
      primaryDarkStart: string;
      primaryDarkEnd: string;
      primaryLight: string;
      primaryLightDark: string;
      secondaryLight: string;
      secondaryDimDark: string;
      secondaryDim: string;

      // Black set
      black: string;
      blackPrimary: string;
      blackSecondary: string;
      blackLight: string;
      blackLightLow: string;

      // Gray set
      grayPrimary: string;
      graySecondary: string;
      grayLight: string;
      grayLightLow: string;
      grayLightSecondary: string;
      grayBorderLight: string;
      grayDim: string;
      grayBorderFrame: string;
      dustyGray: string;
      grayBlue: string;
      stormGray: string;
      grayDarkDim: string;
      grayBorder: string;
      grayWhite: string;
      grayWhiteDim: string;
      graniteGray: string;
      grayBorderDim: string;
      grayLightDark: string;
      grayStormDark: string;
      grayWhiteDark: string;
      
      // Blue set
      blueDark: string;
      blueLight: string;
      blueLightSecondary: string;
      blueLightLow: string;
      blueGray: string;
      lightGrayishCyan: string;
      blueDarkPrimary: string;

      // White set
      whitePrimary: string;
      whiteSecondary: string;
      whitePrimaryDark: string;
      whiteLight: string;
      whitePure: string;
      halfWhite: string;
      snowWhite: string;
      silverFoilWhite: string;

      // Green set
      greenPrimary: string;
      greenLight: string;

      // Red set
      redPrimary: string;
      redPrimarySecondary: string;
      redRequiredPrimary: string;

      platinum: string;
      silver: string;

      //Orange set
      orangePrimary:string;
      orangeDark:string;
      orangeSecondary:string;
    };
    fontWeight: {
      thin: number;
      light: number;
      regular: number;
      medium: number;
      mediumBold: number;
      bold: number;
      black: number;
      dark: number;
    };
    fontFamily: {
      inter: string;
      interRegular: string;
      interLight: string;
      roboto: string;
      poppins: string;
      poppinsRegular: string;
    };
    general: {
      borderRadiusSm: number;
      borderRadius: number;
      borderRadiusLg: number;
      borderRadiusXl: number;
    };
    sidebar: {
      width: string;
    };
    header: {
      appBarHeight: string;
    };
    typography: {
      headingLabel: React.CSSProperties;
      descriptionLabel: React.CSSProperties;
      // powerfulLabel: React.CSSProperties;
      switchLabel: React.CSSProperties;
      planBoxHeading: React.CSSProperties;
      amountLabel: React.CSSProperties;
      spanLabel: React.CSSProperties;
      planLabel: React.CSSProperties;
      tabLabel: React.CSSProperties;
      contactLabel: React.CSSProperties;
      contactImageLabel: React.CSSProperties;
    };
  }
  interface ThemeOptions {
    MetricsSizes?: Theme['MetricsSizes'];
    Colors?: Theme['Colors'];
    fontWeight?: Theme['fontWeight'];
    fontFamily?: Theme['fontFamily'];
    general?: Theme['general'];
    sidebar?: Theme['sidebar'];
    header?: Theme['header'];
    typography?: {
      headingLabel?: Theme['headingLabel'];
      descriptionLabel?: Theme['descriptionLabel'];
      // powerfulLabel?: Theme['powerfulLabel'];
      switchLabel?: Theme['switchLabel'];
      planBoxHeading?: Theme['planBoxHeading'];
      amountLabel?: Theme['amountLabel'];
      spanLabel?: Theme['spanLabel'];
      planLabel?: Theme['planLabel'];
      tabLabel?: Theme['tabLabel'];
      contactLabel?: Theme['contactLabel'];
      contactImageLabel?: Theme['contactImageLabel'];
    };
    Spacing?: Theme['Spacing'];
  }
}
