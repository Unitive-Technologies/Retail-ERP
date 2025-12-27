import { RowEditIcon, RowViewIcon, SettingIcon } from '@assets/Images';
import {
  AutoSearchSelectWithLabel,
  DualActionButton,
  MUHTable,
  styles,
} from '@components/index';
import MUHTextInput from '@components/MUHTextInput';
import PageHeader from '@components/PageHeader';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import { Box, Grid } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Preview from './Preview';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { ProductService } from '@services/ProductService';

const TagPrinting = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<any>({});
  const [productListData, setProductListData] = useState<object[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [openCreateModel, setOpenCreateModel] = useState<any>({ open: false });
  const [dropdownData, setDropdownData] = useState<any>({
    materialTypes: [],
    categories: [],
    subcategories: [],
    grns: [],
  });

  const UserInitialValues: any = {
    material_type_id: rowData.material_type_id || '',
    category_id: rowData.category_id || '',
    subcategory_id: rowData.subcategory_id || '',
    grn_id: rowData.grn_id || '',
  };

  const edit = useEdit(UserInitialValues);
  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };
  const handlePrint = () => {};

  const handleClickButton = (rowData: any, type: string) => {
    setOpenCreateModel({
      open: true,
      rowData: rowData,
      type: type,
    });
  };
  const renderRowAction = () => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit',
            description: 'Do you want to modify data?',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.orangePrimary,
            iconType: CONFIRM_MODAL.edit,
            // onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        // onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
    ];
  };

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'sku_id',
      headerName: 'SKU ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'hsn_code',
      headerName: 'HSN Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
              gap: 1.5,
            }}
          >
            {/* Product Image */}
            <Box
              component="img"
              src={row.image_urls[0]}
              alt={row.image_urls[0]}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />

            {/* Product Name */}
            <Typography>{row.product_name}</Typography>
          </Box>
        );
      },
    },

    {
      field: 'purity',
      headerName: 'Purity',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'grs_weight',
      headerName: 'Grs Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_weight',
      headerName: 'Net Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialTypesRes, grnsRes]: any = await Promise.all([
        DropDownServiceAll.getMaterialTypes(),
        DropDownServiceAll.getGrns(),
      ]);

      const mapToOption = (arr: any[], labelKey: string, valueKey: string) =>
        arr?.map((item) => ({
          label: item[labelKey],
          value: item[valueKey],
        })) || [];

      setDropdownData({
        materialTypes: mapToOption(
          materialTypesRes?.data?.data?.materialTypes || [],
          'material_type',
          'id'
        ),
        grns: mapToOption(grnsRes?.data?.data?.grns || [], 'grn_no', 'id'),
        categories: [],
        subcategories: [],
      });
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || 'Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllProductData = async () => {
    try {
      setLoading(true);
      const responseProductData: any = await ProductService.getAll({
        material_type_id: edit.getValue('material_type_id')?.value,
        category_id: edit.getValue('category_id')?.value,
        subcategory_id: edit.getValue('subcategory_id')?.value,
        grn_id: edit.getValue('grn_id')?.value,
        search: edit.getValue('search') || '',
      });
      console.log('responseProductData', responseProductData);
      if (responseProductData?.data?.statusCode === 200) {
        const products = responseProductData?.data?.data?.products.map(
          (item: any, index: number) => {
            return {
              ...item,
              s_no: index + 1,
            };
          }
        );
        setProductListData(products);
      } else {
        setProductListData([]);
      }
    } catch (err: any) {
      setLoading(false);
      setProductListData([]);
      toast.error(err?.message || 'Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleMaterialTypeChange = async (e: any, value: any) => {
    edit.update({
      material_type_id: value,
      category_id: '',
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getCategories({
        material_type_id: value.value,
      });
      const categories =
        res?.data?.data?.categories?.map((item: any) => ({
          label: item.category_name,
          value: item.id,
        })) || [];

      setDropdownData((prev: any) => ({
        ...prev,
        categories,
        subcategories: [],
      }));
    }
  };

  const handleCategoryChange = async (e: any, value: any) => {
    edit.update({
      category_id: value,
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getSubcategories({
        category_id: value.value,
      });
      const subcategories =
        res?.data?.data?.subcategories?.map((item: any) => ({
          label: item.subcategory_name,
          value: item.id,
        })) || [];

      setDropdownData((prev: any) => ({
        ...prev,
        subcategories,
      }));
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllProductData();
  }, [edit.getValue('search')]);

  return (
    <Grid container spacing={3}>
      <Grid container size={12}>
        <PageHeader
          title="TAG PRINTING"
          titleStyle={{ color: theme.Colors.blackPrimary }}
          btnName="Tag Setting"
          showDownloadBtn={false}
          showCreateBtn={true}
          icon={<SettingIcon />}
          // navigateUrl=""
        />
      </Grid>
      <Grid container size={12} spacing={2}>
        <Grid
          container
          width={'100%'}
          sx={{
            padding: '30px',
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
            border: `1px solid ${theme.Colors.grayLight}`,
          }}
        >
          {/* First Row */}
          <Grid container size={12} spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Material Type"
                options={dropdownData.materialTypes}
                value={edit.getValue('material_type_id')}
                onChange={handleMaterialTypeChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Category"
                options={dropdownData.categories}
                value={edit.getValue('category_id')}
                onChange={handleCategoryChange}
              />
            </Grid>
          </Grid>

          {/* Second Row */}
          <Grid container size={12} spacing={3}>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Sub Category"
                options={dropdownData.subcategories}
                value={edit.getValue('subcategory_id')}
                onChange={(e, value) => edit.update({ subcategory_id: value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="GRN No"
                options={dropdownData.grns}
                value={edit.getValue('grn_id')}
                onChange={(e, value) => edit.update({ grn_id: value })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{
          border: '1px Solid #E4E4E4',
          borderRadius: '8px',
          padding: '15px',

          backgroundColor: theme.Colors.whitePrimary,
        }}
      >
        <Grid size={4}>
          <MUHTextInput
            placeholderText="Search..."
            placeholderColor={theme.Colors.blackLightLow}
            placeholderFontSize={12.5}
            fontSize={12.5}
            fontWeight={400}
            fontFamily="Roboto-Regular"
            height={28}
            borderRadius={1.6}
            borderColor={theme.Colors.grayBorderLight}
            value={edit?.getValue('search')}
            onChange={(e: any) => {
              edit?.update({ search: e.target.value });
            }}
          />
        </Grid>
        <Grid size={12}>
          <MUHTable
            columns={columns}
            rows={productListData}
            getRowActions={renderRowAction}
            loading={loading}
          />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={'center'}
        sx={{
          width: '100%',
          textWrap: 'nowrap',
        }}
      >
        <DualActionButton
          rightButtonStyle={{
            border: '1px solid #6D2E3D',
            borderRadius: '8px',
          }}
          leftButtonStyle={{ borderRadius: '8px' }}
          leftButtonText={'Print'}
          rightButtonText={'Preview'}
          onLeftButtonClick={handlePrint}
          // onRightButtonClick={handlePreview}
          onRightButtonClick={() => handleClickButton({}, CONFIRM_MODAL.create)}
          containerStyle={{ gap: '20px' }}
        />
      </Grid>
      {openCreateModel.open ? (
        <Preview
          {...openCreateModel}
          onClose={() => setOpenCreateModel({ open: false })}
        />
      ) : null}
    </Grid>
  );
};

export default TagPrinting;
