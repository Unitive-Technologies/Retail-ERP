import { useTheme, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { TextInput } from '@components/index';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import {
  columnCellStyle,
  formLayoutStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
  tableSelectBoxProps,
} from '@components/CommonStyles';
import toast from 'react-hot-toast';
import { BranchType } from '@constants/Constance';

type Props = {
  edit: any;
  type: string|null;
};
const QuotationDetails = ({ edit,type }: Props) => {
  const theme = useTheme();
  const rows = edit.getValue('item_details') || [];

  const defaultRow = [
    {
      id: 1,
      material_type: '',
      category: '',
      sub_category: '',
      product_description: '',
      purity: '',
      weight: '',
      quantity: '',
    },
  ];

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (
      !lastRow ||
      !lastRow.material_type ||
      !lastRow.category ||
      !lastRow.sub_category ||
      !lastRow.product_description ||
      !lastRow.purity ||
      !lastRow.weight ||
      !lastRow.quantity
    ) {
      toast.error('Please fill all fields before adding a new row.');
      return;
    }

    const newRow = {
      id: Date.now(),
      material_type: '',
      category: '',
      sub_category: '',
      product_description: '',
      purity: '',
      weight: '',
      quantity: '',
    };

    edit.update({ item_details: [...rows, newRow] });
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      const updated = rows.filter((r: any) => r.id !== id);
      edit.update({ item_details: updated });
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    const currentRows = edit.getValue('item_details') || [];

    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        material_type: '',
        category: '',
        sub_category: '',
        product_description: '',
        purity: '',
        weight: '',
        quantity: '',
        [field]: value,
      };
      updatedRows = [...currentRows, newRow];
    } else {
      updatedRows = currentRows.map((r: any) =>
        r.id === id ? { ...r, [field]: value } : r
      );
    }

    edit.update({ item_details: updatedRows });
  };

  return (
    <Grid width={'100%'} pb={2} sx={{ ...formLayoutStyle, border: 'none' }}>
      <Grid container sx={tableColumnStyle}>
        <Grid sx={columnCellStyle} size={0.9}>
          S.No
        </Grid>
        <Grid sx={columnCellStyle} size={1.6}>
          Material Type
        </Grid>
        <Grid sx={ columnCellStyle} size={1.6}>
          Category
        </Grid>
        <Grid sx={ columnCellStyle} size={1.6}>
          Sub Category
        </Grid>
        <Grid sx={ columnCellStyle} size={2.5}>
          Product Description
        </Grid>
        <Grid sx={ columnCellStyle} size={0.8}>
          Purity
        </Grid>
        <Grid sx={ columnCellStyle} size={1}>
          Weight
        </Grid>
        <Grid sx={ columnCellStyle} size={1.2}>
          Quantity
        </Grid>
        <Grid sx={{ ...columnCellStyle, border: 'none' }} size={0.6}>
          Action
        </Grid>
      </Grid>

      {(rows.length > 0 ? rows : defaultRow).map((row: any, index: number) => (
        <Grid container sx={tableRowStyle} key={row.id}>
          <Grid size={0.9} sx={{ ...columnCellStyle, fontWeight: 500 }}>
            {index + 1}
          </Grid>
          <Grid
            size={1.6}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MUHSelectBoxComponent
              placeholderText="Material Type"
              value={row.material_type}
              isReadOnly={type === 'view'}
              onChange={(e: any) =>
                handleInputChange(row.id, 'material_type', e.target.value)
              }
              selectItems={BranchType}
              {...tableSelectBoxProps}
              isCheckbox={false}
              borderColor={'transparent'}
              focusBorderColor={'transparent'}
              ishover={false}
            />
          </Grid>
          <Grid
            size={1.6}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MUHSelectBoxComponent
              placeholderText="Category"
              isReadOnly={type === 'view'}
              value={row.category}
              onChange={(e: any) =>
                handleInputChange(row.id, 'category', e.target.value)
              }
              selectItems={BranchType}
              {...tableSelectBoxProps}
              isCheckbox={false}
              borderColor={'transparent'}
              focusBorderColor={'transparent'}
              ishover={false}
            />
          </Grid>
          <Grid
            size={1.6}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MUHSelectBoxComponent
              placeholderText="Sub Category"
              value={row.sub_category}
              isReadOnly={type === 'view'}
              onChange={(e: any) =>
                handleInputChange(row.id, 'sub_category', e.target.value)
              }
              selectItems={BranchType}
              {...tableSelectBoxProps}
              isCheckbox={false}
              borderColor={'transparent'}
              focusBorderColor={'transparent'}
              ishover={false}
            />
          </Grid>
          <Grid
            size={2.5}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextInput
            
              placeholderText="Enter Product Description"
              value={row.product_description}
              onChange={(e: any) =>
                handleInputChange(row.id, 'product_description', e.target.value)
              }
              isReadOnly={false}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={0.8}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextInput
              placeholderText="Purity"
              value={row.purity}
              onChange={(e: any) =>
                handleInputChange(row.id, 'purity', e.target.value)
              }
              isReadOnly={false}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextInput
              placeholderText="Weight"
              value={row.weight}
              onChange={(e: any) =>
                handleInputChange(row.id, 'weight', e.target.value)
              }
              isReadOnly={false}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={1.2}
            sx={{
              borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextInput
              placeholderText="Quantity"
              value={row.quantity}
              onChange={(e: any) =>
                handleInputChange(row.id, 'quantity', e.target.value)
              }
              isReadOnly={false}
              {...tableTextInputProps}
            />
          </Grid>
          <Grid
            size={0.6}
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
              <IconButton onClick={() => handleDeleteRow(row.id)}>
                <Delete sx={{ color: theme.Colors.primary }} />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
export default QuotationDetails;
