import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme, Box, Typography, Chip } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import { useEdit } from '@hooks/useEdit';
import { useNavigate } from 'react-router-dom';
import { salesInvoiceData } from '@constants/DummyData';

const SalesInvoiceViewTable = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen] = useState({ open: false });
  const [, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const navigateTo = useNavigate();

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
      flex: 0.8,
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
          isLink={`/admin/salesManagement/sales`}
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
  const handleViewAllClick = () => {
    navigateTo('/admin/salesManagement/sales');
  };
  return (
    <>
      <Grid container width="100%" mt={1.2}>
        <Grid
          container
          size={12}
          justifyContent="space-between"
          alignItems="center"
          bgcolor="#FFFFFF"
          sx={{
            paddingX: 2,
            paddingY: 1.6,
            borderRadius: '12px 12px 0 0',
            border: '1px solid #E5E7EB',
            borderBottom: 'none',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: theme.MetricsSizes.regular_x,
              fontFamily: theme.fontFamily.inter,
              color: theme.Colors.blackPrimary,
              fontWeight: theme.fontWeight.mediumBold,
            }}
          >
            Sales Invoice
          </Typography>

          <Chip
            label="View All"
            onClick={handleViewAllClick}
            sx={{
              fontFamily: theme.fontFamily.inter,
              fontSize: theme.MetricsSizes.small_xx,
              fontWeight: theme.fontWeight.mediumBold,
              color: theme.Colors.primary,
              backgroundColor: '#F4F7FE',
              borderRadius: '12px',
              px: 1.5,
              cursor: 'pointer',
            }}
          />
        </Grid>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={salesInvoiceData}
            loading={loading}
            rowHeight={52}
            isPagination={false}
            isCheckboxSelection={false}
          />

          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SalesInvoiceViewTable;
