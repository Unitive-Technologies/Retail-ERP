import { useState } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
  Button,
  DialogActions,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid2';
import { DateIcon, DateIconNew } from '@assets/Images';

type dateProps = {
  value: any;
  handleChange: (e: Dayjs | null) => void;
  handleClear: () => void;
  borderColor?: string;
  fontWeight?: number;
  fontSize?: number;
  height?: number;
  padding?: number;
  placeholder?: string;
  maxDate?: any;
  minDate?: any;
  labelText?: string;
  isError?: boolean;
  required?: boolean;
  widthPlus?: number;
  pickerHeight?: string;
  focusBorderColor?: string;
  labelStyle?: any;
  textStyle?: any;
  pickerContainerStyle?: any;
  pickerTextStyle?: any;
  pickerSelectedStyle?: any;
  isReadOnly?: boolean;
  shouldDisableDate?: (date: Dayjs) => boolean;
  useNewIcon?: boolean;
};

const MUHDatePickerComponent = (props: dateProps) => {
  const theme = useTheme();

  const {
    value,
    handleChange,
    handleClear,
    shouldDisableDate,
    borderColor,
    fontWeight,
    fontSize,
    padding,
    height,
    placeholder = 'dd/mm/yyyy',
    maxDate,
    minDate,
    labelText,
    isError,
    required,
    widthPlus = 0,
    pickerHeight = '320px',
    focusBorderColor = theme.Colors.primary,
    labelStyle,
    textStyle,
    pickerContainerStyle,
    pickerTextStyle,
    pickerSelectedStyle,
    isReadOnly = false,
    useNewIcon = false,
  } = props;

  const [open, setOpen] = useState(false);
  return (
    <Grid container alignItems={'center'} sx={{ width: '100%' }}>
      {labelText ? (
        <Grid size={5}>
          <Typography
            variant="inherit"
            sx={{
              color: isError ? theme.Colors.redPrimary : theme.Colors.black,
              fontSize: theme.MetricsSizes.small_xx,
              fontWeight: theme.fontWeight.medium,
              ...labelStyle,
            }}
          >
            {labelText} {required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
        </Grid>
      ) : null}
      <Grid size={'grow'}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label=""
            format="DD/MM/YYYY"
            value={value}
            onChange={handleChange}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => {
              if (!isReadOnly) setOpen(true);
            }}
            maxDate={maxDate}
            minDate={minDate}
            shouldDisableDate={shouldDisableDate}
            slots={{
              // openPickerIcon: DatePickerIcon,
              openPickerIcon: useNewIcon ? DateIconNew : DateIcon,
              textField: TextField,
              actionBar: () => (
                <DialogActions
                  sx={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    onClick={handleClear}
                    sx={{ fontSize: theme.MetricsSizes.small }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => setOpen(false)}
                    sx={{ fontSize: theme.MetricsSizes.small }}
                  >
                    Close
                  </Button>
                </DialogActions>
              ),
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: placeholder || 'dd/mm/yyyy',
                inputProps: { readOnly: isReadOnly },
                InputLabelProps: { shrink: true },
                sx: {
                  '& .MuiOutlinedInput-multiline': {
                    padding: padding || '0.75rem 1rem',
                    alignItems: 'initial',
                  },
                  '& .MuiInputBase-root': {
                    height: height ? `${height}px` : '40px',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: fontSize || theme.MetricsSizes.small_xx,
                    fontWeight: fontWeight || theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                    padding: padding || '0.75rem 1rem',
                    height: height ? `${height}px` : '40px',
                    ...textStyle,
                  },
                  '& .MuiOutlinedInput-root .MuiIconButton-edgeEnd': {
                    display: isReadOnly ? 'none' : 'inline-flex',
                    pointerEvents: isReadOnly ? 'none' : 'auto',
                  },
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      borderColor ||
                      (isError
                        ? theme.Colors.redPrimary
                        : theme.Colors.silverFoilWhite),
                    borderWidth: '1px',
                    borderRadius: 2,
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: isError
                        ? theme.Colors.redPrimary
                        : isReadOnly
                          ? theme.Colors.silverFoilWhite
                          : focusBorderColor,
                      borderWidth: '1.5px',
                    },
                  },
                  '&:hover:not(.Mui-focused)': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isError
                        ? theme.Colors.redPrimary
                        : isReadOnly
                          ? theme.Colors.silverFoilWhite
                          : focusBorderColor,
                    },
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    boxShadow: 'none',
                    borderRadius: '12px',
                    border: `1px solid ${theme.Colors.grayLight}`,
                    overflow: 'hidden',
                    backgroundColor: theme.Colors.whitePrimary,
                    px: 0.6,
                    ...pickerContainerStyle,
                  },
                  '& .MuiDateCalendar-root': {
                    height: pickerHeight,
                    width: '100%',
                  },
                  '& .MuiYearCalendar-root': {
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  },
                  '& .MuiPickersDay-root &, .MuiPickersYear-yearButton': {
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: theme.fontWeight.medium,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: theme.Colors.grayLight,
                    },
                    ...pickerTextStyle,
                  },
                  '& .MuiPickersDay-root.Mui-selected, & .MuiPickersYear-yearButton.Mui-selected':
                    {
                      backgroundColor: `${theme.Colors.primary} !important`,
                      color: theme.Colors.whitePrimary,
                      fontWeight: theme.fontWeight.bold,
                      '&:hover': {
                        backgroundColor: theme.Colors.primary,
                      },
                      ...pickerSelectedStyle,
                    },
                },
                modifiers: [
                  {
                    name: 'sameWidth',
                    enabled: true,
                    phase: 'beforeWrite',
                    requires: ['computeStyles'],
                    fn: ({ state }) => {
                      state.styles.popper.width = `${state.rects.reference.width + widthPlus}px`;
                    },
                  },
                ],
              },
              layout: {
                sx: {
                  display: 'flex',
                  flexDirection: 'column',
                },
              },
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default MUHDatePickerComponent;
