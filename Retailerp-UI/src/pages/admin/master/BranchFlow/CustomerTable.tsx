import Grid from '@mui/material/Grid2';
import { ConfirmModal, MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEdit } from '@hooks/useEdit';
import { useTheme, Box, Typography, Chip } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import MUHListItemCell from '@components/MUHListItemCell';
import { topBuyingData } from '@constants/DummyData';

const CustomerTable = () => {
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
      field: 'id',
      headerName: 'S.No',
      flex: 0.7,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'customer_id',
      headerName: 'Customer ID',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: { row: any }) => {
        const params = new URLSearchParams({
          type: 'view',
          rowId: String(row?.id ?? ''),
        }).toString();
        return (
          <MUHListItemCell
            title={row.customer_id}
            titleStyle={{ color: theme.Colors.primary }}
            // isLink={`/admin/master/branch/form?type=view&rowId=${row.id}&heading=${row.branch_name}`}
          />
        );
      },
    },
    {
      field: 'customer',
      headerName: 'Customer',
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
            ₹
            {Number((row.total_amount || '0').replace(/,/g, '')).toLocaleString(
              'en-IN'
            )}
          </Typography>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setBranchData(topBuyingData);
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
            Top Buying Customers
          </Typography>
        </Grid>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns.filter(
              (column) => !hiddenColumns.includes(column.headerName)
            )}
            rows={topBuyingData}
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

export default CustomerTable;
