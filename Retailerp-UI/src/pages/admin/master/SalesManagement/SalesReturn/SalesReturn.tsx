import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme, Box, Typography } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import SalesReturnList from './SalesReturnList';
import { salesReturnData } from '@constants/DummyData';

const SalesReturn = () => {
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
      field: 'date_of_return',
      headerName: 'Date Of Return',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sales_return_id',
      headerName: 'Sales Return ID',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => (
        <MUHListItemCell
          title={row.sales_return_id}
          titleStyle={{ color: '#800020', textDecoration: 'underline' }}
          underLine={true}
          isLink={`/admin/salesManagement/salesReturn/bill`}
        />
      ),
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
      setBranchData(salesReturnData);
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
          title="Sales Return"
          navigateUrl="/admin/salesManagement/branchView"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
        />
        <Grid container sx={contentLayout}>
          <SalesReturnList
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
            rows={salesReturnData}
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

export default SalesReturn;
