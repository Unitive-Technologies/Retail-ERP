import { contentLayout } from '@components/CommonStyles';
import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { CONFIRM_MODAL, HTTP_STATUSES } from '@constants/Constance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DeleteOutlinedIcon, RowEditIcon, RowViewIcon } from '@assets/Images';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import MUHListItemCell from '@components/MUHListItemCell';
import { useTheme } from '@mui/material';
import CustomerTableFilter from './CustomerTableFilter';
import { API_SERVICES } from '@services/index';

const Customer = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    status: 0,
    branch: '',
    mode: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 's_no',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'customer_code',
      headerName: 'Customer Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.customer_code}
          titleStyle={{ color: theme.Colors.primary }}
          isLink="/admin/customer/order"
        />
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'no_of_order',
      headerName: 'No. of Order',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'purchase_amount',
      headerName: 'Purchase Amount',
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }: { row: any }) => (
        <span>₹ {row.purchase_amount?.toLocaleString()}</span>
      ),
    },
    {
      field: 'scheme_details',
      headerName: 'Scheme Details',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: any }) => {
        if (row.scheme_details === 'Yes') {
          return (
            <ChipComponent
              label="Yes"
              size="small"
              variant="filled"
              clickable={false}
              style={{
                backgroundColor: '#FFE8E8',
                color: '#D32F2F',
                fontWeight: 500,
                border: 'none',
              }}
            />
          );
        }
        return <span>-</span>;
      },
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

  const handleEditUser = (rowData: any, type: string) => {
    const params = new URLSearchParams({
      type: type,
      rowId: rowData?.id,
    }).toString();
    navigateTo(`/admin/customer/form?${params}`);
  };

  const handleCancelModal = () => {
    setConfirmModalOpen({ open: false });
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await API_SERVICES.CustomerService.delete(customerId, {
        successMessage: 'Customer deleted successfully',
        failureMessage: 'Failed to delete customer',
      });
      
      // Refresh the customer list
      await fetchData();
      handleCancelModal();
    } catch (error) {
      console.error('Error deleting customer:', error);
      handleCancelModal();
    }
  };

  const renderRowAction = (rowData: any) => {
    return [
      {
        text: 'Edit',
        renderIcon: () => <RowEditIcon />,
        onClick: () => {
          const props = {
            title: 'Edit Customer',
            description: 'Do you want to modify this customer data?',
            onCancelClick: () => handleCancelModal(),
            color: '#FF742F',
            iconType: CONFIRM_MODAL.edit,
            onConfirmClick: () => {
              handleCancelModal();
              handleEditUser(rowData, CONFIRM_MODAL.edit);
            },
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
        text: 'Delete',
        renderIcon: () => <DeleteOutlinedIcon />,
        onClick: () => {
          const props = {
            title: 'Delete Customer',
            description: `Are you sure you want to delete customer "${rowData.customer_name}"? This action cannot be undone.`,
            onCancelClick: () => handleCancelModal(),
            color: '#D32F2F',
            iconType: CONFIRM_MODAL.delete,
            onConfirmClick: () => handleDeleteCustomer(rowData.id),
            confirmText: 'Delete',
            cancelText: 'Cancel',
          };
          setConfirmModalOpen({ open: true, ...props });
        },
      },
    ];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await API_SERVICES.CustomerService.getAll();
      
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const customers = response.data.data.customers || [];
        // Add serial numbers to the data
        const customersWithSerial = customers.map((customer: any, index: number) => ({
          ...customer,
          s_no: index + 1,
        }));
        setCustomerData(customersWithSerial);
      } else {
        setCustomerData([]);
        toast.error('Failed to load customers');
      }
    } catch (err: any) {
      setLoading(false);
      setCustomerData([]);
      toast.error(err?.message || 'Failed to fetch customer data');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Customer Details"
        count={customerData.length}
        btnName="Create Customer"
        navigateUrl="/admin/customer/form?type=create"
      />
      <Grid container sx={contentLayout}>
        <CustomerTableFilter
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
          rows={customerData}
          getRowActions={renderRowAction}
          loading={loading}
        />
        {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
      </Grid>
    </>
  );
};

export default Customer;
