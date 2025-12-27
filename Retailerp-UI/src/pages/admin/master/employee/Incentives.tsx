import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme, Box, Typography } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import IncentiveTableFilter from './IncentiveTableFilter';
import { API_SERVICES } from '@services/index';

const Incentives = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [incentiveData, setIncentiveData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

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
      align: 'center',
      renderCell: (params: any) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        const serialNumber = index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      field: 'role_name',
      headerName: 'Role',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sales_target',
      headerName: 'Sales Target',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        const target = params.value;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
            }}
          >
            {Array.isArray(target) && target.length === 2 ? (
              <Typography sx={{ fontWeight: 500 }}>
                ₹{target[0]?.toLocaleString('en-IN')} - ₹
                {target[1]?.toLocaleString('en-IN')}
              </Typography>
            ) : (
              <Typography sx={{ color: '#676767' }}>-</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'incentive_type',
      headerName: 'Incentive Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'incentive_value',
      headerName: 'Incentives',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        const row = params.row;
        const type = row.incentive_type?.toLowerCase();
        const value = Number(row.incentive_value);

        if (!value) return <Typography>-</Typography>;

        let formattedValue = '';
        if (type === 'percentage') {
          formattedValue = `${parseFloat(value.toFixed(0))}%`;
        } else {
          formattedValue = `₹${value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{formattedValue}</Typography>
          </Box>
        );
      },
    },
  ];

  const handleEditUser = (rowData: any, modalType: string) => {
    const routeType =
      modalType === CONFIRM_MODAL.edit
        ? 'edit'
        : modalType === CONFIRM_MODAL.view
          ? 'view'
          : 'edit';

    navigateTo('/admin/master/employee/new', {
      state: { rowData, type: routeType },
    });
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
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
    ];
  };
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
  const fetchData = async (params?: any) => {
    try {
      setLoading(true);
      setIncentiveData([]);
      const response: any =
        await API_SERVICES.EmployeeIncentiveService.getAll(params);
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        setIncentiveData(response.data.data.incentives);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Incentives List"
          count={incentiveData.length}
          btnName="Create New"
          navigateUrl="/admin/master/employee/new"
        />
        <Grid container sx={contentLayout}>
          <IncentiveTableFilter
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
            rows={incentiveData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Incentives;
