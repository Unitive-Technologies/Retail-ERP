import PageHeader from '@components/PageHeader';
import { Grid } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  contentLayout,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import CommonTableFilter from '@components/CommonTableFilter';
import { useEdit } from '@hooks/useEdit';
import toast from 'react-hot-toast';
import { MaterialTypeRows } from '@constants/DummyData';
import { RowEditIcon, RowViewIcon, DisableIcon } from '@assets/Images';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CONFIRM_MODAL } from '@constants/Constance';
import MenuDropDown from '@components/MUHMenuDropDown';
import {
  MATERIAL_TYPE_LIST_COLUMN_MAPPING,
  MATERIAL_TYPE_LIST_PDF_HEADERS,
  PDF_TITLE,
} from '@constants/PdfConstants';

const MaterialTypeList = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const [rows, setRows] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const initialValues = {
    status: 0,
    location: '',
    search: '',
  };
  const edit = useEdit(initialValues);

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell title={row.material_type} avatarImg={row.image} />
      ),
    },
    {
      field: 'material_price',
      headerName: 'Material Price /g',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => formatCurrency(row.material_price) || '-',
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

  const handleEditMaterialType = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/collections/materialType/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeleteMaterialType = async (rowData: any) => {
    try {
      setConfirmModalOpen({ open: false });

      const response: any = await API_SERVICES.MaterialTypeService.delete(
        rowData.id,
        {
          successMessage: 'Material type deleted successfully!',
          failureMessage: 'Failed to delete material type',
        }
      );

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        // Refresh the list after successful deletion
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting material type:', error);
      toast.error('Failed to delete material type');
    }
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
              handleEditMaterialType(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditMaterialType(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Delete',
        renderIcon: () => <DisableIcon />,
        onClick: () => {
          const props = {
            title: 'Delete Material Type',
            description:
              'Are you sure you want to delete this material type? This action cannot be undone.',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.redPrimary,
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteMaterialType(rowData),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // API call to fetch material types with search parameter
      const response: any = await API_SERVICES.MaterialTypeService.getAll({
        search: edit.getValue('search') || '',
      });

      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        // Transform API data to match table structure
        const transformedData = response?.data.data?.materialTypes?.map(
          (item: any, index: number) => ({
            id: item.id || index + 1,
            s_no: index + 1,
            material_type: item.material_type || '',
            image: item.material_image_url || '',
            material_price: item.material_price ?? '',
            // Add any other fields that your API returns
            ...item,
          })
        );

        setRows(transformedData);
      } else {
        // Fallback to dummy data if API fails
        console.warn('API call failed, using dummy data');
        setRows(MaterialTypeRows);
      }
    } catch (err: any) {
      console.error('Error fetching material types:', err);
      toast.error('Failed to load material types');

      // Fallback to dummy data on error
      setRows(MaterialTypeRows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [edit.getValue('search')]);

  // Refresh data when returning from create/edit page
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // PDF / Print config
  const columnMapping = MATERIAL_TYPE_LIST_COLUMN_MAPPING;
  const pdfHeaders = MATERIAL_TYPE_LIST_PDF_HEADERS;
  const fileName = PDF_TITLE.materialTypeList;

  const pdfData: any = rows?.length
    ? rows.map((row: any, index: number) => ({
        s_no: index + 1,
        material_type: row?.material_type || '',
        material_price: formatCurrency(row?.material_price) || '-',
      }))
    : [];

  const handleOpenDownloadMenu = (e: any) => {
    setMenuAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="MATERIAL TYPE LIST"
          count={rows.length}
          btnName="Create Material Type"
          navigateUrl={`/admin/master/collections/materialType/form?type=create`}
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
          showDownloadBtn={true}
          onDownloadClick={handleOpenDownloadMenu}
          onPrintClick={() => window.print()}
        />
        <Grid container sx={contentLayout} className="print-area" mt={0}>
          {/* Print heading */}
          <div
            className="print-only"
            style={{ width: '100%', marginBottom: 12 }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#000',
                paddingBottom: 8,
                marginBottom: 8,
              }}
            >
              Material Type List ({rows.length})
            </div>
          </div>

          {/* Filters & download - hide in print */}
          <div className="print-hide" style={{ width: '100%' }}>
            <MenuDropDown
              anchorEl={menuAnchorEl}
              handleCloseMenu={handleCloseMenu}
              hiddenCols={hiddenColumns}
              columnMapping={columnMapping}
              pdfData={pdfData}
              pdfHeaders={pdfHeaders}
              fileName={fileName}
              address={''}
            />
            <Grid container sx={tableFilterContainerStyle}>
              <CommonTableFilter
                selectItems={columns}
                selectedValue={hiddenColumns}
                handleSelectValue={handleSelectValue}
                handleFilterClear={handleFilterClear}
                edit={edit}
              />
            </Grid>
          </div>

          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={rows}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default MaterialTypeList;
