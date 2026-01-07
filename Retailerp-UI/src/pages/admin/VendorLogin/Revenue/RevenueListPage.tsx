import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageHeader from '@components/PageHeader';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import RevenueFilter from './RevenueFilter';
const RevenueRows = [
  {
    id: 1,
    date: '31/10/2025',
    grn_no: 'GRN 85/24-25',
    item_details: 'Pendant, Earrings',
    quantity: 52,
    amount: 25487,
    received_amount: 25487,
    due_amount: 0,
  },
  {
    id: 2,
    date: '30/10/2025',
    grn_no: 'GRN 81/24-25',
    item_details: 'Pendant, Earrings',
    quantity: 52,
    amount: 32419,
    received_amount: 0,
    due_amount: 32419,
  },
];

const ReceiptListPage = () => {
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
      headerName: 'S. No',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      sortable: false,
    },
    {
      field: 'grn_no',
      headerName: 'GRN No',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <MUHListItemCell
          title={row.grn_no}
          titleStyle={{ color: theme.Colors.primary }}
          isLink={`/admin/revenue/view?id=${row.id}`}
        />
      ),
    },
    {
      field: 'item_details',
      headerName: 'Item Details',
      flex: 1,
      sortable: false,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: ({ row }) => `₹${row.amount.toLocaleString()}`,
    },
    {
      field: 'received_amount',
      headerName: 'Received Amount',
      flex: 1,
      renderCell: ({ row }) => `₹${row.received_amount.toLocaleString()}`,
    },
    {
      field: 'due_amount',
      headerName: 'Due Amount',
      flex: 1,
      renderCell: ({ row }) => `₹${row.due_amount.toLocaleString()}`,
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(RevenueRows);
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
          title="Revenue List"
          count={RevenueRows.length}
          showCreateBtn={false}
          showDownloadBtn={true}
        />
        <Grid container sx={contentLayout}>
          <RevenueFilter
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
            rows={RevenueRows}
            loading={loading}
          />
          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default ReceiptListPage;
