import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import Grid from '@mui/material/Grid2';
import './customDatePicker.css';
import { CalenderIcon } from '@assets/Images';

type DateRange = [Date | null, Date | null] | null;
type PickerValue = Date | null | [Date | null, Date | null];

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
  variant?: 'default' | 'table';
}

const MUHDateRangePicker = ({
  value,
  onChange,
  isFormat = true,
  placeholder: _placeholder = 'Select date range',
  disabled = false,
  required = false,
  label: _label,
  isError = false,
  maxDate = new Date(),
  variant = 'default',
}: MUHDateRangePickerProps) => {
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
          onChange={(val: PickerValue) => {
            // Normalize library Value -> app DateRange
            if (val === null) return onChange(null);
            if (Array.isArray(val)) return onChange(val);
            return onChange([val, val]);
          }}
          value={value}
          className={
            variant === 'table'
              ? 'custom-daterange-picker table-daterange-picker'
              : 'custom-daterange-picker'
          }
          format={isFormat ? 'dd/MM/yyyy' : ''}
          dayPlaceholder="dd"
          monthPlaceholder="mm"
          yearPlaceholder="yyyy"
          clearIcon={null}
          calendarIcon={<CalenderIcon width={16} height={16} />}
          disabled={disabled}
          required={required}
          maxDate={maxDate}
        />
      </Grid>
    </div>
  );
};

export default MUHDateRangePicker;
