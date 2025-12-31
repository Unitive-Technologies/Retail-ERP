import React, { useState } from 'react';
import {
  Checkbox,
  FormHelperText,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
  Typography,
  useTheme,
  TextField,
  Box,
  SxProps,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Variant } from '@mui/material/styles/createTypography';
import { ExpandMore } from '@mui/icons-material';
import MUHTypography from './MUHTypography';

const textTypoStyle = {
  whiteSpace: 'nowrap',
  overflow: 'scroll',
  scrollbarWidth: '0px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

type Props = SelectProps & {
  selectItems?: Array<{
    value: number | string;
    label: number | string;
    icon?: React.ReactNode;
  }>;
  variant?: 'standard' | 'outlined' | 'filled';
  multiple?: boolean;
  value?: number | string | any;
  onChange?: (val: React.BaseSyntheticEvent) => void;
  selectBoxStyle?: React.CSSProperties;
  isPlaceholderNone?: boolean;
  placeholderText?: string;
  isError?: boolean;
  borderColor?: string;
  helperText?: string;
  required?: boolean;
  borderRadius?: number;
  background?: string;
  iconColor?: string;
  isCheckbox?: boolean;
  selectWidth?: number;
  popUpWidth?: number;
  isMarginTop?: boolean;
  padding?: any;
  selectHeight?: number;
  selectLabel?: string;
  isReadOnly?: boolean;
  isSearch?: boolean;
  selectLabelColor?: string;
  isLabelAbove?: boolean;
  selectedColor?: string;
  menuItemTextColor?: string;
  menuItemTextSize?: number;
  menuItemHoverColor?: string;
  menuItemSelectedColor?: string;
  placeholderSize?: string | number;
  placeholderColor?: string;
  focusBorderColor?: string;
  textStyle?: any;
  iconStyle?: any;
  menuStyle?: any;
  labelStyle?: any;
  ishover?: boolean;
  labelFlexSize?: number;
};

//TODO: Need to remove not using props
const MUHSelectBoxComponent = React.memo(function MUHSelectBoxComponent(
  props: Props
) {
  const theme = useTheme();
  const {
    selectItems,
    multiple = false,
    variant = 'outlined',
    value,
    onChange,
    selectBoxStyle,
    isPlaceholderNone = false,
    isError = false,
    borderColor,
    helperText,
    iconColor,
    borderRadius,
    background,
    isCheckbox = true,
    selectWidth,
    popUpWidth,
    isMarginTop = false,
    padding,
    selectHeight,
    selectLabel,
    required = false,
    isReadOnly = false,
    isSearch = false,
    selectLabelColor,
    isLabelAbove = false,
    selectedColor,
    placeholderText,
    menuItemTextColor = 'auto',
    menuItemTextSize,
    menuItemHoverColor = '#FBF3F4',
    menuItemSelectedColor = '#F0D0D2',
    placeholderSize = '12.5px',
    placeholderColor = theme.Colors.blueGray,
    focusBorderColor = isReadOnly
      ? theme.Colors.silverFoilWhite
      : theme.Colors.primary,
    textStyle,
    iconStyle,
    menuStyle,
    labelStyle,
    ishover = true,
    labelFlexSize = 5,
    disabled = false,
    ...rest
  } = props;

  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const disabledTextColor = 'rgba(0, 0, 0, 0.38)';

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredItems = selectItems?.filter((item) =>
    item.label?.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      sx: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: popUpWidth || '100%',
      },
    },
  };

  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ width: '100%' }}
    >
      {isLabelAbove
        ? null
        : selectLabel && (
            <Grid size={labelFlexSize}>
              <Typography
                variant="h6"
                sx={{
                  color:
                    selectLabelColor || isError
                      ? theme.Colors.redPrimary
                      : theme.Colors.blackPrimary,
                  fontSize: theme.MetricsSizes.small_xx,
                  ...labelStyle,
                }}
              >
                {selectLabel}
                {required && (
                  <span
                    style={{
                      color: theme.Colors.redPrimary,
                      fontWeight: theme.fontWeight.medium,
                    }}
                  >
                    &nbsp;*
                  </span>
                )}
              </Typography>
            </Grid>
          )}
      <Grid size={'grow'}>
        {isLabelAbove
          ? selectLabel && (
              <Typography
                variant="h4"
                sx={{
                  color:
                    selectLabelColor || isError
                      ? theme.Colors.redPrimary
                      : theme.Colors.blackPrimary,
                  ...labelStyle,
                }}
              >
                {selectLabel}
                {required && (
                  <span
                    style={{
                      color: theme.Colors.redPrimary,
                      fontWeight: theme.fontWeight.medium,
                    }}
                  >
                    &nbsp;*
                  </span>
                )}
              </Typography>
            )
          : null}
        <Select
          multiple={multiple}
          variant={variant}
          fullWidth
          value={value}
          error={isError}
          onChange={onChange}
          MenuProps={MenuProps}
          style={selectBoxStyle}
          open={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
          displayEmpty
          disabled={disabled}
          inputProps={{
            MenuProps: {
              disableScrollLock: true,
              PaperProps: {
                sx: {
                  boxShadow: 'none',
                  border: `1px solid ${theme.Colors.grayLight}`,
                  maxHeight: 240,
                  overflowY: 'auto',
                  background: theme.Colors.whitePrimary,
                  
                  //     '&::-webkit-scrollbar': {
                  //   width: 0,
                  // },
                  '& .MuiList-root.MuiMenu-list': {
                    paddingTop: 0,
                  },
                  ...menuStyle,
                },
              },
            },
            readOnly: isReadOnly,
          }}
          IconComponent={ExpandMore}
          sx={{
            color: theme.Colors.grayBlue,
            fontSize: theme.MetricsSizes.small_xx,
            fontWeight: theme.fontWeight.medium,
            fontFamily: theme.fontFamily.interRegular,
            marginTop: selectLabel
              ? isMarginTop
                ? 0
                : theme.Spacing.tiny_xx
              : 0,
            width: selectWidth || '100%',
            height: selectHeight || 40,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: borderColor || 'auto',
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: selectedColor || theme.Colors.black,
              // fontSize: theme.MetricsSizes.small_xx,
              // fontFamily: theme.fontFamily.interRegular,
              fontFamily: 'roboto slab',
              fontWeight: 400,
              fontSize: 16,
              paddingRight: `${textStyle?.paddingRight || 25}px !important`,
              ...textStyle,
            },
            '&.Mui-disabled .MuiSelect-select': {
              color: disabledTextColor,
              WebkitTextFillColor: disabledTextColor,
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor:
                (isError
                  ? theme.Colors.redPrimary
                  : theme.Colors.silverFoilWhite) || borderColor,
              borderWidth: theme.Spacing.tiny_xx,
              borderRadius: borderRadius || theme.Spacing.small_xx,
              backgroundColor: background || 'transparent',
            },
            '& .MuiSelect-select.Mui-disabled': {
              color: disabledTextColor,
              WebkitTextFillColor: disabledTextColor,
            },
            '& .MuiOutlinedInput-input.Mui-disabled': {
              color: disabledTextColor,
              WebkitTextFillColor: disabledTextColor,
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
              padding: padding || '0.75rem 1rem',
            },
            '& .MuiSelect-select:focus': {
              background: 'transparent',
              outline: 'none',
            },
            '& .MuiSelect-icon': {
              color: iconColor || theme.Colors.graySecondary,
              fontSize: '17px',
              fontWeight: 500,
              ...iconStyle,
            },
            '&:hover': {
              borderColor: isError
                ? theme.Colors.redPrimary
                : ishover
                  ? focusBorderColor
                  : 'transparent',
              borderWidth: '1px',
              '&& fieldset': {
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : ishover
                    ? focusBorderColor
                    : 'transparent',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent',
              borderColor: isError ? theme.Colors.redPrimary : focusBorderColor,
              borderWidth: '1px',
            },
            '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
              {
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : focusBorderColor,
                borderWidth: '1px',
              },
          }}
          renderValue={(selected: any) => {
            if (
              selected === '' ||
              selected == null ||
              (Array.isArray(selected) && selected.length === 0)
            ) {
              return (
                <MUHTypography
                  text={placeholderText || ''}
                  size={placeholderSize}
                  weight={500}
                  color={disabled ? disabledTextColor : placeholderColor}
                  family={theme.fontFamily.roboto}
                  sx={textTypoStyle}
                />
              );
            }

            if (Array.isArray(selected)) {
              const selectedLabels = selected
                .map(
                  (val) =>
                    selectItems?.find((item) => item.value === val)?.label
                )
                .filter(Boolean)
                .join(', ');

              return (
                <MUHTypography
                  text={selectedLabels}
                  size={textStyle?.fontSize || '14px'}
                  weight={500}
                  color={
                    disabled
                      ? disabledTextColor
                      : selectedColor || theme.Colors.black
                  }
                  family={theme.fontFamily.roboto}
                  sx={textTypoStyle}
                />
              );
            }

            const getSelValue: any = selectItems?.find(
              (itm) => itm.value === selected
            );

            return (
              <MUHTypography
                text={getSelValue?.label || ''}
                size={textStyle?.fontSize || '14px'}
                weight={textStyle?.fontWeight || 500}
                color={
                  disabled
                    ? disabledTextColor
                    : selectedColor || theme.Colors.black
                }
                family={theme.fontFamily.roboto}
                sx={textTypoStyle}
              />
            );
          }}
          {...rest}
        >
          {isSearch && (
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: theme.Colors.whitePrimary,
                px: 1,
                py: 0.5,
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearchChange(e)}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: textStyle?.fontSize || '14px',
                  fontFamily: theme.fontFamily.roboto,
                  color: theme.Colors.blackPrimary,
                  padding: '6px 8px',
                }}
              />
            </Box>
          )}

          {filteredItems && filteredItems.length > 0 ? (
            filteredItems?.map((item, index) => (
              <MenuItem
                key={index}
                value={item.value}
                onClick={() => {
                  setSearchText('');
                  if (!multiple) setMenuOpen(false);
                }}
                sx={{
                  px: 2,
                  minHeight: 40,
                  borderBottom:
                    filteredItems.length - 1 === index
                      ? 'none'
                      : `1px solid ${theme.Colors.grayLightSecondary}`,
                  '&:hover': {
                    backgroundColor: menuItemHoverColor,
                  },
                  '&.Mui-selected': {
                    backgroundColor: menuItemSelectedColor,
                    '&:hover': {
                      backgroundColor: menuItemSelectedColor,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{ alignItems: 'center', minWidth: item.icon ? 40 : 0 }}
                >
                  {isCheckbox && (
                    <Checkbox
                      checked={
                        multiple
                          ? value?.includes(item.value)
                          : value === item.value
                      }
                      size="small"
                    />
                  )}
                  {item.icon && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      {item.icon}
                    </Box>
                  )}
                  <ListItemText
                    primary={item.label}
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: theme.fontWeight.medium,
                      color: menuItemTextColor || theme.Colors.black,
                      '& .MuiTypography-root': {
                        fontSize: menuItemTextSize
                          ? `${menuItemTextSize}px !important`
                          : '14px',
                      },
                    }}
                  />
                </ListItemIcon>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <ListItemText primary="Not found" />
            </MenuItem>
          )}
        </Select>
        {isError && (
          <FormHelperText
            sx={{
              textTransform: 'none',
              color: theme.Colors.redPrimary,
              paddingLeft: theme.Spacing.small_xxx,
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  );
});

export default MUHSelectBoxComponent;
