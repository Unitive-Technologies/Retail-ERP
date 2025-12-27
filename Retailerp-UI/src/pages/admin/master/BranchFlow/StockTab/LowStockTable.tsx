import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme, Box, Typography, Chip } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { lowStockData } from '@constants/DummyData';

const LowStockTable = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState({ open: false });
  const [branchData, setBranchData] = useState<object[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<any[]>([]);

  const initialValues = {
    status: 0,
    location: '',
    search: '',
  };

  const edit = useEdit(initialValues);

  const columns: GridColDef[] = [
    {
      field: 'sub_category',
      headerName: 'Sub Category',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
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
          <Typography sx={{ fontWeight: 500 }}>{row.quantity}</Typography>
        </Box>
      ),
    },
    {
      field: 'reorder_level',
      headerName: 'Reorder Level',
      flex: 1,
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
          <Typography sx={{ fontWeight: 500 }}>{row.reorder_level}</Typography>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(lowStockData);
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
    // Handle view all click
    console.log('View All clicked');
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
              fontSize: '18px',
              color: '#000',
              fontWeight: 600,
            }}
          >
            Low Stock
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
              '&:hover': {
                backgroundColor: '#E8EFFD',
              },
            }}
          />
        </Grid>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={lowStockData}
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

export default LowStockTable;
