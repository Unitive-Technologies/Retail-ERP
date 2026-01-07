import { useTheme, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { TextInput } from '@components/index';
import {
  columnCellStyle,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';
import toast from 'react-hot-toast';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';

type Props = {
  edit?: {
    getValue: (key: string) => any;
    update: (data: any) => void;
  };
  isError?: boolean;
  fieldErrors?: any;
  type?: string | null;
};

interface RowData {
  id: number;
  organization_name: string;
  role: string;
  duration_from?: Date | null | string;
  duration_to?: Date | null | string;
  location: string;
}

const PreviousExp = ({ edit, isError, type }: Props) => {
  const theme = useTheme();
  const isReadOnly = type === 'view'; // Determine if read-only

  console.log('PreviousExp - edit object:', edit);
  console.log(
    'PreviousExp - all form values:',
    edit?.getValue
      ? {
          experiences: edit.getValue('experiences'),
          employee_name: edit.getValue('employee_name'),
          contact_details: edit.getValue('contact_details'),
          // Check if data exists under different keys
          experience: edit.getValue('experience'),
          prev_exp: edit.getValue('prev_exp'),
          previous_experience: edit.getValue('previous_experience'),
        }
      : 'edit.getValue not available'
  );

  const rows = edit?.getValue?.('experiences') || [];
  const defaultRow = [
    {
      id: 1,
      organization_name: '',
      role: '',
      duration_from: null,
      duration_to: null,
      location: '',
    },
  ];

  // Helper function to format date to YYYY-MM-DD in local timezone (not UTC)
  const formatDateToLocalString = (date: Date | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddRow = () => {
    if (!edit?.update || isReadOnly) return; // Prevent adding in view mode

    const lastRow = rows[rows.length - 1];

    if (
      rows.length > 0 &&
      (!lastRow?.organization_name ||
        !lastRow?.role ||
        !lastRow?.duration_from ||
        !lastRow?.duration_to ||
        !lastRow?.location)
    ) {
      toast.error(
        'Please fill all fields in the current row before adding a new row.'
      );
      return;
    }

    const newRow = {
      id: Date.now(),
      organization_name: '',
      role: '',
      duration_from: null,
      duration_to: null,
      location: '',
    };

    edit.update({ experiences: [...rows, newRow] });
  };

  const handleDeleteRow = (id: number) => {
    if (!edit?.update || isReadOnly) return; // Prevent deleting in view mode

    if (rows.length > 1) {
      const updated = rows.filter((r: any) => r.id !== id);
      edit.update({ experiences: updated });
    } else {
      edit.update({ experiences: [] });
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    if (!edit?.update || !edit?.getValue || isReadOnly) return; // Prevent changes in view mode

    const currentRows = edit.getValue('experiences') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        organization_name: '',
        role: '',
        duration_from: null,
        duration_to: null,
        location: '',
        [field]: value,
      };
      updatedRows = [...currentRows, newRow];
    } else {
      updatedRows = currentRows.map((r: any) =>
        r.id === id ? { ...r, [field]: value } : r
      );
    }

    edit.update({ experiences: updatedRows });
  };

  const handleDateRangeChange = (
    id: number,
    dateRange: [Date | null, Date | null] | null
  ) => {
    if (!edit?.update || !edit?.getValue || isReadOnly) return; // Prevent changes in view mode

    const [startDate, endDate] = dateRange || [null, null];

    const currentRows = edit.getValue('experiences') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        organization_name: '',
        role: '',
        duration_from: formatDateToLocalString(startDate),
        duration_to: formatDateToLocalString(endDate),
        location: '',
      };
      updatedRows = [...currentRows, newRow];
    } else {
      updatedRows = currentRows.map((r: any) =>
        r.id === id
          ? {
              ...r,
              duration_from: formatDateToLocalString(startDate),
              duration_to: formatDateToLocalString(endDate),
            }
          : r
      );
    }

    edit.update({ experiences: updatedRows });
  };

  const getFieldError = (rowId: number, field: string) => {
    if (!isError || isReadOnly) return false; // No errors in view mode
    const row = rows.find((r: any) => r.id === rowId);
    if (!row) return false;

    const hasOtherValues = Object.entries(row)
      .filter(([key]) => key !== 'id' && key !== field)
      .some(([, value]) => value && value.toString().trim());

    return hasOtherValues && (!row[field] || !row[field].toString().trim());
  };

  // Show data even if no rows exist in view mode
  const displayRows = rows.length > 0 ? rows : isReadOnly ? [] : defaultRow;

  return (
    <Grid pb={2} sx={formLayoutStyle}>
      <Grid container sx={tableColumnStyle}>
  <Grid size={1} sx={columnCellStyle}>S.No</Grid>
  <Grid size={3} sx={columnCellStyle}>Organization Name</Grid>
  <Grid size={2} sx={columnCellStyle}>Role</Grid>
  <Grid size={3} sx={columnCellStyle}>Duration</Grid>
  <Grid size={2} sx={columnCellStyle}>Location</Grid>
  <Grid size={1} sx={{ ...columnCellStyle, border: 'none' }}>
    {!isReadOnly && 'Action'}
  </Grid>
</Grid>

      {displayRows.map((row: RowData, index: number) => (
        <Grid container sx={tableRowStyle} key={row.id}>
          <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 500 }}>
            {index + 1}
          </Grid>
          <Grid
            size={3}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Organization Name"
              value={row.organization_name || ''}
              onChange={(e: any) =>
                handleInputChange(row.id, 'organization_name', e.target.value)
              }
              isError={getFieldError(row.id, 'organization_name')}
              disabled={isReadOnly}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={2}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Role"
              value={row.role || ''}
              onChange={(e: any) =>
                handleInputChange(row.id, 'role', e.target.value)
              }
              isError={getFieldError(row.id, 'role')}
              disabled={isReadOnly}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={3}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MUHDateRangePicker
              value={
                row.duration_from && row.duration_to
                  ? [new Date(row.duration_from), new Date(row.duration_to)]
                  : null
              }
              onChange={(dateRange) => handleDateRangeChange(row.id, dateRange)}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
              isError={getFieldError(row.id, 'duration_from')}
              disabled={isReadOnly}
              variant="table"
              maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </Grid>
          <Grid
            size={2}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Location"
              value={row.location || ''}
              onChange={(e: any) =>
                handleInputChange(row.id, 'location', e.target.value)
              }
              isError={getFieldError(row.id, 'location')}
              disabled={isReadOnly}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!isReadOnly && ( // Hide action buttons in view mode
              <>
                {rows.length === 0 || rows.length - 1 === index ? (
                  <IconButton onClick={handleAddRow}>
                    <Add sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleDeleteRow(row.id)}>
                    <Delete sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                )}
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default PreviousExp;
