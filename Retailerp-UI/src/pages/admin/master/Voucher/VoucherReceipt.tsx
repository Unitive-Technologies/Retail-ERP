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
import { roleData } from '@constants/DummyData';
import MUHListItemCell from '@components/MUHListItemCell';
import ReceiptList from './ReceiptList';
export const voucherRows = [
  {
    id: 1,
    receipt_date: '02/05/2025',
    receipt_no: 'PAY 01/24-25',
    account_name: 'Golden Hub Pvt., Ltd.,',
    total_amount: 12000,
  },
  {
    id: 2,
    receipt_date: '05/05/2025',
    receipt_no: 'PAY 02/24-25',
    account_name: 'Shiva Silver Suppliers',
    total_amount: 25000,
  },
  {
    id: 3,
    receipt_date: '08/05/2025',
    receipt_no: 'PAY 03/24-25',
    account_name: 'Jai Shree Jewels',
    total_amount: 20475,
  },
  {
    id: 4,
    receipt_date: '10/05/2025',
    receipt_no: 'PAY 04/24-25',
    account_name: 'Kalash Gold & Silver Mart',
    total_amount: 19200,
  },
];
const VoucherReceipt = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
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
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'receipt_date',
      headerName: 'Receipt Date',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'receipt_no',
      headerName: 'Receipt No',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <MUHListItemCell
          title={row.receipt_no}
          titleStyle={{
            color: theme.Colors.primary,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          isLink={`/admin/voucher/view?id=${row.id}`}
        />
      ),
    },
    {
      field: 'account_name',
      headerName: 'Account Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => `₹${row.total_amount.toLocaleString()}`,
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
      setBranchData(roleData);
    } catch (err: any) {
      setLoading(false);
      setBranchData([]);
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
          title="Receipt List"
          count={voucherRows.length}
          btnName="Create Receipt"
          navigateUrl="/admin/voucher/receipt/create"
        />
        <Grid container sx={contentLayout}>
          <ReceiptList
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
            rows={voucherRows}
            getRowActions={renderRowAction}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default VoucherReceipt;
