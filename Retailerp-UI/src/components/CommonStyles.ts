import { CSSProperties } from 'react';
import * as theme from '../theme/schemes/PurelightTheme';

export const getTextInputStyle = (
  height?: never,
  borderColor?: never,
  borderRadius?: never,
  marginBottom?: number
): CSSProperties => {
  return {
    width: '100%',
    marginTop: 3,
    marginBottom: marginBottom || 10,
    '& .MuiOutlinedInput-multiline': {
      height: height || 54,
      alignItems: 'initial',
    },
    '& .MuiOutlinedInput-input': {
      height: height || 54,
      fontSize: 18,
      fontWeight: 500,
      color: theme.Colors.black,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: borderColor || '#A0A2A4',
      borderWidth: '1px',
      borderRadius: borderRadius || 2,
    },
  } as never;
};

export const helperRootStyle: CSSProperties = {
  textTransform: 'none',
  fontSize: 12,
};

export const buttonStyle = (
  btnWidth?: never,
  bgColor?: string,
  btnTextColor?: string,
  buttonFontSize?: never,
  height?: number,
  buttonFontWeight?: never,
  btnBorderRadius?: number
) => ({
  display: 'flex',
  width: btnWidth || '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage:
    'linear-gradient(105.42deg, #F39E0B 61.04%, rgba(243, 158, 11, 0) 178.14%)',
  backgroundColor: bgColor || '#F39E0B',
  color: btnTextColor || '#FFF',
  fontSize: buttonFontSize || 20,
  fontWeight: buttonFontWeight || 600,
  height: height || 54,
  borderRadius: btnBorderRadius || 10,
  textTransform: 'none',
  boxShadow: 'none',
  padding: '0px 4px',
});

export const helperTextStyle: CSSProperties = {
  textTransform: 'none',
  color: 'red',
  paddingLeft: 2,
};

export const labelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
  color: theme.Colors.black,
  paddingTop: 3,
  textWrap: 'nowrap',
};
export const labelAutoInputStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
  color: theme.Colors.black,
  textWrap: 'nowrap',
};
export const required: CSSProperties = {
  color: '#EC3900',
  fontWeight: 'bold',
};

export const titleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const dialogTitleStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 500,
  color: '#111827',
};

export const alignmentLeft: CSSProperties = {
  paddingLeft: 10,
};

export const formPadding: CSSProperties = {
  padding: 20,
  backgroundColor: theme.Colors.whitePrimary,
};
export const formBorder: CSSProperties = {
  padding: 5,
  backgroundColor: theme.Colors.whitePrimary,
};
export const leftItem: CSSProperties = {
  paddingBottom: 2.6,
  paddingRight: '5%',
};
export const rightItem: CSSProperties = {
  paddingBottom: 2.6,
  paddingLeft: ' 5%',
};
export const topItem: CSSProperties = {
  paddingTop: '6%',
};
export const selectBoxPadding: CSSProperties = {
  padding: '0.625rem',
};
export const inputBoxPadding: CSSProperties = {
  padding: '0.4rem 0.5rem',
};
export const labelDetails: CSSProperties = {
  border: '1px solid #D1D2D3',
  borderBottomRightRadius: '5px',
  borderTopRightRadius: ' 5px',
  paddingTop: '10px',
  paddingLeft: '12px',
  width: '401px',
  fontSize: '1rem',
  color: '#333843',
  fontWeight: 700,
};
export const labelHeading: CSSProperties = {
  backgroundColor: '#F9FAFB',
  color: theme.Colors.dustyGray,
  border: '1px solid #D1D2D3',
  borderBottomLeftRadius: '5px',
  borderTopLeftRadius: '5px',
  width: '252px',
  paddingTop: ' 10px',
  paddingLeft: '12px',
  fontSize: '1rem',
};

export const containerPadding: CSSProperties = {
  backgroundColor: theme.Colors.whitePrimary,
  padding: 4,
};

export const createEmployeeStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  color: '#495057',
};

export const totalCountTextStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: theme.Colors.black,
};

export const popover: any = {
  padding: 5,
  width: '100%',
  height: '100%',
};
export const notifyTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#333333',
  marginLeft: 5,
};
export const contentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 5,
};
export const notificationHeader: CSSProperties = {
  paddingTop: 5,
  display: 'flex',
  position: 'sticky',
  top: 0,
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  background: '#FFF',
};

export const commonLayout: CSSProperties = {
  borderRadius: '8px',
  padding: '10px',
  backgroundColor: theme.Colors.whitePrimary,
};

export const contentLayout: CSSProperties = {
  background: theme.Colors.whitePrimary,
  flexDirection: 'column',
  marginTop: 1.2,
  flexGrow: 1,
  border: `1px solid ${theme.Colors.grayLight}`,
  borderRadius: '4px',
};

export const filterSelectBoxStyle: CSSProperties = {
  borderRadius: '6px',
  height: '28px',
};

export const tableFilterContainerStyle: CSSProperties = {
  borderBottom: `1px solid ${theme.Colors.blueLightLow}`,
  padding: 2.2,
  gap: '8px',
  alignItems: 'center',
  width: '100%',
};

export const filterSelectBoxTextStyle: CSSProperties = {
  fontSize: '12.5px',
  fontWeight: 400,
  fontFamily: 'Roboto-Regular',
  color: theme.Colors.black,
};

export const formLayoutStyle: CSSProperties = {
  paddingTop: '20px',
  paddingInline: '22px',
  borderRadius: '8px',
  background: theme.Colors.whitePrimary,
  border: `1px solid ${theme.Colors.grayLight}`,
};

export const formLayoutWithHeaderStyle: CSSProperties = {
  paddingTop: '20px',
  paddingInline: '22px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  background: theme.Colors.whitePrimary,
  border: `1px solid ${theme.Colors.grayLight}`,
  borderTop: 'none',
};

export const sectionContainerStyle = {
  ...formLayoutWithHeaderStyle,
  padding: '10px 15px',
};

export const formInputTextStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: theme.fontFamily.roboto,
};

export const formInputLableStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 400,
  fontFamily: theme.fontFamily.roboto,
};

export const commonTextInputProps = {
  required: true,
  inputBoxTextStyle: formInputTextStyle,
  inputLabelStyle: formInputLableStyle,
};

export const commonSelectBoxProps = {
  required: true,
  isCheckbox: false,
  menuItemTextColor: theme.Colors.black,
  menuItemTextSize: 14,
  selectBoxStyle: { borderRadius: '8px', height: '40px' },
  iconStyle: { fontSize: '20px', color: theme.Colors.dustyGray },
  textStyle: formInputTextStyle,
  labelStyle: formInputLableStyle,
  menuStyle: { borderRadius: '8px' },
  borderColor: theme.Colors.silverFoilWhite,
};

export const CommonFilterSelectBoxProps = {
  isCheckbox: false,
  menuItemTextColor: theme.Colors.black,
  menuItemTextSize: 12.5,
  placeholderColor: theme.Colors.blackLightLow,
  iconColor: theme.Colors.blackLightLow,
  selectBoxStyle: filterSelectBoxStyle,
  textStyle: filterSelectBoxTextStyle,
  borderColor: theme.Colors.grayBorderLight,
};

export const CommonFilterAutoSearchProps = {
  height: 28,
  searchBoxStyle: {
    borderRadius: '6px',
    borderColor: theme.Colors.grayBorderLight,
  },
  textStyle: filterSelectBoxTextStyle,
  placeholdrStyle: { color: theme.Colors.blackLightLow },
};
export const tableColumnStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: theme.fontFamily.roboto,
  color: theme.Colors.black,
  minHeight: '45px',
  border: `1px solid ${theme.Colors.grayWhiteDim}`,
  width: '100%',

  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const columnCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 2,
  borderRight: '1px solid #E5E5E5',
  whiteSpace: 'wrap'
};

export const tableSelectBoxProps = {
  selectBoxStyle: { height: '60px', borderRadius: '4px' },
  textStyle: formInputTextStyle,
  menuItemTextColor: theme.Colors.black,
  menuItemTextSize: 14,
  iconStyle: { fontSize: '20px', color: theme.Colors.dustyGray },
  placeholderColor: theme.Colors.grayDim,
  placeholderSize: 14,
  borderColor: theme.Colors.whitePrimary,
  menuStyle: { borderRadius: '8px' },
  ishover: false,
};

export const tableRowStyle = {
  minHeight: '60px',
  border: `1px solid ${theme.Colors.grayWhiteDim}`,
  borderTop: 'none',
  width: '100%',
};

export const tableTextInputProps = {
  placeholderColor: theme.Colors.grayDim,
  placeholderFontSize: 14,
  height: 60,
  borderWidth: 0,
  inputBoxTextStyle: formInputTextStyle,
  borderRadius: '4px',
};
