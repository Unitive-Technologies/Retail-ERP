import { useTheme } from '@mui/material';
import { TextInput } from '@components/index';
import {
  columnCellStyle,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';
import { onlyString } from '@utils/form-util';
import Grid from '@mui/material/Grid2';

type Props = {
  edit: any;
  type?: string | number | null;
};

const InvoiceSetting = ({ edit, type }: Props) => {
  const theme = useTheme();
  const rows = edit?.getValue('invoice_settings') || [];
console.log(rows,'rowsss')
  const defaultRow = [{ id: 1, sequence: '', prefix: '', suffix: '' }];

  const handleInputChange = (id: number, field: string, value: any) => {
    const currentRows = edit.getValue('invoice_settings') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        sequence: '',
        prefix: '',
        suffix: '',
        [field]: value,
      };
      updatedRows = [...currentRows, newRow];
    } else {
      updatedRows = currentRows.map((r: any) =>
        r.id === id ? { ...r, [field]: value } : r
      );
    }

    edit.update({ invoice_settings: updatedRows });
  };

  return (
    <Grid width={'100%'} pb={2} sx={formLayoutStyle}>
      <Grid container sx={tableColumnStyle}>
        <Grid sx={columnCellStyle} size={1}>
          S.No
        </Grid>
        <Grid sx={columnCellStyle} size={4}>
          Sequence
        </Grid>
        <Grid sx={columnCellStyle} size={3}>
          Prefix
        </Grid>
        <Grid sx={columnCellStyle} size={4}>
          Suffix
        </Grid>
      </Grid>

      {(rows.length > 0 ? rows : defaultRow).map((row: any, index: number) => (
        <Grid container sx={tableRowStyle} key={row.id}>
          <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 500 }}>
            {index + 1}
          </Grid>

          <Grid
            size={4}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Document Name"
              value={row.sequence}
              isReadOnly={true}
              onChange={(e: any) => {
                if (onlyString(e.target.value)) {
                  handleInputChange(row.id, 'sequence', e.target.value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>

          <Grid
            size={3}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Document Prefix"
              value={row.prefix}
              disabled={type==='view'}
              onChange={(e: any) => {
                handleInputChange(row.id, 'prefix', e.target.value);
              }}
              {...tableTextInputProps}
            />
          </Grid>

          <Grid
            size={4}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              placeholderText="Enter Document Suffix"
              value={row.suffix}
              disabled={type==='view'}
              onChange={(e: any) => {
                handleInputChange(row.id, 'suffix', e.target.value);
              }}
              {...tableTextInputProps}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default InvoiceSetting;
