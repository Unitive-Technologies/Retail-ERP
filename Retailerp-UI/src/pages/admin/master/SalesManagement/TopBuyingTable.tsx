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
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';

const TopBuyingTable = () => {
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
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'customer_no',
      headerName: 'Customer No',
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
            title={row.customer_no}
            titleStyle={{ color: theme.Colors.primary }}
            // isLink={`/admin/master/branch/form?type=view&rowId=${row.id}&heading=${row.branch_name}`}
          />
        );
      },
    },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'mobile_no',
      headerName: 'Mobile Number',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total_no_of_order',
      headerName: 'Total No of Order',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'purchase_amount',
      headerName: 'Purchase Amount',
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
            {Number(row.purchase_amount.replace(/,/g, '')).toLocaleString(
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

  const topBuyingData = [
    {
      id: 1,
      customer_no: 'CID 01/24-25',
      customer_name: 'Gokul',
      mobile_no: '9876543204',
      total_no_of_order: 2,
      purchase_amount: ' 14,00,000',
    },
    {
      id: 2,
      customer_no: 'CID 03/24-25',
      customer_name: 'Madhy',
      mobile_no: '9876543210',
      total_no_of_order: 3,
      purchase_amount: '12,00,000',
    },
    {
      id: 3,
      customer_no: 'CID 03/24-25',
      customer_name: 'Kalai',
      mobile_no: '9876543203',
      total_no_of_order: 1,
      purchase_amount: '12,00,000',
    },
    {
      id: 4,
      customer_no: 'CID 04/24-25',
      customer_name: 'Sarath',
      mobile_no: '9876543206',
      total_no_of_order: 5,
      purchase_amount: '10,00,000',
    },
  ];
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
          <Grid>
            <MUHSelectBoxComponent
              selectItems={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
              value={'monthly'}
              onChange={() => {}}
              isCheckbox={false}
              selectWidth={140}
              selectHeight={36}
              borderRadius={8}
              background="#FFFFFF"
              borderColor="#E5E7EB"
              iconColor={theme.Colors.graySecondary}
              placeholderText="Select"
            />
          </Grid>
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

export default TopBuyingTable;
