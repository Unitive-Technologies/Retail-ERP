import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import Grid from '@mui/material/Grid2';
import './customDatePicker.css';

type DateRange = [Date | null, Date | null] | null;

interface MUHDateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  isFormat?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  isError?: boolean;
  maxDate?: Date;
}

const MUHDateRangePicker = ({
  value,
  onChange,
  isFormat = true,
  placeholder = 'Select date range',
  disabled = false,
  required = false,
  label,
  isError = false,
  maxDate = new Date(),
}: MUHDateRangePickerProps) => {
  const customCalendarIcon = (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.875 13.4046C13.875 14.495 12.995 15.375 11.9046 15.375H2.09538C1.005 15.375 0.125 14.495 0.125 13.4046V3.59538C0.125 2.505 1.005 1.625 2.09538 1.625H4.25V0.944375C4.25111 0.782604 4.30812 0.626192 4.41136 0.501646C4.51461 0.3771 4.65774 0.292082 4.8165 0.261L4.9375 0.25C5.317 0.25 5.625 0.54425 5.625 0.944375V1.625H8.375V0.944375C8.37611 0.782604 8.43312 0.626192 8.53636 0.501646C8.63961 0.3771 8.78274 0.292082 8.9415 0.261L9.0625 0.25C9.442 0.25 9.75 0.54425 9.75 0.944375V1.625H11.9046C12.995 1.625 13.875 2.505 13.875 3.59538V13.4046ZM1.5 5.75V13.0787C1.5 13.5875 1.9125 14 2.42125 14H11.5787C12.0875 14 12.5 13.5875 12.5 13.0787V5.75H1.5Z"
        fill={isError ? '#d32f2f' : 'black'}
      />
    </svg>
  );

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <Grid
        sx={{
          '& .react-daterange-picker': {
            border: isError ? '1px solid #d32f2f' : '1px solid #aeafb0',
            '&:focus-within': {
              borderColor: isError ? '#d32f2f' : '#117abb',
              boxShadow: `0 0 0 1px ${isError ? '#d32f2f' : '#117abb'}`,
            },
          },
          '& .react-daterange-picker__wrapper': {
            borderRadius: 1,
            borderColor: 'transparent',
            width: '100%',
          },
        }}
      >
        <DateRangePicker
          onChange={onChange}
          value={value}
          className="custom-daterange-picker"
          format={isFormat ? 'dd/MM/yyyy' : ''}
          dayPlaceholder="dd"
          monthPlaceholder="mm"
          yearPlaceholder="yyyy"
          clearIcon={null}
          calendarIcon={customCalendarIcon}
          disabled={disabled}
          required={required}
          maxDate={maxDate}
        />
      </Grid>
    </div>
  );
};

export default MUHDateRangePicker;
