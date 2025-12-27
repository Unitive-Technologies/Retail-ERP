import { contentLayout } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import { Typography, useTheme } from '@mui/material';
import { Box, Grid } from '@mui/system';
import { API_SERVICES } from '@services/index';
import { useNavigate } from 'react-router-dom';
import SchemeTableFilter from './schemeTableFilter';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';

import { ConfirmModal, MUHTable } from '@components/index';
import { DeactiveIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import MUHListItemCell from '@components/MUHListItemCell';
import toast from 'react-hot-toast';

const Schemes = () => {
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

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/createScheme/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeactive = (rowData: any) => {};

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S.No',
      flex: 0.39,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id); // Get visible index
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'material_type',
      headerName: 'Material Type',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'scheme_name',
      headerName: 'Scheme Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              color: theme.Colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',

              textDecoration: 'underline',
            }}
            onClick={() => navigateTo(`/admin/master/schemes/view`)}
          >
            {row.scheme_name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'scheme_type_name',
      headerName: 'Scheme Type',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'duration_name',
      headerName: 'Duration',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.status}
          titleStyle={{
            color:
              row.status === 'Active'
                ? theme.Colors.greenPrimary
                : theme.Colors.redPrimarySecondary,
          }}
        />
      ),
    },
  ];

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
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => handleEditUser(rowData, CONFIRM_MODAL.edit),
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
      {
        text: 'View',
        renderIcon: () => <RowViewIcon />,
        onClick: () => handleEditUser(rowData, CONFIRM_MODAL.view),
      },
      {
        text: 'Deactive',
        renderIcon: () => <DeactiveIcon />,
        onClick: () => handleDeactive(rowData),
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await API_SERVICES.SchemeMasterService.getAll({
        search: edit.getValue('search') || '',
      });

      if (response?.status < HTTP_STATUSES.BAD_REQUEST && response?.data) {
        const schemes = (response?.data?.data?.schemes ??
          response?.data?.schemes ??
          []) as any[];

        const transformedData = schemes.map((item: any, index: number) => ({
          id: item.id ?? item.scheme_id ?? `${index + 1}`,
          s_no: index + 1,
          scheme_name: item.scheme_name,
          scheme_type_name: item.scheme_type_name,
          material_type_id: item.material_type_id,
          duration_name: item.duration_name,
          material_type: item.material_type,
          status: item.status,
        }));

        setRows(transformedData);
      } else {
        console.warn('API call failed, using dummy data');
      }
    } catch (err: any) {
      console.error('Error fetching schemes:', err);
      toast.error('Failed to load scheme data');
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

  return (
    <>
      <Grid container spacing={2}>
        <PageHeader
          title="Scheme Master"
          titleStyle={{
            color: theme.Colors.black,
          }}
          btnName="Create New Scheme"
          navigateUrl="/admin/master/createScheme/form?type=create"
        />
        <Grid container sx={contentLayout}>
          <SchemeTableFilter
            selectItems={columns}
            selectedValue={hiddenColumns}
            handleSelectValue={handleSelectValue}
            handleFilterClear={handleFilterClear}
            edit={edit}
          />
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={rows}
            getRowActions={renderRowAction}
            isLoading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Schemes;
