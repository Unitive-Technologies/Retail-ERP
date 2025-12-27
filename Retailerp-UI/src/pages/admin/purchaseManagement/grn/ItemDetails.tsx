import { useTheme, IconButton, Typography, Box } from '@mui/material';

import { Add, Delete } from '@mui/icons-material';

import {
  TextInput,
  DialogComp,
  AutoSearchSelectWithLabel,
} from '@components/index';
import MUHTextArea from '@components/MUHTextArea';
import FormAction from '@components/ProjectCommon/FormAction';

import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
  tableTextInputProps,
} from '@components/CommonStyles';

import toast from 'react-hot-toast';

import Grid from '@mui/material/Grid2';

import { PinActionIcon, PinnedIcon } from '@assets/Images';
import { useState, useEffect } from 'react';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

type Props = {
  edit: any;
};

const ItemDetails = ({ edit }: Props) => {
  const theme = useTheme();
  const [pinnedRows, setPinnedRows] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [comments, setComments] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<{
    materialTypes: any[];
    categories: Record<number, any[]>;
    subcategories: Record<number, any[]>;
  }>({
    materialTypes: [],
    categories: {},
    subcategories: {},
  });

  const rows = edit?.getValue('invoice_settings') || [];

  // Generate ref_no based on grn_no and row index
  const generateRefNo = (rowIndex: number): string => {
    const grnNo = edit?.getValue('grn_no') || '';
    if (!grnNo) return '';
    // Format row number with leading zero (01, 02, 03, etc.)
    const rowNumber = String(rowIndex + 1).padStart(2, '0');
    return `${grnNo}/${rowNumber}`;
  };

  // Helper function to format currency (remove ₹ and commas)
  const removeCurrencyFormat = (value: string): string => {
    if (!value) return '';
    return value.replace(/₹/g, '').replace(/,/g, '').trim();
  };

  // Helper function to format currency with ₹ symbol and commas
  const formatCurrency = (value: string | number): string => {
    if (!value && value !== 0) return '';
    const numValue =
      typeof value === 'string'
        ? parseFloat(removeCurrencyFormat(value))
        : value;
    if (isNaN(numValue)) return '';

    // Format with Indian number system with 3 decimal places
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(numValue);

    return `₹${formatted}`;
  };

  // Helper function to format material price with ₹ symbol and 3 decimal places
  const formatMaterialPrice = (value: string | number): string => {
    return formatCurrency(value);
  };

  const mapToOption = (arr: any[], labelKey: string, valueKey: string) =>
    arr?.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    })) || [];

  // Fetch Material Types on mount
  useEffect(() => {
    const fetchMaterialTypes = async () => {
      try {
        const materialTypesRes: any =
          await DropDownServiceAll.getMaterialTypes();
        const materialTypes = mapToOption(
          materialTypesRes?.data?.data?.materialTypes || [],
          'material_type',
          'id'
        );
        setDropdownData((prev) => ({
          ...prev,
          materialTypes,
        }));
      } catch (err) {
        console.error('Error fetching material types', err);
      }
    };
    fetchMaterialTypes();
  }, []);

  // Update ref_no for all rows when grn_no changes
  useEffect(() => {
    const grnNo = edit?.getValue('grn_no') || '';
    const currentRows = edit?.getValue('invoice_settings') || [];

    if (grnNo && currentRows.length > 0) {
      // Check if any row needs ref_no update
      const needsUpdate = currentRows.some((row: any, index: number) => {
        const expectedRefNo = generateRefNo(index);
        return row.ref_no !== expectedRefNo;
      });

      if (needsUpdate) {
        const updatedRows = currentRows.map((row: any, index: number) => ({
          ...row,
          ref_no: generateRefNo(index),
        }));
        edit.update({ invoice_settings: updatedRows });
      }
    }
  }, [edit?.getValue('grn_no')]);

  // Fetch categories and subcategories for existing rows (e.g., in edit mode)
  useEffect(() => {
    const currentRows = edit?.getValue('invoice_settings') || [];
    const fetchRowDependencies = async () => {
      const materialTypeIds = new Set<number>();
      const categoryIds = new Set<number>();
      // Collect unique material type IDs and category IDs from existing rows
      currentRows.forEach((row: any) => {
        const materialTypeId = row.material_type?.value || row.material_type;
        const categoryId = row.category?.value || row.category;
        if (materialTypeId && !dropdownData.categories[materialTypeId]) {
          materialTypeIds.add(materialTypeId);
        }
        if (categoryId && !dropdownData.subcategories[categoryId]) {
          categoryIds.add(categoryId);
        }
      });

      // Fetch categories for all unique material types
      const categoryPromises = Array.from(materialTypeIds).map(
        async (materialTypeId) => {
          try {
            const res: any = await DropDownServiceAll.getCategories({
              material_type_id: materialTypeId,
            });
            const categories = mapToOption(
              res?.data?.data?.categories || [],
              'category_name',
              'id'
            );
            return { materialTypeId, categories };
          } catch (err) {
            console.error(
              `Error fetching categories for material type ${materialTypeId}`,
              err
            );
            return { materialTypeId, categories: [] };
          }
        }
      );

      // Fetch subcategories for all unique categories
      const subcategoryPromises = Array.from(categoryIds).map(
        async (categoryId) => {
          try {
            const res: any = await DropDownServiceAll.getSubcategories({
              category_id: categoryId,
            });
            const subcategories = mapToOption(
              res?.data?.data?.subcategories || [],
              'subcategory_name',
              'id'
            );
            return { categoryId, subcategories };
          } catch (err) {
            console.error(
              `Error fetching subcategories for category ${categoryId}`,
              err
            );
            return { categoryId, subcategories: [] };
          }
        }
      );

      // Wait for all requests to complete
      const [categoryResults, subcategoryResults] = await Promise.all([
        Promise.all(categoryPromises),
        Promise.all(subcategoryPromises),
      ]);

      // Update dropdown data with fetched categories and subcategories
      setDropdownData((prev: any) => {
        const updatedCategories = { ...prev.categories };
        categoryResults.forEach(({ materialTypeId, categories }) => {
          updatedCategories[materialTypeId] = categories;
        });

        const updatedSubcategories = { ...prev.subcategories };
        subcategoryResults.forEach(({ categoryId, subcategories }) => {
          updatedSubcategories[categoryId] = subcategories;
        });

        return {
          ...prev,
          categories: updatedCategories,
          subcategories: updatedSubcategories,
        };
      });
    };

    if (currentRows.length > 0) {
      fetchRowDependencies();
    }
  }, [edit?.getValue('invoice_settings')?.length]);

  // Handle Material Type Change - Fetch Categories
  const handleMaterialTypeChange = async (rowId: number, value: any) => {
    // Update all three fields in a single operation
    const currentRows = edit.getValue('invoice_settings') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === rowId);

    if (rowIndex !== -1) {
      const updatedRows = currentRows.map((r: any) => {
        if (r.id === rowId) {
          return {
            ...r,
            material_type: value,
            category: '',
            sub_category: '',
          };
        }
        return r;
      });
      edit.update({ invoice_settings: updatedRows });
    } else {
      // If row doesn't exist, use handleInputChange for the first field
      handleInputChange(rowId, 'material_type', value);
      // handleInputChange(rowId, 'category', '');
      // handleInputChange(rowId, 'sub_category', '');
    }

    if (value?.value) {
      try {
        const res: any = await DropDownServiceAll.getCategories({
          material_type_id: value.value,
        });
        const categories = mapToOption(
          res?.data?.data?.categories || [],
          'category_name',
          'id'
        );
        // Store categories for this specific material type
        setDropdownData((prev: any) => ({
          ...prev,
          categories: {
            ...prev.categories,
            [value.value]: categories,
          },
        }));
      } catch (err) {
        console.error('Error fetching categories', err);
        setDropdownData((prev: any) => ({
          ...prev,
          categories: {
            ...prev.categories,
            [value.value]: [],
          },
        }));
      }
    }
  };

  // Handle Category Change - Fetch Subcategories
  const handleCategoryChange = async (rowId: number, value: any) => {
    // Update category and clear subcategory in a single operation
    const currentRows = edit.getValue('invoice_settings') || [];
    const rowIndex = currentRows.findIndex((r: any) => r.id === rowId);

    if (rowIndex !== -1) {
      const updatedRows = currentRows.map((r: any) => {
        if (r.id === rowId) {
          return {
            ...r,
            category: value,
            sub_category: '',
          };
        }
        return r;
      });
      edit.update({ invoice_settings: updatedRows });
    } else {
      // If row doesn't exist, use handleInputChange for the first field
      handleInputChange(rowId, 'category', value);
    }

    if (value?.value) {
      try {
        const res: any = await DropDownServiceAll.getSubcategories({
          category_id: value.value,
        });
        const subcategories = mapToOption(
          res?.data?.data?.subcategories || [],
          'subcategory_name',
          'id'
        );
        // Store subcategories for this specific category
        setDropdownData((prev: any) => ({
          ...prev,
          subcategories: {
            ...prev.subcategories,
            [value.value]: subcategories,
          },
        }));
      } catch (err) {
        console.error('Error fetching subcategories', err);
        setDropdownData((prev: any) => ({
          ...prev,
          subcategories: {
            ...prev.subcategories,
            [value.value]: [],
          },
        }));
      }
    }
  };

  // Type options from PRODUCT_TYPE
  const typeOptions = [
    { label: 'Weight', value: 'Weight' },
    { label: 'Piece', value: 'Piece' },
  ];

  const purityOptions = [
    { label: '80% ', value: '80' },
    { label: '91.75%', value: '91.75' },
    { label: '92.5%', value: '92.5' },
    { label: '99.9% ', value: '99.9' },
    { label: '100%', value: '100' },
  ];

  const defaultRow = [
    {
      id: 1,
      ref_no: generateRefNo(0), // First row: GRN001/01
      material_type: '',
      purity: '',
      material_price: '',
      category: '',
      sub_category: '',
      type: '',
      quantity: '',
      gross_wt_in_g: '',
      stone_wt_in_g: '',
      others: '',
      others_wt_in_g: '',
      others_value: '',
      net_wt_in_g: '',
      Purchase_rate: '',
      Stone_rate: '',
      making_charge: '',
      rate_per_g: '',
      total_amount: '',
    },
  ];

  const regenerateRefNos = (rowsToUpdate: any[]) => {
    return rowsToUpdate.map((row: any, index: number) => ({
      ...row,
      ref_no: generateRefNo(index),
    }));
  };

  const handleAddRow = () => {
    const currentRows = edit.getValue('invoice_settings') || [];

    if (currentRows.length === 0) {
      edit.update({
        invoice_settings: [
          {
            id: Date.now(),
            ref_no: generateRefNo(0), // First row: GRN001/01
            material_type: '',
            purity: '',
            material_price: '',
            category: '',
            sub_category: '',
            type: '',
            quantity: '',
            gross_wt_in_g: '',
            stone_wt_in_g: '',
            others: '',
            others_wt_in_g: '',
            others_value: '',
            net_wt_in_g: '',
            Purchase_rate: '',
            Stone_rate: '',
            making_charge: '',
            rate_per_g: '',
            total_amount: '',
          },
        ],
      });

      return;
    }

    const lastRow = currentRows[currentRows.length - 1];

    if (
      !lastRow.material_type ||
      !lastRow.category ||
      !lastRow.sub_category ||
      !lastRow.purity ||
      !lastRow.type ||
      !lastRow.quantity ||
      !lastRow.gross_wt_in_g
      // !lastRow.Purchase_rate
    ) {
      toast.error('Please fill all required fields before adding a new row.');

      return;
    }

    const newRow = {
      id: Date.now(),
      ref_no: generateRefNo(currentRows.length), // Next row: GRN001/02, GRN001/03, etc.
      material_type: '',
      purity: '',
      material_price: '',
      category: '',
      sub_category: '',
      type: '',
      quantity: '',
      gross_wt_in_g: '',
      stone_wt_in_g: '',
      others: '',
      others_wt_in_g: '',
      others_value: '',
      net_wt_in_g: '',
      Purchase_rate: '',
      Stone_rate: '',
      making_charge: '',
      rate_per_g: '',
      total_amount: '',
    };

    const updatedRows = [...currentRows, newRow];
    const updatedWithRefNos = regenerateRefNos(updatedRows);
    edit.update({ invoice_settings: updatedWithRefNos });
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      const updated = rows.filter((r: any) => r.id !== id);
      const updatedWithRefNos = regenerateRefNos(updated);
      edit.update({ invoice_settings: updatedWithRefNos });
    }
  };

  // Check if category is Beads
  const isBeadsCategory = (row: any): boolean => {
    const materialType = row.material_type;
    // if (materialType) {
    //   const materialTypeLabel = materialType.label || '';
    //   // const materialTypeValue = materialType.value || materialType;
    //   if (materialTypeLabel.toLowerCase() === 'others') {
    //     return true;
    //   }
    // }

    return false;
  };

  // Calculate Net Weight in grams (same for all types)
  const calculateNetWeight = (row: any) => {
    const grossWt = parseFloat(row.gross_wt_in_g) || 0;
    const stoneWt = parseFloat(row.stone_wt_in_g) || 0;
    const othersWt = parseFloat(row.others_wt_in_g) || 0;
    const netWt = grossWt - stoneWt - othersWt;
    return netWt >= 0 ? netWt.toFixed(3) : '0.000';
  };

  // Calculate Making Charge based on type
  const calculateMakingCharge = (row: any) => {
    const type = row.type?.value || row.type || '';
    const netWt = parseFloat(row.net_wt_in_g) || 0;
    const purchaseRate =
      parseFloat(removeCurrencyFormat(row.Purchase_rate || '')) || 0;
    const stoneRate =
      parseFloat(removeCurrencyFormat(row.Stone_rate || '')) || 0;
    const materialPrice =
      parseFloat(removeCurrencyFormat(row.material_price || '')) || 0;

    if (type === 'Piece' || isBeadsCategory(row)) {
      return row.making_charge || '';
    }

    if (type === 'Weight' && netWt > 0) {
      const calculated = (purchaseRate + stoneRate) / netWt - materialPrice;
      return calculated >= 0 ? calculated.toFixed(3) : '0.000';
    }

    return row.making_charge || '';
  };

  // Calculate Rate Per Gram
  const calculateRatePerGram = (row: any) => {
    const makingCharge =
      parseFloat(removeCurrencyFormat(row.making_charge || '')) || 0;
    const materialPrice =
      parseFloat(removeCurrencyFormat(row.material_price || '')) || 0;
    const ratePerG = makingCharge + materialPrice;
    return ratePerG >= 0 ? ratePerG.toFixed(3) : '0.000';
  };

  // Calculate Total Amount based on type
  const calculateTotalAmount = (row: any) => {
    const type = row.type?.value || row.type || '';
    const ratePerG =
      parseFloat(removeCurrencyFormat(row.rate_per_g || '')) || 0;
    const netWt = parseFloat(row.net_wt_in_g) || 0;
    const stoneRate =
      parseFloat(removeCurrencyFormat(row.Stone_rate || '')) || 0;

    if (type === 'Piece' || isBeadsCategory(row)) {
      const total = ratePerG * netWt;
      return total >= 0 ? total.toFixed(3) : '0.000';
    } else {
      const total = ratePerG * netWt + stoneRate;
      return total >= 0 ? total.toFixed(3) : '0.000';
    }
  };

  const calculateRowFields = (row: any, changedField?: string) => {
    const updatedRow = { ...row };
    const type = updatedRow.type?.value || updatedRow.type || '';

    // Always calculate net_wt_in_g first
    updatedRow.net_wt_in_g = calculateNetWeight(updatedRow);

    if (type === 'Piece' || isBeadsCategory(updatedRow)) {
      if (changedField !== 'making_charge' && updatedRow.making_charge) {
        const makingChargeStr = String(updatedRow.making_charge);
        if (!makingChargeStr.includes('₹') && !makingChargeStr.includes(',')) {
          updatedRow.making_charge = formatCurrency(updatedRow.making_charge);
        }
      }
    } else {
      const makingChargeValue = calculateMakingCharge(updatedRow);
      updatedRow.making_charge = formatCurrency(makingChargeValue);
    }

    // Calculate rate_per_g and format it
    const ratePerGValue = calculateRatePerGram(updatedRow);
    updatedRow.rate_per_g = formatCurrency(ratePerGValue);

    // Calculate total_amount and format it
    const totalAmountValue = calculateTotalAmount(updatedRow);
    updatedRow.total_amount = formatCurrency(totalAmountValue);

    return updatedRow;
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    const currentRows = edit.getValue('invoice_settings') || [];
    console.log(currentRows, 'currentRows------');

    const rowIndex = currentRows.findIndex((r: any) => r.id === id);

    let updatedRows;

    if (rowIndex === -1) {
      const newRow = {
        id,
        ref_no: generateRefNo(currentRows.length), // Generate ref_no for new row
        material_type: '',
        purity: '',
        material_price: '',
        category: '',
        sub_category: '',
        type: '',
        quantity: '',
        gross_wt_in_g: '',
        stone_wt_in_g: '',
        others: '',
        others_wt_in_g: '',
        others_value: '',
        net_wt_in_g: '',
        Purchase_rate: '',
        Stone_rate: '',
        making_charge: '',
        rate_per_g: '',
        total_amount: '',
        [field]: value,
      };

      // Recalculate all fields if any calculation trigger field changed
      const calculationTriggerFields = [
        'gross_wt_in_g',
        'stone_wt_in_g',
        'others_wt_in_g',
        'Purchase_rate',
        'Stone_rate',
        'making_charge',
        'material_price',
        'type',
        'category',
      ];

      if (calculationTriggerFields.includes(field)) {
        const calculatedRow = calculateRowFields(newRow, field);
        updatedRows = [...currentRows, calculatedRow];
      } else {
        updatedRows = [...currentRows, newRow];
      }
    } else {
      updatedRows = currentRows.map((r: any) => {
        if (r.id === id) {
          const updatedRow = { ...r, [field]: value };

          // Recalculate all fields if any calculation trigger field changed
          const calculationTriggerFields = [
            'gross_wt_in_g',
            'stone_wt_in_g',
            'others_wt_in_g',
            'Purchase_rate',
            'Stone_rate',
            'making_charge',
            'material_price',
            'type',
            'category',
          ];

          if (calculationTriggerFields.includes(field)) {
            return calculateRowFields(updatedRow, field);
          }

          return updatedRow;
        }
        return r;
      });
    }

    edit.update({ invoice_settings: updatedRows });
  };

  const calculateTotals = () => {
    const currentRows = edit.getValue('invoice_settings') || [];

    const totals = currentRows.reduce(
      (acc: any, row: any) => {
        acc.quantity += parseFloat(row.quantity) || 0;
        acc.grossWt += parseFloat(row.gross_wt_in_g) || 0;
        acc.stoneWt += parseFloat(row.stone_wt_in_g) || 0;
        acc.othersWt += parseFloat(row.others_wt_in_g) || 0;
        acc.netWt += parseFloat(row.net_wt_in_g) || 0;
        // Parse formatted currency value
        acc.totalAmount +=
          parseFloat(removeCurrencyFormat(row.total_amount || '')) || 0;

        return acc;
      },
      {
        quantity: 0,
        grossWt: 0,
        stoneWt: 0,
        othersWt: 0,
        netWt: 0,
        totalAmount: 0,
      }
    );

    return totals;
  };

  const totals = calculateTotals();

  const handlePinClick = (rowId: number) => {
    setSelectedRowId(rowId);

    const row = rows.find((r: any) => r.id === rowId);
    setComments(row?.comments || '');
    setDialogOpen(true);

    setPinnedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRowId(null);
    setComments('');
  };

  const handleSaveComments = () => {
    if (selectedRowId) {
      const currentRows = edit.getValue('invoice_settings') || [];
      const updatedRows = currentRows.map((r: any) =>
        r.id === selectedRowId ? { ...r, comments } : r
      );
      edit.update({ invoice_settings: updatedRows });
      toast.success('Comments saved successfully');
    }
    handleDialogClose();
  };

  const renderDialogContent = () => {
    return (
      <Grid container size={12} sx={{ p: 1.5 }}>
        <Grid size={3}>
          {/* Label */}
          <Typography
            style={{
              fontFamily: theme.fontFamily.roboto,
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            Enter Comments
          </Typography>
        </Grid>
        <Grid size={9}>
          {/* Textarea */}
          <MUHTextArea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            minRows={7}
            maxRows={10}
          />
        </Grid>
      </Grid>
    );
  };

  const renderDialogAction = () => (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <FormAction
        handleCreate={handleSaveComments}
        handleCancel={handleDialogClose}
        firstBtntxt="Save"
        secondBtntx="Cancel"
      />
    </Box>
  );

  return (
    <Grid>
      <Grid
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          display: 'block',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.Colors.grayWhiteDim} transparent`,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.Colors.grayWhiteDim,
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme.Colors.dustyGray || '#999',
            },
          },
        }}
      >
        {/* TABLE HEADER */}

        <Grid container sx={{ ...tableColumnStyle, width: 'max-content' }}>
          <Grid sx={{ ...columnCellStyle }} width={'50px'}>
            S.No
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Ref No.
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Material Type
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Purity
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Material Price/g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Category
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Sub Category
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Type
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Quantity
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Gross Wt in g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Stone Wt in g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Others
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Others Wt in g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Others Value
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Net in g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Purchase Rate
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Stone Rate
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Making Charge
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Rate Per g
          </Grid>

          <Grid sx={columnCellStyle} width={'120px'}>
            Total Amount
          </Grid>

          <Grid sx={{ ...columnCellStyle, border: 'none' }} width={'120px'}>
            Action
          </Grid>
        </Grid>

        {/* TABLE ROWS */}

        {(rows.length > 0 ? rows : defaultRow).map(
          (row: any, index: number) => (
            <Grid
              container
              sx={{
                ...tableRowStyle,
                flexWrap: 'nowrap',
                width: 'max-content',
              }}
              key={row.id}
            >
              <Grid width={'50px'} sx={{ ...columnCellStyle, fontWeight: 500 }}>
                {index + 1}
              </Grid>

              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <TextInput
                  value={row.ref_no}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    // Allow alphanumeric characters, spaces, hyphens, underscores, and slashes
                    if (value === '' || /^[a-zA-Z0-9\s\-_/]*$/.test(value)) {
                      handleInputChange(row.id, 'ref_no', value);
                    }
                  }}
                  disabled={true}
                  {...tableTextInputProps}
                />
              </Grid>

              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <AutoSearchSelectWithLabel
                  options={dropdownData.materialTypes}
                  value={row.material_type}
                  onChange={(_e: any, value: any) =>
                    handleMaterialTypeChange(row.id, value)
                  }
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                />
              </Grid>

              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <AutoSearchSelectWithLabel
                  options={purityOptions}
                  value={row.purity || ''}
                  onChange={(_e: any, value: any) =>
                    handleInputChange(row.id, 'purity', value)
                  }
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <TextInput
                  value={row.material_price || ''}
                  onChange={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'material_price', value);
                    }
                  }}
                  onFocus={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, material_price: value };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  onBlur={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const formatted = formatMaterialPrice(value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, material_price: formatted };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <AutoSearchSelectWithLabel
                  options={
                    row.material_type?.value
                      ? dropdownData.categories[row.material_type.value] || []
                      : []
                  }
                  value={row?.category}
                  onChange={(_e: any, value: any) =>
                    handleCategoryChange(row.id, value)
                  }
                  isReadOnly={!row.material_type}
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <AutoSearchSelectWithLabel
                  options={
                    row.category?.value
                      ? dropdownData.subcategories[row.category.value] || []
                      : []
                  }
                  value={row?.sub_category}
                  onChange={(_e: any, value: any) =>
                    handleInputChange(row.id, 'sub_category', value)
                  }
                  isReadOnly={!row.category}
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{
                  borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                  // padding: 2,
                }}
              >
                <AutoSearchSelectWithLabel
                  options={typeOptions}
                  value={row?.type}
                  onChange={(_e: any, value: any) =>
                    handleInputChange(row.id, 'type', value)
                  }
                  searchBoxStyle={{
                    height: '60px',
                    borderRadius: '4px',
                    border: 'none',
                  }}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.quantity || row.Quantity || ''}
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
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.gross_wt_in_g}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'gross_wt_in_g', value);
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.stone_wt_in_g}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'stone_wt_in_g', value);
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.others}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    // if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    handleInputChange(row.id, 'others', value);
                    // }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.others_wt_in_g}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'others_wt_in_g', value);
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.others_value}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'others_value', value);
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.net_wt_in_g}
                  disabled={true}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.Purchase_rate || ''}
                  onChange={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'Purchase_rate', value);
                    }
                  }}
                  onFocus={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, Purchase_rate: value };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  onBlur={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const formatted = formatCurrency(value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, Purchase_rate: formatted };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.Stone_rate || ''}
                  onChange={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'Stone_rate', value);
                    }
                  }}
                  onFocus={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, Stone_rate: value };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  onBlur={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const formatted = formatCurrency(value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, Stone_rate: formatted };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={row.making_charge || ''}
                  onChange={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(row.id, 'making_charge', value);
                    }
                  }}
                  onFocus={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, making_charge: value };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  onBlur={(e: any) => {
                    const value = removeCurrencyFormat(e.target.value);
                    const formatted = formatCurrency(value);
                    const currentRows = edit.getValue('invoice_settings') || [];
                    const rowIndex = currentRows.findIndex(
                      (r: any) => r.id === row.id
                    );
                    if (rowIndex !== -1) {
                      const updatedRows = currentRows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, making_charge: formatted };
                        }
                        return r;
                      });
                      edit.update({ invoice_settings: updatedRows });
                    }
                  }}
                  disabled={(row.type?.value || row.type) === 'Weight'}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={formatCurrency(row.rate_per_g || '')}
                  disabled={true}
                  {...tableTextInputProps}
                />
              </Grid>
              <Grid
                width={'120px'}
                sx={{ borderRight: `1px solid ${theme.Colors.grayWhiteDim}` }}
              >
                <TextInput
                  value={formatCurrency(row.total_amount || '')}
                  disabled={true}
                  // backgroundColor={theme.Colors.grayWhiteDim}
                  {...tableTextInputProps}
                />
              </Grid>

              <Grid
                width={'120px'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: 0,
                  marginRight: 0,
                }}
              >
                {rows.length === 0 || rows.length - 1 === index ? (
                  <>
                    <IconButton
                      onClick={() => handlePinClick(row.id)}
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      {pinnedRows.has(row.id) ? (
                        <PinnedIcon />
                      ) : (
                        <PinActionIcon />
                      )}
                    </IconButton>
                    <IconButton onClick={handleAddRow} size="small">
                      <Add sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={() => handlePinClick(row.id)}
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      {pinnedRows.has(row.id) ? (
                        <PinnedIcon />
                      ) : (
                        <PinActionIcon />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteRow(row.id)}
                      size="small"
                    >
                      <Delete sx={{ color: theme.Colors.primary }} />
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>
          )
        )}

        {/* TOTAL ROW */}

        <Grid
          container
          sx={{
            ...tableRowStyle,
            flexWrap: 'nowrap',
            width: 'max-content',
            backgroundColor: '#F5F5F5',
            fontWeight: 600,
            paddingRight: 0,
            marginRight: 0,
          }}
        >
          <Grid width={'50px'}></Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'}></Grid>
          <Grid width={'120px'}></Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            Total
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {totals.quantity.toFixed(0)}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {totals.grossWt.toFixed(3)}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {totals.stoneWt.toFixed(3)}
          </Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {totals.othersWt.toFixed(3)}
          </Grid>

          <Grid width={'120px'}></Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {totals.netWt.toFixed(3)}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {/* Empty - Purchase Rate */}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {/* Empty - Stone Rate */}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {/* Empty - Making Charge */}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {/* Empty - Rate Per g */}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            ₹{totals.totalAmount.toFixed(3)}
          </Grid>

          <Grid width={'120px'} sx={columnCellStyle}>
            {/* Empty - Action */}
          </Grid>
        </Grid>
      </Grid>

      {dialogOpen && (
        <DialogComp
          open={dialogOpen}
          dialogTitle="COMMENTS"
          dialogTitleStyle={{
            fontFamily: theme.fontFamily.roboto,
            fontWeight: 600,
            fontSize: '16px',
          }}
          onClose={handleDialogClose}
          renderDialogContent={renderDialogContent}
          renderAction={renderDialogAction}
          dialogWidth={800}
          dialogHeight={400}
          dialogPadding="16px 20px"
          contentPadding="8px 20px"
          maxWidth="md"
        />
      )}
    </Grid>
  );
};

export default ItemDetails;
