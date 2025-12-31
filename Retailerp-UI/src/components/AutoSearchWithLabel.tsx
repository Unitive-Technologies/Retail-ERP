import React from 'react';
import { Autocomplete, TextField, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ExpandMore } from '@mui/icons-material';

type Props = {
  options: optionProps[];
  placeholder?: string;
  value: optionProps | null;
  isError?: boolean;
  height?: number;
  label?: string;
  required?: boolean;
  isReadOnly?: boolean;
  isLabelAbove?: boolean;
  labelStyle?: any;
  searchBoxStyle?: any;
  focusBorderColor?: string;
  menuItemSelectedColor?: string;
  menuItemHoverColor?: string;
  menuItemTextSize?: number;
  iconSvgStyle?: any;
  textStyle?: any;
  optionContainerStyle?: any;
  iconStyle?: any;
  placeholdrStyle?: any;
  onAddNew?: () => void;
  addNewLabel?: string;
  onChange: (e: any, val: any) => void;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
};

type optionProps = {
  label: string;
  value: string | number;
};

const AutoSearchSelectWithLabel = React.memo(function AutoSearchSelectWithLabel(
  props: Props
) {
  const theme = useTheme();
  const {
    options = [],
    isError = false,
    height = 40,
    label,
    required,
    placeholder,
    isReadOnly = false,
    onChange,
    value,
    isLabelAbove = false,
    labelStyle,
    searchBoxStyle,
    focusBorderColor = theme.Colors.primary,
    menuItemSelectedColor = theme.Colors.secondaryDimDark,
    menuItemHoverColor = theme.Colors.secondaryDim,
    menuItemTextSize,
    iconSvgStyle,
    textStyle,
    optionContainerStyle,
    iconStyle,
    placeholdrStyle,
    onAddNew,
    addNewLabel = '+ Add New',
    ...rest
  } = props;

  const ADD_KEY = '__add_new__';
  const mergedOptions = onAddNew
    ? ([{ label: addNewLabel, value: ADD_KEY }] as optionProps[]).concat(
        options
      )
    : options;

  const handleOptionChange = (event: any, selectedValue: any) => {
    if (selectedValue?.value === ADD_KEY) {
      // Prevent selecting this special option; trigger handler instead
      onAddNew && onAddNew();
      return;
    }
    onChange(event, selectedValue);
  };

  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ width: '100%' }}
    >
      {isLabelAbove
        ? label && (
            <Typography
              variant="inherit"
              sx={{
                color: isError ? theme.Colors.redPrimary : theme.Colors.black,
                fontSize: theme.MetricsSizes.small_xx,
                fontWeight: theme.fontWeight.medium,
                ...labelStyle,
              }}
            >
              {label}
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
        : label && (
            <Grid size={5}>
              <Typography
                variant="inherit"
                sx={{
                  color: isError
                    ? theme.Colors.redPrimary
                    : theme.Colors.blackPrimary,
                  fontSize: theme.MetricsSizes.small_xx,
                  fontWeight: theme.fontWeight.medium,
                  ...labelStyle,
                }}
              >
                {label}
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
        <Autocomplete
          options={mergedOptions}
          disabled={isReadOnly}
          popupIcon={
            <ExpandMore
              sx={{
                color: theme.Colors.dustyGray,
                fontSize: '20px',
                ...iconStyle,
              }}
            />
          }
          getOptionLabel={(option) => option.label || ''}
          disableClearable={isReadOnly}
          onChange={!isReadOnly ? handleOptionChange : undefined}
          value={value || null}
          isOptionEqualToValue={(option, val) => option.value === val.value}
          {...rest}
          sx={{
            '& .MuiOutlinedInput-root': {
              height,
              borderRadius: '8px',
              ...searchBoxStyle,
              '& fieldset': {
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : theme.Colors.grayPrimary,
                borderWidth: '1px',
                ...searchBoxStyle,
              },
              '&:hover fieldset': {
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : focusBorderColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : focusBorderColor,
                borderWidth: '1px',
              },
            },
            '& .MuiAutocomplete-clearIndicator': {
              color: theme.Colors.dustyGray,
              background: theme.Colors.whitePrimary,
              pt: 0.6,
              '& svg': {
                width: '15px',
                height: '15px',
                ...iconSvgStyle,
              },
              ...iconStyle,
            },
            '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root':
              {
                paddingRight: '0px',
              },
          }}
          slotProps={{
            paper: {
              sx: {
                boxShadow: 'none',
                border: `1px solid ${theme.Colors.grayLight}`,
                overflowY: 'auto',
                maxHeight: 280,
                borderRadius: '8px',
                background: theme.Colors.whitePrimary,
                '& .MuiAutocomplete-listbox': {
                  padding: '8px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${menuItemSelectedColor} transparent`,
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar': {
                  width: '6px',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
                  backgroundColor: menuItemSelectedColor,
                  borderRadius: '4px',
                },
                '& .MuiAutocomplete-option': {
                  px: 2,
                  py: 0.7,
                  borderBottom: `1px solid ${theme.Colors.grayLightSecondary}`,
                  display: 'flex',
                  alignItems: 'center',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                  '&:hover': {
                    backgroundColor: menuItemHoverColor,
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: `${menuItemSelectedColor} !important`,
                    '&:hover': {
                      backgroundColor: `${menuItemSelectedColor} !important`,
                    },
                  },
                },
                ...optionContainerStyle,
              },
            },
          }}
          renderOption={(props, option) => {
            if (onAddNew && option?.value === ADD_KEY) {
              return (
                <li
                  {...props}
                  key={option?.value}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddNew();
                  }}
                  style={{
                    listStyle: 'none',
                    width: '100%',
                    padding: 0,
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    sx={{
                      backgroundColor: theme.Colors.primary,
                      color: theme.Colors.whitePrimary,
                      borderRadius: '8px',
                      height: 36,
                      justifyContent: 'center',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="inherit"
                      sx={{
                        fontFamily: theme.fontFamily.roboto,
                        fontWeight: theme.fontWeight.medium,
                        fontSize: menuItemTextSize || '14px',
                        lineHeight: 1,
                      }}
                    >
                      {addNewLabel}
                    </Typography>
                  </Grid>
                </li>
              );
            }
            return (
              <li {...props} key={option?.value}>
                <Grid
                  container
                  alignItems="center"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="inherit"
                    sx={{
                      fontFamily: theme.fontFamily.roboto,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.Colors.black,
                      fontSize: menuItemTextSize || '14px',
                      ...textStyle,
                    }}
                  >
                    {option.label}
                  </Typography>
                </Grid>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              inputProps={{
                ...params.inputProps,
                readOnly: isReadOnly,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: theme.fontFamily.roboto,
                  fontWeight: theme.fontWeight.medium,
                  color: theme.Colors.black,
                  fontSize: '14px',
                  overflowX: 'scroll',
                  textOverflow: 'clip',
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                  '&::placeholder': {
                    color: theme.Colors.blackLightLow,
                    opacity: 1,
                    ...placeholdrStyle,
                  },
                  ...textStyle,
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
});

export default AutoSearchSelectWithLabel;
