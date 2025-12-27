import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import CustomerListFilter from './CustomerListFilter';
import { customersData } from '@constants/DummyData';

const CustomerList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    branch: '',
    status: '',
    search: '',
    dateRange: [],
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S.No',
      flex: 0.3,

      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'customer_no',
      headerName: 'Customer No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.customer_no}
            titleStyle={{ color: theme.Colors.primary, cursor: 'pointer' }}
            isLink="/admin/branch/customerView"
            state={{
              customer: {
                id: row.id,
                customer_no: row.customer_no,
                customer_name: row.customer_name,
                mobile_no: row.mobile_no,
                total_no_of_orders: row.total_no_of_orders,
                purchase_amount: row.purchase_amount,
              },
            }}
          />
        );
      },
    },

    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        return (
          <MUHListItemCell
            title={row.customer_name}
            titleStyle={{ color: theme.Colors.primary, cursor: 'pointer' }}
            isLink="/admin/branch/customerView"
            state={{
              customer: {
                id: row.id,
                customer_no: row.customer_no,
                customer_name: row.customer_name,
                mobile_no: row.mobile_no,
                total_no_of_orders: row.total_no_of_orders,
                purchase_amount: row.purchase_amount,
              },
            }}
          />
        );
      },
    },
    {
      field: 'mobile_no',
      headerName: 'Mobile Number',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_no_of_orders',
      headerName: 'Total No Of Order',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'purchase_amount',
      headerName: 'Purchase Amount',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/master/employee/role?${params}`);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch customer data here
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
        <PageHeader
          title="Customer List"
          showDownloadBtn={false}
          showCreateBtn={false}
          showlistBtn={false}
        />
        <Grid container sx={contentLayout}>
          <CustomerListFilter
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
            rows={customersData}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerList;
