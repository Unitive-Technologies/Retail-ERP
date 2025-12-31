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
import { isAlphaNumericWithSpace } from '@utils/form-util';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

type Props = {
  edit: any;
  type?: string | null;
};
const SPOCDetails = ({ edit, type }: Props) => {
  const theme = useTheme();
  const allRows = edit.getValue('spoc_details') || [];
  const isReadOnly = type === 'view';

  // Filter out empty rows in view mode, but keep rows with IDs (from server)
  const rows = isReadOnly
    ? allRows.filter(
        (row: any) =>
          row &&
          (row.id || row.contact_name || row.mobile || row.designation)
      )
    : allRows.length > 0 ? allRows : [{ contact_name: '', mobile: '', designation: '' }];

  const defaultRow = [{ contact_name: '', mobile: '', designation: '' }];

  const isMobileInvalid = (mobile: any) => {
    const digits = String(mobile || '').replace(/\D/g, '');
    return digits.length > 0 && digits.length !== 10;
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (rows.length > 0) {
      const isServerRow = 'id' in (lastRow || {});
      const hasMissing =
        !lastRow?.contact_name || !lastRow?.mobile || !lastRow?.designation;
      if (!isServerRow && hasMissing) {
        toast.error('Please fill all fields before adding a new row.');
        return;
      }
      const mobileDigits = String(lastRow?.mobile || '').replace(/\D/g, '');
      if (!isServerRow && mobileDigits.length !== 10) {
        toast.error('Please enter a valid  mobile number');
        return;
      }
    }

    const newRow = {
      // id: Date.now(),
      contact_name: '',
      mobile: '',
      designation: '',
    };

    edit.update({ spoc_details: [...rows, newRow] });
  };

  const handleDeleteRow = async (id: number | undefined, rowIndex: number) => {
    const row = rows[rowIndex];
    if (row && row.id) {
      try {
        const res: any = await API_SERVICES.SPOCService.deleteSpoc(row.id, {
          successMessage: 'SPOC deleted successfully',
          failureMessage: 'Failed to delete SPOC',
        });
        if (res?.status < HTTP_STATUSES.BAD_REQUEST) {
          if (rows.length > 1) {
            const updated = rows.filter((r: any) => r.id !== row.id);
            edit.update({ spoc_details: updated });
          } else {
            edit.update({
              spoc_details: [{ contact_name: '', mobile: '', designation: '' }],
            });
          }
        }
      } catch (err: any) {
        console.log(err);
      }
    } else {
      if (rows.length > 1) {
        const updated = rows.filter((_: any, i: number) => i !== rowIndex);
        edit.update({ spoc_details: updated });
      } else {
        edit.update({
          spoc_details: [{ contact_name: '', mobile: '', designation: '' }],
        });
      }
    }
  };

  const handleInputChange = (rowIndex: number, field: string, value: any) => {
    const currentRows = edit.getValue('spoc_details') || [];
    const updatedRows = [...currentRows];
    if (!updatedRows[rowIndex]) {
      updatedRows[rowIndex] = {
        contact_name: '',
        mobile: '',
        designation: '',
      } as any;
    }
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: value,
    };
    edit.update({ spoc_details: updatedRows });
  };

  return (
    <Grid width={'100%'} pb={2} sx={formLayoutStyle}>
      <Grid container sx={tableColumnStyle}>
        <Grid sx={columnCellStyle} size={1}>
          S.No
        </Grid>
        <Grid sx={columnCellStyle} size={3.33}>
          Name
        </Grid>
        <Grid sx={columnCellStyle} size={3.33}>
          Mobile Number
        </Grid>
        <Grid
          sx={{
            ...columnCellStyle,
            ...(isReadOnly && { borderRight: 'none' }),
          }}
          size={3.33}
        >
          Designation
        </Grid>
        {!isReadOnly && (
          <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
            Action
          </Grid>
        )}
      </Grid>

      {(rows.length > 0 ? rows : isReadOnly ? [] : defaultRow).map(
        (row: any, index: number) => (
          <Grid container sx={tableRowStyle} key={index}>
            <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 500 }}>
              {index + 1}
            </Grid>
            <Grid
              size={3.33}
              sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
            >
              <TextInput
                placeholderText="Enter Name"
                value={row.contact_name}
                disabled={isReadOnly}
                isReadOnly={isReadOnly}
                onChange={(e: any) => {
                  if (isAlphaNumericWithSpace(e.target.value)) {
                    handleInputChange(index, 'contact_name', e.target.value);
                  }
                }}
                {...tableTextInputProps}
              />
            </Grid>
            <Grid
              size={3.33}
              sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
            >
              {/* <TextInput
              placeholderText="Enter Mobile Number"
              value={row.mobile}
              onChange={(e: any) => {
                // allow incremental typing: only digits, up to 10 chars
                const next = (e.target.value || '').replace(/\D/g, '');
                if (next.length <= 10) {
                  handleInputChange(index, 'mobile', next);
                }
              }}
              isReadOnly={type === 'view'}
              {...tableTextInputProps} */}
              {/* /> */}
              <TextInput
                placeholderText="Enter Mobile Number"
                value={row.mobile}
                disabled={isReadOnly}
                onChange={(e: any) => {
                  const cleaned = String(e.target.value || '')
                    .replace(/\D/g, '')
                    .slice(0, 10);

                  handleInputChange(index, 'mobile', cleaned);
                }}
                isReadOnly={isReadOnly}
                isError={isMobileInvalid(row.mobile)}
                {...tableTextInputProps}
              />
            </Grid>
            <Grid
              size={3.33}
              sx={{
                ...(!isReadOnly && {
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                }),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                placeholderText="Enter Designation"
                value={row.designation}
                disabled={isReadOnly}
                onChange={(e: any) => {
                  if (isAlphaNumericWithSpace(e.target.value)) {
                    handleInputChange(index, 'designation', e.target.value);
                  }
                }}
                isReadOnly={isReadOnly}
                {...tableTextInputProps}
              />
            </Grid>
            {!isReadOnly && (
              <Grid
                size={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {rows.length === 0 || rows.length - 1 == index ? (
                  <IconButton onClick={handleAddRow}>
                    <Add sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleDeleteRow(row.id, index)}>
                    <Delete sx={{ color: theme.Colors.primary }} />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>
        )
      )}
    </Grid>
  );
};
export default SPOCDetails;
