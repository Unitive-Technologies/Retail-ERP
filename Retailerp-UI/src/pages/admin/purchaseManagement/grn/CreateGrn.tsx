import { commonTextInputProps } from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  DialogComp,
  MUHTable,
  styles,
  TextInput,
  TotalSummary,
} from '@components/index';

import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import {
  OrderNameOptions,
  purchaseOrderOptions,
  selectDialogData,
} from '@constants/DummyData';
import { useEdit } from '@hooks/useEdit';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/system';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import { EditIcon, GoldenPlanImages, LocationIcon } from '@assets/Images';
import ItemDetails from './ItemDetails';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { useLocation, useNavigate } from 'react-router-dom';
import { GrnService } from '@services/GrnService';
import { HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Loader } from '@components/index';

// StatusCard Component
const StatusCard = ({ title, children, showEditIcon = false, onEdit }: any) => {
  return (
    <Box
      sx={{
        border: '1px solid #E4E4E4',
        borderRadius: '8px',
        p: 2,
        position: 'relative',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '18px',
            color: '#333843',
          }}
        >
          {title}
        </Typography>
        {showEditIcon && (
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              color: '#B45C6B',
              backgroundColor: '#FDEDEF',
              '&:hover': { backgroundColor: '#F8DDE1' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {children}
    </Box>
  );
};
// export const VendorList = [
//   {
//     value: 1,
//     label: 'Golden Hub Pvt., Ltd.,',
//   },
//   {
//     value: 2,
//     label: 'Shiva Silver Suppliers',
//   },
//   {
//     value: 3,
//     label: 'Jai Shree Jewels',
//   },
//   {
//     value: 4,
//     label: 'Kalash Gold & Silver Mart',
//   },
//   {
//     value: 5,
//     label: 'Sai Precious Metals',
//   },
// ];
const CreateGrn = () => {
  const location = useLocation();
  const navigateTo = useNavigate();
  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const paramRowId = Number(params.get('rowId'));
  const theme = useTheme();
  const [rowData, setRowData] = useState<any>({});
  const [selectCategory, setSelectCategory] = useState({ open: false });
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [chosenCategories, setChosenCategories] = useState<any[]>([]);
  const [vendorOptions, setVendorOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState<any>({
    materialTypes: [],
    categories: [],
    subcategories: [],
  });

  // Define purity and type options
  const purityOptions = [
    { label: '92.5%', value: '92.5' },
    { label: '99.9%', value: '99.9' },
    { label: '91.75%', value: '91.75' },
    { label: '100%', value: '100' },
  ];

  const typeOptions = [
    { label: 'Weight', value: 'Weight' },
    { label: 'Piece', value: 'Piece' },
  ];

  console.log(type, 'type-----');
  const UserInitialValues: any = {
    grn_no: '',
    grn_date: null,
    purchase_order: '',
    purchase_order_date: null,
    vendor_name: '',
    order_by: 'Super Admin',
    reference_id: '',
    remarks: '',
    sgst_rate: '0',
    cgst_rate: '0',
    discount_rate: '0',
    invoice_settings: [],
  };

  const edit = useEdit(UserInitialValues);

  // Validate main GRN fields
  const validateMainGrnFields = () => {
    const fieldErrors = {
      grn_no: !edit.allFilled('grn_no'),
      grn_date: !edit.getValue('grn_date'),
      vendor_name: !edit.getValue('vendor_name')?.value,
      // order_by: !edit.allFilled('order_by'),
    };
    console.log(fieldErrors, 'fieldErrors----');
    const hasErrors = Object.values(fieldErrors).some(Boolean);

    if (hasErrors) {
      toast.error('Please fill all required GRN fields.');
    }

    return !hasErrors;
  };

  // Validate Item Details
  const validateItemDetails = () => {
    const items = edit.getValue('invoice_settings') || [];

    if (items.length === 0) {
      toast.error('Please add at least one item detail.');
      return { isValid: false, validItems: [] };
    }

    const validItems: any[] = [];
    let allValid = true;

    items.forEach((item: any, index: number) => {
      // Check if item has required fields filled
      const hasRefNo = item.ref_no && item.ref_no.trim() !== '';
      const hasMaterialType = item.material_type?.value || item.material_type;
      const hasPurity = item.purity?.value || item.purity;
      const hasCategory = item.category?.value || item.category;
      const hasSubCategory = item.sub_category?.value || item.sub_category;
      const hasType = item.type?.value || item.type;
      const hasQuantity = item.quantity && parseFloat(item.quantity) > 0;
      const hasGrossWt =
        item.gross_wt_in_g && parseFloat(item.gross_wt_in_g) > 0;

      // Check if item is complete (has at least some data)
      const hasAnyData = hasMaterialType || hasCategory;

      if (hasAnyData) {
        // If item has some data, validate all required fields
        if (
          !hasRefNo ||
          !hasMaterialType ||
          !hasPurity ||
          !hasCategory ||
          !hasSubCategory ||
          !hasType ||
          !hasQuantity ||
          !hasGrossWt
        ) {
          toast.error(`Please fill all required fields in row ${index + 1}.`);
          allValid = false;
          return;
        }
        validItems.push(item);
      }
    });

    if (validItems.length === 0 && items.length > 0) {
      toast.error('Please fill at least one complete item detail.');
      allValid = false;
    }

    return { isValid: allValid, validItems };
  };

  const transformToApiFormat = (validItems: any[]) => {
    const totals = calculateTotals();

    const formatDate = (date: any) => {
      if (!date) return '';

      if (dayjs.isDayjs?.(date)) {
        return date.format('YYYY-MM-DD');
      }

      if (date && typeof date === 'object' && date.$d instanceof Date) {
        const dayjsDate = dayjs(date.$d);
        if (!dayjsDate.isValid()) return '';
        return dayjsDate.format('YYYY-MM-DD');
      }

      if (date instanceof Date) {
        const localDate = dayjs(date);
        if (!localDate.isValid()) return '';
        return localDate.format('YYYY-MM-DD');
      }

      if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        const parsed = dayjs(date);
        if (parsed.isValid()) {
          return parsed.format('YYYY-MM-DD');
        }
        return '';
      }

      return '';
    };

    // Helper function to remove currency formatting
    const removeCurrencyFormat = (value: string | number): number => {
      if (!value && value !== 0) return 0;
      const strValue =
        typeof value === 'string'
          ? value.replace(/₹/g, '').replace(/,/g, '').trim()
          : String(value);
      return parseFloat(strValue) || 0;
    };

    // Transform items
    const transformedItems = validItems.map((item: any) => {
      const purityValue = item.purity?.value || item.purity || '';
      // Clean purity value (remove trailing spaces)
      const cleanedPurity =
        typeof purityValue === 'string' ? purityValue.trim() : purityValue;

      return {
        ref_no: item.ref_no || '',
        material_type_id: item.material_type?.value || item.material_type || 0,
        purity: cleanedPurity,
        material_price_per_g: removeCurrencyFormat(item.material_price),
        category_id: item.category?.value || item.category || 0,
        subcategory_id: item.sub_category?.value || item.sub_category || 0,
        type: item.type?.value || item.type || '',
        quantity: parseFloat(item.quantity) || 0,
        gross_wt_in_g: parseFloat(item.gross_wt_in_g) || 0,
        stone_wt_in_g: parseFloat(item.stone_wt_in_g) || 0,
        others: item.others || '',
        others_wt_in_g: parseFloat(item.others_wt_in_g) || 0,
        others_value: parseFloat(item.others_value) || 0,
        net_wt_in_g: parseFloat(item.net_wt_in_g) || 0,
        rate_per_g: removeCurrencyFormat(item.rate_per_g),
        total_amount: removeCurrencyFormat(item.total_amount),
        purchase_rate: removeCurrencyFormat(item.Purchase_rate),
        stone_rate: removeCurrencyFormat(item.Stone_rate),
        making_charge: removeCurrencyFormat(item.making_charge),
        comments: item.comments || '',
      };
    });

    // Get grn_info_ids from items (assuming we need to extract IDs from items)
    const grnInfoIds = validItems
      .map((item: any) => item.id)
      .filter((id: any) => id && typeof id === 'number')
      .slice(0, 8); // Limit to 8 as per example

    const grnDateValue = edit.getValue('grn_date');
    console.log('grn_date raw value:', grnDateValue);
    const formattedDate = formatDate(grnDateValue);
    console.log('formatted date:', formattedDate);

    const body = {
      grn_no: edit.getValue('grn_no') || '',
      grn_date: formattedDate,
      po_id: 1, // Default to 1 if not provided
      vendor_id: edit.getValue('vendor_name')?.value || 0,
      order_by_user_id: 1, // Default, should be from user context
      reference_id: edit.getValue('reference_id') || '',
      gst_no: '33AADFT0604Q1Z6', // From StatusCard, should be configurable
      billing_address:
        '18, Vaniet Street George Town, Chennai, Tamil Nadu - 600 001.', // From StatusCard
      shipping_address:
        '18, Vaniet Street George Town, Chennai, Tamil Nadu - 600 001.', // From StatusCard
      subtotal_amount: totals.subTotal,
      sgst_percent: parseFloat(edit.getValue('sgst_rate')) || 0,
      cgst_percent: parseFloat(edit.getValue('cgst_rate')) || 0,
      discount_percent: parseFloat(edit.getValue('discount_rate')) || 0,
      total_amount: totals.totalAmount,
      remarks: edit.getValue('remarks') || '',
      status_id: 1, // Default status
      // grn_info_ids: grnInfoIds,
      items: transformedItems,
    };

    return body;
  };

  const handleCreate = async () => {
    // Validate main fields
    const isMainValid = validateMainGrnFields();
    console.log('isMainValid-----', isMainValid);
    if (!isMainValid) {
      return;
    }

    // Validate item details
    const { isValid, validItems } = validateItemDetails();
    console.log('isValid-----', isValid);

    if (!isValid) {
      return;
    }

    // Transform data to API format
    const body = transformToApiFormat(validItems);

    try {
      if (type === 'edit' && paramRowId) {
        // Update existing GRN
        const response: any = await GrnService.update(paramRowId, {
          data: body,
          successMessage: 'GRN updated successfully!',
          failureMessage: 'Failed to update GRN',
        });

        if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
          navigateTo('/admin/purchases/grn');
        }
      } else {
        // Create new GRN
        const response: any = await GrnService.create({
          data: body,
          successMessage: 'GRN created successfully!',
          failureMessage: 'Failed to create GRN',
        });

        if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
          navigateTo('/admin/purchases/grn');
        }
      }
    } catch (err) {
      console.error('Error creating/updating GRN:', err);
      toast.error('Something went wrong while saving GRN');
    }
  };
  const handleFormCancel = () => {
    navigateTo('/admin/purchases/grn');
  };
  const handleAdd = () => {
    const selected = dialogData.filter((r: any) =>
      (selectedRows as (string | number)[]).includes(r.id)
    );
    setChosenCategories(selected);

    setSelectCategory({ open: false });
  };
  const handleCancel = () => {
    setSelectCategory({ open: false });
  };
  const onClose = () => {
    setSelectCategory({ open: false });
  };

  const dialogColumn: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
        return (
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{row.material_type}</Typography>
          </Grid>
        );
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const row = params?.row || {};
        const src = row.image || GoldenPlanImages;
        return (
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={src}
              alt={row.material_type || 'material'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{row.category}</Typography>
          </Grid>
        );
      },
    },
  ];

  const renderDialogContent = () => {
    return (
      <>
        <Grid container size={'grow'}>
          <MUHTable
            columns={dialogColumn}
            rows={dialogData}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(model) => setSelectedRows(model)}
          />
        </Grid>
      </>
    );
  };

  const renderDialogAction = () => (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <FormAction
        handleCreate={handleAdd}
        handleCancel={handleCancel}
        firstBtntxt="Add"
      />
    </Box>
  );

  const fetchData = async () => {
    try {
      setDialogData(selectDialogData);
      const preselected = selectDialogData
        .filter((r: any) => r.isSelected)
        .map((r: any) => r.id as number | string);
      setSelectedRows(preselected);
    } catch {
    } finally {
    }
  };

  // Helper function to find option by ID
  const findOption = (options: any[], id: number | string) => {
    if (!id) return '';
    return options.find((opt) => opt.value == id) || '';
  };

  // Helper function to map array to options
  const mapToOption = (arr: any[], labelKey: string, valueKey: string) =>
    arr?.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    })) || [];

  // Fetch all dropdowns
  const fetchDropdowns = async () => {
    try {
      const [
        materialTypesRes,
        vendorsRes,
        categoriesRes,
        subcategoriesRes,
      ]: any = await Promise.all([
        DropDownServiceAll.getMaterialTypes(),
        DropDownServiceAll.getVendors(),
        DropDownServiceAll.getCategories(),
        DropDownServiceAll.getSubcategories(),
      ]);

      const materialTypes =
        (materialTypesRes?.data?.data?.materialTypes || []).map(
          (item: any) => ({
            label: item.material_type,
            value: item.id,
            material_price:
              item.material_price ?? item.material_price_per_g ?? '',
          })
        ) || [];

      const data = {
        materialTypes,
        vendors: (vendorsRes?.data?.data?.vendors || []).map((item: any) => ({
          label: item.vendor_name,
          value: item.id,
          state_id: item.state_id,
          vendor_code: item.vendor_code,
        })),
        categories: mapToOption(
          categoriesRes?.data?.data?.categories || [],
          'category_name',
          'id'
        ),
        subcategories: mapToOption(
          subcategoriesRes?.data?.data?.subcategories || [],
          'subcategory_name',
          'id'
        ),
      };

      setDropdownData(data);
      setVendorOptions(data.vendors);

      // If edit mode, fetch GRN data after dropdowns are loaded
      if (type !== 'create' && paramRowId) {
        await fetchGrnById(paramRowId, data);
      }
    } catch (err) {
      console.error('Error fetching dropdowns', err);
      toast.error('Failed to load dropdown data');
    }
  };

  // Fetch GRN by ID and populate form
  const fetchGrnById = async (id: number, dropdowns = dropdownData) => {
    try {
      setIsLoading(true);
      const response: any = await GrnService.getById(id);

      // Helper function to format currency
      const formatCurrency = (value: string | number): string => {
        if (!value && value !== 0) return '';
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return '';
        const formatted = new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numValue);
        return `₹${formatted}`;
      };

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const grnData = response.data.data;

        // Convert date string to Day.js object
        const grnDate = grnData.grn_date ? dayjs(grnData.grn_date) : null;

        // Find vendor option
        const vendorOption = findOption(dropdowns.vendors, grnData.vendor_id);

        // Get unique material type IDs from items to fetch their categories
        const uniqueMaterialTypeIds = [
          ...new Set(
            (grnData.items || []).map((item: any) => item.material_type_id)
          ),
        ].filter((id): id is number => typeof id === 'number' && id > 0);

        // Fetch categories for all material types used in items
        const categoryPromises = uniqueMaterialTypeIds.map(
          (materialTypeId: number) =>
            DropDownServiceAll.getCategories({
              material_type_id: materialTypeId,
            })
        );
        const categoryResponses: any = await Promise.all(categoryPromises);

        // Get unique category IDs from items to fetch their subcategories
        const uniqueCategoryIds = [
          ...new Set(
            (grnData.items || []).map((item: any) => item.category_id)
          ),
        ].filter((id): id is number => typeof id === 'number' && id > 0);

        // Fetch subcategories for all categories used in items
        const subcategoryPromises = uniqueCategoryIds.map(
          (categoryId: number) =>
            DropDownServiceAll.getSubcategories({ category_id: categoryId })
        );
        const subcategoryResponses: any =
          await Promise.all(subcategoryPromises);

        // Combine all categories and subcategories
        const allCategories: any[] = [];
        categoryResponses.forEach((res: any) => {
          const categories = mapToOption(
            res?.data?.data?.categories || [],
            'category_name',
            'id'
          );
          allCategories.push(...categories);
        });

        const allSubcategories: any[] = [];
        subcategoryResponses.forEach((res: any) => {
          const subcategories = mapToOption(
            res?.data?.data?.subcategories || [],
            'subcategory_name',
            'id'
          );
          allSubcategories.push(...subcategories);
        });

        // Update dropdown data with fetched categories and subcategories
        const updatedDropdowns = {
          ...dropdowns,
          categories: allCategories,
          subcategories: allSubcategories,
        };

        // Transform items to invoice_settings format
        const transformedItems = (grnData.items || []).map(
          (item: any, index: number) => {
            // Find material type, category, subcategory options
            const materialTypeOption = findOption(
              updatedDropdowns.materialTypes,
              item.material_type_id
            );
            const categoryOption = findOption(
              updatedDropdowns.categories,
              item.category_id
            );
            const subcategoryOption = findOption(
              updatedDropdowns.subcategories,
              item.subcategory_id
            );

            // Map purity - handle both string and object formats
            const purityValue = item.purity || '';
            const purityOption = purityOptions.find(
              (opt) =>
                opt.value === purityValue || opt.value === purityValue.trim()
            ) || { label: purityValue, value: purityValue };

            // Map type - handle both string and object formats
            const typeValue = item.type || '';
            const typeOption = typeOptions.find(
              (opt) => opt.value === typeValue
            ) || { label: typeValue, value: typeValue };

            return {
              id: item.id || index + 1,
              ref_no: item.ref_no || '',
              material_type: materialTypeOption,
              purity: purityOption,
              material_price: formatCurrency(item.material_price_per_g || 0),
              category: categoryOption,
              sub_category: subcategoryOption,
              type: typeOption,
              quantity: item.quantity?.toString() || '',
              gross_wt_in_g: item.gross_wt_in_g?.toString() || '',
              stone_wt_in_g: item.stone_wt_in_g?.toString() || '',
              others: item.others || '',
              others_wt_in_g: item.others_wt_in_g?.toString() || '',
              others_value: item.others_value?.toString() || '',
              net_wt_in_g: item.net_wt_in_g?.toString() || '',
              Purchase_rate: formatCurrency(item.purchase_rate || 0),
              Stone_rate: formatCurrency(item.stone_rate || 0),
              making_charge: formatCurrency(item.making_charge || 0),
              rate_per_g: formatCurrency(item.rate_per_g || 0),
              total_amount: formatCurrency(item.total_amount || 0),
              comments: item.comments || '',
            };
          }
        );

        // Map form data
        const mappedData = {
          grn_no: grnData.grn_no || '',
          grn_date: grnDate,
          purchase_order: grnData.po_id
            ? { label: `PO-${grnData.po_id}`, value: grnData.po_id }
            : '',
          purchase_order_date: null, // Not in API response
          vendor_name: vendorOption,
          order_by: 'Super Admin',
          reference_id: grnData.reference_id || '',
          remarks: grnData.remarks || '',
          sgst_rate: grnData.sgst_percent?.toString() || '0',
          cgst_rate: grnData.cgst_percent?.toString() || '0',
          discount_rate: grnData.discount_percent?.toString() || '0',
          invoice_settings: transformedItems,
        };

        edit.update(mappedData);

        // Update dropdown data state with fetched categories and subcategories
        setDropdownData(updatedDropdowns);
      }
    } catch (err) {
      console.error('Error fetching GRN by ID:', err);
      toast.error('Failed to fetch GRN details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrnCode = async () => {
    try {
      const response: any = await GrnService.getCode('GRN');
      if (
        response?.data?.statusCode === HTTP_STATUSES.OK &&
        response?.data?.data?.grn_no
      ) {
        edit.update({ grn_no: response.data.data.grn_no });
      }
    } catch (error) {
      console.error('Error fetching GRN code:', error);
    }
  };

  // Fetch Vendors dropdown (keep for backward compatibility)
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchDropdowns();
        if (type === 'create') {
          await fetchGrnCode();
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBillingAddress = () => {
    console.log('Edit billing address');
  };

  const handleEditShippingAddress = () => {
    console.log('Edit shipping address');
  };

  // Calculate totals from ItemDetails
  const calculateTotals = () => {
    const items = edit.getValue('invoice_settings') || [];
    // Helper to remove currency formatting
    const removeCurrencyFormat = (value: string | number): number => {
      if (!value && value !== 0) return 0;
      const strValue =
        typeof value === 'string'
          ? value.replace(/₹/g, '').replace(/,/g, '').trim()
          : String(value);
      return parseFloat(strValue) || 0;
    };

    const actualSubTotal = items.reduce((acc: number, item: any) => {
      return acc + removeCurrencyFormat(item.total_amount || '');
    }, 0);

    const sgstRate = parseFloat(edit.getValue('sgst_rate')) || 0;
    const cgstRate = parseFloat(edit.getValue('cgst_rate')) || 0;
    const roundOff = parseFloat(edit.getValue('discount_rate')) || 0;

    const sgstAmount = (actualSubTotal * sgstRate) / 100;
    const cgstAmount = (actualSubTotal * cgstRate) / 100;
    const discountAmount = roundOff;

    const totalAmount = actualSubTotal + sgstAmount + cgstAmount + roundOff;

    return {
      subTotal: actualSubTotal,
      sgstAmount,
      cgstAmount,
      discountAmount,
      totalAmount,
    };
  };

  const totals = calculateTotals();

  // Convert number to words function
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero Only';

    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ];
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    const convertHundreds = (n: number): string => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let result = '';
    const crores = Math.floor(num / 10000000);
    if (crores) {
      result += convertHundreds(crores) + 'Crore ';
      num %= 10000000;
    }

    const lakhs = Math.floor(num / 100000);
    if (lakhs) {
      result += convertHundreds(lakhs) + 'Lakh ';
      num %= 100000;
    }

    const thousandsNum = Math.floor(num / 1000);
    if (thousandsNum) {
      result += convertHundreds(thousandsNum) + 'Thousand ';
      num %= 1000;
    }

    if (num > 0) {
      result += convertHundreds(num);
    }

    return result.trim() + ' Only';
  };

  if (isLoading) {
    return <Loader />;
  }

  console.log('editt---', edit.edits);
  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={'CREATE GRN'}
          navigateUrl="/admin/purchases/grn"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
          showBackButton={false}
        />
        <Grid
          container
          // size="grow"
          flexDirection={'column'}
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            family={theme.fontFamily.roboto}
            size={16}
            padding="20px"
            weight={600}
            color={theme.Colors.black}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              // height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            GRN DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="GRN No"
                value={edit.getValue('grn_no')}
                onChange={
                  (e: any) => edit.update({ grn_no: e.target.value })
                  // handleValidatedChange(e, edit, 'grn_no', 'string')
                }
                disabled={true}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <MUHDatePickerComponent
                required
                labelText="GRN Date"
                value={edit.getValue('grn_date')}
                useNewIcon={true}
                handleChange={(newDate: any) =>
                  edit.update({ grn_date: newDate })
                }
                handleClear={() => edit.update({ grn_date: null })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                label="Purchase Order No"
                options={purchaseOrderOptions}
                value={edit.getValue('purchase_order')}
                onChange={(_e, value) => edit.update({ purchase_order: value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mt={'8px'} sx={styles.rightItem}>
              <MUHDatePickerComponent
                labelText="Purchase Order Date"
                value={edit.getValue('purchase_order_date')}
                useNewIcon={true}
                handleChange={(newDate: any) =>
                  edit.update({ purchase_order_date: newDate })
                }
                handleClear={() => edit.update({ purchase_order_date: null })}
              />
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Vendor ID"
                options={vendorOptions}
                value={edit.getValue('vendor_id')}
                onChange={(e, value) => edit.update({ vendor_id: value })}
              />
            </Grid> */}
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              {/* <TextInput
                inputLabel="Vendor Name"
                value={edit.getValue('vendor_name')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'vendor_name', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              /> */}
              <AutoSearchSelectWithLabel
                required
                label="Vendor Name"
                options={vendorOptions}
                value={edit.getValue('vendor_name')}
                onChange={(_e, value) => edit.update({ vendor_name: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Order By"
                value={edit.getValue('order_by')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'order_by', 'string')
                }
                disabled={true}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                {...commonTextInputProps}
                required={false}
                inputLabel="Reference ID"
                value={edit.getValue('reference_id')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'reference_id', 'string')
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            p: 2.5,
            border: '1px solid #E4E4E4',
            borderRadius: '8px',

            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          {/* GST No */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard title="GST No">
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#1A1C21',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  33AADFT0604Q1Z6
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1A1C21',
                  }}
                >
                  Registered Business - Regular Tamil Nadu
                </Typography>
              </Box>
            </StatusCard>
          </Grid>

          {/* Billing Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard
              title="Billing Address"
              showEditIcon={true}
              onEdit={handleEditBillingAddress}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mt: 2,
                }}
              >
                <LocationIcon />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    18, Vaniet Street George Town,
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                    }}
                  >
                    Chennai, Tamil Nadu - 600 001.
                  </Typography>
                </Box>
              </Box>
            </StatusCard>
          </Grid>

          {/* Shipping Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatusCard
              title="Shipping Address"
              showEditIcon={true}
              onEdit={handleEditShippingAddress}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  mt: 2,
                }}
              >
                <LocationIcon />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    18, Vaniet Street George Town,
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1A1C21',
                      fontWeight: 500,
                    }}
                  >
                    Chennai, Tamil Nadu - 600 001.
                  </Typography>
                </Box>
              </Box>
            </StatusCard>
          </Grid>
        </Grid>
        {/* </Grid> */}

        <Grid
          size={12}
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #E4E4E4',
            padding: 2,
            borderRadius: '8px 8px 0px 0px',
            borderBottom: 'none',
          }}
        >
          <Typography
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#000000',
            }}
          >
            ITEM DETAILS
          </Typography>
        </Grid>
        <Grid
          size={12}
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #E4E4E4',
            padding: 2,
            borderRadius: '0px 0px 8px 8px',
          }}
        >
          <ItemDetails edit={edit} />

          {/* Summary Section */}
          <TotalSummary
            totals={totals}
            numberToWords={numberToWords}
            remarks={edit.getValue('remarks') || ''}
            onRemarksChange={(value) => edit.update({ remarks: value })}
            sgstPercent={edit.getValue('sgst_rate') ?? '0'}
            cgstPercent={edit.getValue('cgst_rate') ?? '0'}
            discountPercent={edit.getValue('discount_rate') ?? '0'}
            vendorStateId={edit.getValue('vendor_name')?.state_id || null}
            onSgstPercentChange={(value) => {
              const currentCgst = edit.getValue('cgst_rate') ?? '0';
              const currentDiscount = edit.getValue('discount_rate') ?? '0';
              edit.update({
                sgst_rate: value,
                cgst_rate: currentCgst,
                discount_rate: currentDiscount,
              });
            }}
            onCgstPercentChange={(value) => {
              const currentSgst = edit.getValue('sgst_rate') ?? '0';
              const currentDiscount = edit.getValue('discount_rate') ?? '0';
              edit.update({
                sgst_rate: currentSgst,
                cgst_rate: value,
                discount_rate: currentDiscount,
              });
            }}
            onDiscountPercentChange={(value) => {
              const currentSgst = edit.getValue('sgst_rate') ?? '0';
              const currentCgst = edit.getValue('cgst_rate') ?? '0';
              edit.update({
                sgst_rate: currentSgst,
                cgst_rate: currentCgst,
                discount_rate: value,
              });
            }}
          />
          <Grid />
        </Grid>
        <FormAction
          // firstBtntxt="Create"
          firstBtntxt={type === 'edit' ? 'Update' : 'Create'}
          secondBtntx="Cancel"
          handleCancel={handleFormCancel}
          handleCreate={handleCreate}
          {...commonTextInputProps}
        />

        {selectCategory.open && (
          <DialogComp
            open={selectCategory.open}
            dialogTitle="SELECT CATEGORY"
            onClose={onClose}
            renderDialogContent={renderDialogContent}
            renderAction={renderDialogAction}
          />
        )}
      </Grid>
    </>
  );
};

export default CreateGrn;
