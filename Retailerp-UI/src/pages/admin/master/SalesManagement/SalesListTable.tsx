import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme, Box, Typography, Chip } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';

const SalesListTable = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(false);
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const salesData = [
    {
      id: 1,
      branch_name: 'KHM Silver',
      total_sales: 210340,
      total_no_of_invoice: 458,
      total_amount: 12000,
    },
    {
      id: 2,
      branch_name: 'Velli Maligai',
      total_sales: 310030,
      total_no_of_invoice: 123,
      total_amount: 25000,
    },
    {
      id: 3,
      branch_name: 'Sri Velli Alangaram',
      total_sales: 113000,
      total_no_of_invoice: 234,
      total_amount: 20475,
    },
    {
      id: 4,
      branch_name: 'Aathira Silver Mart',
      total_sales: 210340,
      total_no_of_invoice: 436,
      total_amount: 19200,
    },
    {
      id: 5,
      branch_name: 'Annapoorani Velli Chemmal',
      total_sales: 110011,
      total_no_of_invoice: 158,
      total_amount: 18900,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      align: 'center',
      headerAlign: 'center',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.6,
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
          <MUHListItemCell
            title={row.branch_name}
            titleStyle={{
              color: theme.Colors.primary,
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          />
        </Box>
      ),
    },
    {
      field: 'total_sales',
      headerName: 'Total Sales',
      flex: 1.4,
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
            ₹{row.total_sales?.toLocaleString('en-IN')}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'total_no_of_invoice',
      headerName: 'Total No. of Invoice',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1.4,
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
            ₹{row.total_amount?.toLocaleString('en-IN')}
          </Typography>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    try {
      setBranchData(salesData);
    } catch (e: any) {
      toast.error(e?.message);
      setBranchData([]);
    }
    setLoading(false);
  }, []);

  const handleViewAllClick = () => {
    navigateTo('/admin/salesManagement/branch');
  };

  return (
    <>
      <Grid container width={'100%'} mt={1.2}>
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
            Sales List
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
              (c) => !hiddenColumns.includes(c.headerName)
            )}
            rows={salesData}
            loading={loading}
            isPagination={false}
            isCheckboxSelection={false}
          />

          {confirmModalOpen.open && <ConfirmModal {...confirmModalOpen} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SalesListTable;
