import { useTheme, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { AutoSearchSelectWithLabel, TextInput } from '@components/index';
import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';
import toast from 'react-hot-toast';
import { onlyString } from '@utils/form-util';
import Grid from '@mui/material/Grid2';
import {
  categoryOptions,
  MaterialTypeOptions,
  subCategoryOptions,
} from '@constants/DummyData';

type Props = {
  edit: any;
};

const VendorDetails = ({ edit }: Props) => {
  const theme = useTheme();
  const rows = edit?.getValue('invoice_settings') || [];

  const defaultRow = [
    {
      id: 1,
      material_type: '',
      category: '',
      sub_category: '',
      description: '',
      purity: '',
      weight: '',
      quantity: '',
      rate: '',
      amount: '',
    },
  ];

  const handleAddRow = () => {
    const currentRows = edit.getValue('invoice_settings') || [];

    if (currentRows.length === 0) {
      const newRow = {
        id: Date.now(),
        material_type: '',
        category: '',
        sub_category: '',
        description: '',
        purity: '',
        weight: '',
        quantity: '',
        rate: '',
        amount: '',
      };
      edit.update({ invoice_settings: [newRow] });
      return;
    }

    const lastRow = currentRows[currentRows.length - 1];

    if (
      !lastRow.material_type ||
      !lastRow.category ||
      !lastRow.sub_category ||
      !lastRow.description ||
      !lastRow.purity ||
      !lastRow.weight ||
      !lastRow.quantity ||
      !lastRow.rate ||
      !lastRow.amount
    ) {
      toast.error('Please fill all fields before adding a new row.');
      return;
    }

    const newRow = {
      id: Date.now(),
      material_type: '',
      category: '',
      sub_category: '',
      description: '',
      purity: '',
      weight: '',
      quantity: '',
      rate: '',
      amount: '',
    };

    edit.update({ invoice_settings: [...currentRows, newRow] });
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      const updated = rows.filter((r: any) => r.id !== id);
      edit.update({ invoice_settings: updated });
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    const currentRows = edit.getValue('invoice_settings') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        material_type: '',
        category: '',
        sub_category: '',
        description: '',
        purity: '',
        weight: '',
        quantity: '',
        rate: '',
        amount: '',
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

  // Calculate totals
  const calculateTotals = () => {
    const currentRows = edit.getValue('invoice_settings') || [];
    const totals = currentRows.reduce(
      (acc: any, row: any) => {
        acc.orderedWeight += parseFloat(row.ordered_weight) || 0;
        acc.receivedWeight += parseFloat(row.received_weight) || 0;
        acc.amount += parseFloat(row.amount) || 0;
        return acc;
      },
      { orderedWeight: 0, receivedWeight: 0, amount: 0 }
    );
    return totals;
  };

  const totals = calculateTotals();

  return (
    <Grid width={'100%'} pb={2}>
      <Grid
        container
        sx={{
          ...tableColumnStyle,
          borderRadius: '8px 8px 0px 0px',
          backgroundColor: '#F8F9FA',
          borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
        }}
      >
        <Grid sx={columnCellStyle} size={1}>
          S.No
        </Grid>
        <Grid sx={columnCellStyle} size={1.5}>
          Material Type
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Category
        </Grid>
        <Grid sx={columnCellStyle} size={1.5}>
          Sub Category
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Product Name
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Purity
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Weight
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Quantity
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Rate
        </Grid>
        <Grid sx={columnCellStyle} size={1}>
          Amount
        </Grid>
        <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
          Action
        </Grid>
      </Grid>

      {(rows.length > 0 ? rows : defaultRow).map((row: any, index: number) => (
        <Grid container sx={tableRowStyle} key={row.id}>
          <Grid size={1} sx={{ ...columnCellStyle, fontWeight: 500 }}>
            {index + 1}
          </Grid>

          <Grid
            size={1.5}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              padding: 2,
            }}
          >
            <AutoSearchSelectWithLabel
              required
              options={MaterialTypeOptions}
              value={row.material_type}
              onChange={(e, value) =>
                handleInputChange(row.id, 'material_type', value)
              }
              focusBorderColor={theme.Colors.whitePrimary}
            />
          </Grid>

          <Grid
            size={1}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              padding: 2,
            }}
          >
            <AutoSearchSelectWithLabel
              required
              options={categoryOptions}
              value={row.category}
              onChange={(e, value) =>
                handleInputChange(row.id, 'category', value)
              }
              focusBorderColor={theme.Colors.whitePrimary}
            />
          </Grid>

          <Grid
            size={1.5}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              padding: 2,
            }}
          >
            <AutoSearchSelectWithLabel
              required
              options={subCategoryOptions}
              value={row.sub_category}
              onChange={(e, value) =>
                handleInputChange(row.id, 'sub_category', value)
              }
              focusBorderColor={theme.Colors.whitePrimary}
            />
          </Grid>
          <Grid
            size={1}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
            }}
          >
            <TextInput
              value={row.description}
              onChange={(e: any) => {
                if (onlyString(e.target.value)) {
                  handleInputChange(row.id, 'description', e.target.value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              value={row.purity}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*%?$/.test(value)) {
                  handleInputChange(row.id, 'purity', value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              value={row.weight}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleInputChange(row.id, 'weight', value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              value={row.quantity}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleInputChange(row.id, 'quantity', value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              value={row.rate}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleInputChange(row.id, 'rate', value);
                }
              }}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
          >
            <TextInput
              value={row.amount}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleInputChange(row.id, 'amount', value);
                }
              }}
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
            {rows.length === 0 || rows.length - 1 === index ? (
              <IconButton onClick={handleAddRow}>
                <Add sx={{ color: theme.Colors.primary }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleDeleteRow(row.id)}>
                <Delete sx={{ color: theme.Colors.primary }} />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}

      {/* Total Row */}
      <Grid
        container
        sx={{
          ...tableRowStyle,
          backgroundColor: '#F5F5F5',
          fontWeight: 600,
          borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
          borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
          borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
          border: '0px 0px 8px 8px',
        }}
      >
        <Grid
          size={1}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1.5}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1.5}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          Total
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
        >
          {totals.orderedWeight.toFixed(2)} g
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, fontWeight: 600, borderRight: 'none' }}
        >
          {totals.receivedWeight.toFixed(2)} g
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, fontWeight: 600, borderRight: 'none' }}
        >
          {/* Empty */}
        </Grid>
        <Grid
          size={1}
          sx={{ ...columnCellStyle, fontWeight: 600, borderRight: 'none' }}
        >
          ₹{totals.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Grid>
        <Grid
          size={1}
          sx={{
            ...columnCellStyle,
            border: 'none',
            fontWeight: 600,
            borderRight: 'none',
          }}
        >
          {/* Empty */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VendorDetails;
