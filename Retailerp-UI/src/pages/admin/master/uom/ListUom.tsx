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
import { RowEditIcon, RowViewIcon, DeactiveIcon } from '@assets/Images';
import { useTheme } from '@mui/material';
import MUHListItemCell from '@components/MUHListItemCell';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { API_SERVICES } from '@services/index';

const UOMList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [rows, setRows] = useState<any>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });

  const initialValues = {
    status: 0,
    location: '',
    search: '',
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
      field: 'uom_code',
      headerName: 'UOM ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'uom_name',
      headerName: 'UOM Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'short_code',
      headerName: 'Short Code',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.status}
          titleStyle={{
            color: row.status === 'Active' ? '#6CB044' : '#FF0000',
            fontSize: theme.MetricsSizes.small_xx,
            fontWeight: theme.fontWeight.regular,
            fontFamily: theme.fontFamily.roboto,
          }}
          listStyle={{ paddingTop: 2.5 }}
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

  const handleEditUOM = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
    }).toString();
    navigateTo(`/admin/master/uom/form?${params}`, {
      state: { rowData: rowData, type: type },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleUpdateUomStatus = async (rowData: any) => {
    try {
      setConfirmModalOpen({ open: false });

      const response = await API_SERVICES.UomService.updateStatus({
        id: rowData.id,
        data: { status: rowData.status === 'Active' ? 'Inactive' : 'Active' },
        successMessage: 'Uom status updated successfully!',
        failureMessage: 'Failed to update Uom status',
      });
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        // Refresh the list after successful
        fetchData();
      }
    } catch (error) {
      console.error('Error updating Uom status:', error);
      toast.error('Failed to update Uom status');
    }
  };

  const renderRowAction = (rowData: any) => {
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
            onConfirmClick: () => handleEditUOM(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUOM(rowData, CONFIRM_MODAL.view),
      },
      {
        text: rowData.status === 'Active' ? 'Inactive' : 'Active',
        renderIcon: () => <DeactiveIcon />,
        onClick: () => {
          const props = {
            title: 'Update UOM Status',
            description: 'Are you sure you want to update the status',
            onCancelClick: () => handleCancelModal(),
            color: theme.Colors.redPrimary,
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleUpdateUomStatus(rowData),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await API_SERVICES.UomService.getAll({
        search: edit.getValue('search') ?? '',
      });
      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const transformedData = response.data.data?.uoms?.map(
          (item: any, index: number) => ({
            id: item.id ?? index + 1,
            s_no: index + 1,
            uom_code: item.uom_code,
            uom_name: item.uom_name,
            short_code: item.short_code,
            status: item.status,
            ...item,
          })
        );
        setRows(transformedData);
      } else {
        setRows([]);
      }
    } catch (err: any) {
      setRows([]);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [edit.getValue('search')]);

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="UOM List"
          btnName="Create UOM"
          titleStyle={{ color: theme.Colors.black }}
          navigateUrl="/admin/master/uom/form?create"
          navigateState={{ rowData: {}, type: CONFIRM_MODAL.create }}
        />
        <Grid container sx={contentLayout} mt={0}>
          <Grid container sx={tableFilterContainerStyle}>
            <CommonTableFilter
              selectItems={columns}
              selectedValue={hiddenColumns}
              handleSelectValue={handleSelectValue}
              handleFilterClear={handleFilterClear}
              edit={edit}
            />
          </Grid>

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
export default UOMList;
