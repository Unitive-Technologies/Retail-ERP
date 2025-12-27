import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme, Box, Typography } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import PageHeader from '@components/PageHeader';
import SalesInvoiceList from './SalesInvoiceList';
import { useEdit } from '@hooks/useEdit';
import { salesInvoiceData } from '@constants/DummyData';

const SalesInvoice = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen] = useState({ open: false });
  const [, setBranchData] = useState<object[]>([]);
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
      field: 'date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'invoice_no',
      headerName: 'Invoice No',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.invoice_no}
          titleStyle={{ color: '#800020', textDecoration: 'underline' }}
          underLine={true}
          isLink={`/admin/salesManagement/taxInvoice`}
        />
      ),
    },
    {
      field: 'customer_no',
      headerName: 'Customer No',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ py: 0.5 }}>
          <Typography>{row.product_name}</Typography>
          {row.other_products_count > 0 && (
            <Typography sx={{ color: theme.Colors.graySecondary }}>
              +{row.other_products_count} Other Products
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'grs_weight',
      headerName: 'Grs Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
          }}
        >
          <Typography>{row.grs_weight} g</Typography>
        </Box>
      ),
    },
    {
      field: 'net_weight',
      headerName: 'Net Weight',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
          }}
        >
          <Typography>{row.net_weight} g</Typography>
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'order_type',
      headerName: 'Order Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        const color = row.order_type === 'Online' ? '#3400FF' : '#6D2E3D';

        return (
          <MUHListItemCell
            title={row.order_type}
            titleStyle={{
              color,
            }}
          />
        );
      },
    },

    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>
            ₹{Number(row.total_amount).toLocaleString('en-IN')}
          </Typography>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(salesInvoiceData);
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
      <Grid container width="100%" mt={1.2}>
        <PageHeader
          title="Sales Invoice"
          navigateUrl="/admin/salesManagement/branchView"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
        />
        <Grid container sx={contentLayout}>
          <SalesInvoiceList
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
            rows={salesInvoiceData}
            loading={loading}
            rowHeight={52}
            isPagination={false}
          />

          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SalesInvoice;
