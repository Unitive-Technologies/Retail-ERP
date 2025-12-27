import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { contentLayout } from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { CategoryRows } from '@constants/DummyData';
import { RowEditIcon, RowViewIcon, DisableIcon } from '@assets/Images';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { API_SERVICES } from '@services/index';
import CategoryTableFilter from './categoryTableFilter';

const CategoryList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [categoryData, setCategoryData] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const initialValues = {
    search: '',
    material_type: '',
  };
  const edit = useEdit(initialValues);

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
      headerName: 'Category Name',
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

  const handleEditCategory = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/collections/category/form?${params}`, {
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
              handleEditCategory(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditCategory(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Disable',
        renderIcon: () => <DisableIcon />,
        onClick: () => {},
      },
    ];
  };

  const searchValue = edit.getValue('search');
  const materialTypeValue = edit.getValue('material_type');
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        search: searchValue || '',
        material_type_id: materialTypeValue || '',
      };

      const response = await API_SERVICES.CategoryService.getAll(params);

      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const transformedData = response.data.data?.categories
          ?.map((item: any, index: number) => ({
            id: item.id ?? index + 1,
            category_name: item.category_name ?? '',
            image: item.category_image_url ?? '',
            material_type: item.material_type ?? '',
            ...item,
          }))
          ?.reverse()
          ?.map((item: any, index: number) => ({
            ...item,
            s_no: index + 1,
          }));

        setCategoryData(transformedData);

        setCategoryData(transformedData);

        setCategoryData(transformedData);
      } else {
        setCategoryData(CategoryRows);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
      setCategoryData(CategoryRows);
    } finally {
      setLoading(false);
    }
  }, [searchValue, materialTypeValue]);

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
          title="CATEGORY LIST"
          count={categoryData.length}
          btnName="Create Category"
          navigateUrl={`/admin/master/collections/category/form?type=create`}
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <CategoryTableFilter
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
            rows={categoryData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryList;
