import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { RowEditIcon, RowViewIcon, DisableIcon } from '@assets/Images';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { API_SERVICES } from '@services/index';
import SubCategoryTableFilter from './subCategoryTableFilter';

const SubCategoryList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [subCategoryData, setSubCategoryData] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const initialValues = {
    search: '',
    material_type: '',
    category: '',
  };
  const edit = useEdit(initialValues);
  const searchValue = edit.getValue('search');
  const materialTypeValue = edit.getValue('material_type');
  const categoryValue = edit.getValue('category');

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.material_type}
          avatarImg={row.material_image_url}
        />
      ),
    },
    {
      field: 'category_name',
      headerName: 'Category',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.category_name}
          avatarImg={row.category_image_url}
        />
      ),
    },
    {
      field: 'sub_category_name',
      headerName: 'Sub Category',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.sub_category_name}
          avatarImg={row.subcategory_image_url}
        />
      ),
    },
    {
      field: 'reorder_level',
      headerName: 'Reorder Level',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    // {
    //   field: 'making_changes',
    //   headerName: 'Making Charges',
    //   flex: 1.5,
    //   sortable: false,
    //   disableColumnMenu: true,
    // },
    // {
    //   field: 'margin',
    //   headerName: 'Margin %',
    //   flex: 1.5,
    //   sortable: false,
    //   disableColumnMenu: true,
    // },
  ];

  const handleCustomizeColumn = (hiddenColumns: string[]) => {
    setHiddenColumns([...hiddenColumns]);
  };

  const handleSelectValue = (item: { headerName: never }) => {
    let hiddenCols = [];
    if (hiddenColumns.includes(item.headerName)) {
      hiddenCols = hiddenColumns.filter(
        (field: any) => field !== item.headerName
      );
      setHiddenColumns([...hiddenCols]);
    } else {
      hiddenCols = [...hiddenColumns, item.headerName];
      setHiddenColumns([...hiddenCols]);
    }
    handleCustomizeColumn(hiddenCols);
  };

  const handleFilterClear = () => {
    edit.reset();
    setHiddenColumns([]);
  };

  const handleEditSubCategory = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/collections/subCategory/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const renderRowAction = (rowData: never) => {
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
            onConfirmClick: () =>
              handleEditSubCategory(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditSubCategory(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Disable',
        renderIcon: () => <DisableIcon />,
        onClick: () => {},
      },
    ];
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchValue || '',
        materialtype_id: materialTypeValue || '',
        category_id: categoryValue || '',
      };
      // API call to fetch subcategories with search parameter
      const response: any =
        await API_SERVICES.SubCategoryService.getAll(params);

      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const subcategories = response?.data.data?.subCategories;
        const transformedData = subcategories
          ?.map((item: any, index: number) => ({
            id: item.id || index + 1,
            s_no: index + 1,
            material_type: item.materialtype_id ?? '', // You may want to resolve this to a name if available
            category_name: item.category_id ?? '', // You may want to resolve this to a name if available
            sub_category_name: item.subcategory_name || '',
            image: item.subcategory_image_url || '',
            reorder_level: item.reorder_level ?? '',
            making_changes: item.making_changes ?? '',
            margin: item.margin ?? '',
            ...item,
          }))
          ?.reverse()
          ?.map((item: any, index: number) => ({
            ...item,
            s_no: index + 1,
          }));
        setSubCategoryData(transformedData);
      } else {
        setSubCategoryData([]);
      }
    } catch (err: any) {
      console.error('Error fetching subcategories:', err);
      toast.error('Failed to load subcategories');
      setSubCategoryData([]);
    } finally {
      setLoading(false);
    }
  }, [searchValue, materialTypeValue, categoryValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="SUB CATEGORY LIST"
          count={subCategoryData.length}
          btnName="Create Sub Category"
          navigateUrl={`/admin/master/collections/subCategory/form?type=create`}
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <SubCategoryTableFilter
            selectItems={columns}
            handleSelectValue={handleSelectValue}
            selectedValue={hiddenColumns}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={subCategoryData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SubCategoryList;
