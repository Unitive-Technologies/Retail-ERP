import { useTheme, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import {
  columnCellStyle,
  sectionContainerStyle,
  tableColumnStyle,
  tableRowStyle,
  tableSelectBoxProps,
} from '@components/CommonStyles';
import toast from 'react-hot-toast';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import React, { useEffect, useState } from 'react';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

type optionProps = {
  label: string;
  value: string | number;
};

type Props = {
  variantDetails: any[];
  setVariantDetails: any;
  type?: string | null;
};

const VarientDetailsSection = ({
  variantDetails,
  setVariantDetails,
  type,
}: Props) => {
  const theme = useTheme();
  const [variantTypeOptions, setVariantTypeOptions] = useState<optionProps[]>(
    []
  );
  const [variantValueMap, setVariantValueMap] = useState<
    Record<string, optionProps[]>
  >({});

  const rows = variantDetails || [];
  const defaultRow = [{ id: 1, varient_type: '', varient_value: [] }];

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res: any = await DropDownServiceAll.getAllVarients();

        if (
          res?.data?.statusCode === 200 &&
          res?.data?.data?.variants?.length
        ) {
          const variants = res?.data?.data?.variants;

          const typeOptions = variants.map((v: any) => ({
            label: v['Variant Type'],
            value: v['id'],
          }));

          const valueMap: Record<string, optionProps[]> = {};
          variants.forEach((v: any) => {
            valueMap[v['Variant Type']] = v.Values.map((val: any) => ({
              label: val.value,
              value: val.id,
            }));
          });

          setVariantTypeOptions(typeOptions);
          setVariantValueMap(valueMap);
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
        toast.error('Failed to load variant types');
      }
    };

    fetchVariants();
  }, []);

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (!lastRow || !lastRow.varient_type || !lastRow.varient_value?.length) {
      toast.error('Please fill all fields before adding a new row.');
      return;
    }

    const newRow = {
      id: Date.now(),
      varient_type: '',
      varient_value: [],
    };

    setVariantDetails([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      setVariantDetails(rows.filter((r) => r.id !== id));
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    setVariantDetails((prev: any[]) => {
      const rowIndex = prev.findIndex((r) => r.id === id);

      const normalizedValue =
        field === 'varient_value'
          ? Array.isArray(value)
            ? value
            : [value]
          : value;

      // If no row exists, create a new one
      if (rowIndex === -1) {
        const newRow = {
          id,
          varient_type: field === 'varient_type' ? normalizedValue : '',
          varient_value: field === 'varient_value' ? normalizedValue : [],
        };

        return [...prev, newRow];
      }

      // Otherwise, update existing row
      const updated = prev.map((r, index) => {
        if (index !== rowIndex) return r;

        // Reset variant_value when type changes
        if (field === 'varient_type') {
          return { ...r, varient_type: normalizedValue, varient_value: [] };
        }

        return { ...r, [field]: normalizedValue };
      });

      return updated;
    });
  };
console.log('inside varieudijdjjs00---')
  return (
    <Grid size={12}>
      <FormSectionHeader title="Variant Details" />
      <Grid container sx={sectionContainerStyle}>
        <Grid container sx={tableColumnStyle}>
          <Grid sx={columnCellStyle} size={1.5}>
            S.No
          </Grid>
          <Grid sx={columnCellStyle} size={4.5}>
            Variant Type
          </Grid>
          <Grid sx={columnCellStyle} size={4.5}>
            Variant Value
          </Grid>
          <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1.5}>
            Action
          </Grid>
        </Grid>

        {(rows.length > 0 ? rows : defaultRow).map((row, index) => {
          const valueOptions = variantValueMap[row.varient_type?.label] || [];
          return (
            <Grid container sx={tableRowStyle} key={row.id}>
              <Grid size={1.5} sx={{ ...columnCellStyle, fontWeight: 500 }}>
                {index + 1}
              </Grid>

              <Grid
                size={4.5}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <AutoSearchSelectWithLabel
                  options={variantTypeOptions}
                  isReadOnly={type === 'view'}
                  value={row.varient_type}
                  onChange={(e, val: any) =>
                    handleInputChange(row.id, 'varient_type', val)
                  }
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                  placeholder="Select"
                  placeholdrStyle={{ color: theme.Colors.grayDim }}
                />
              </Grid>

              <Grid
                size={4.5}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <MUHSelectBoxComponent
                  multiple={true}
                  isSearch={true}
                  disabled={type === 'view'}
                  placeholderText="Select"
                  value={row.varient_value}
                  onChange={(e: any) =>
                    handleInputChange(row.id, 'varient_value', e.target.value)
                  }
                  selectItems={valueOptions}
                  {...tableSelectBoxProps}
                  isCheckbox={true}
                />
              </Grid>

              <Grid
                size={1.5}
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
          );
        })}
      </Grid>
    </Grid>
  );
};

export default React.memo(VarientDetailsSection);
