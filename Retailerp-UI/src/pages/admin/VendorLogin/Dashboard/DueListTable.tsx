import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useTheme, Box, Typography, Chip, Tooltip } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { useState } from 'react';

const dueListData = [
  {
    id: 1,
    date: '31/10/2025',
    grn_id: 'GRN 85/24-25',
    invoice_id: 'INV 58/24-25',
    total_amount: '₹25,487',
    received_amount: '₹20,229',
    due_amount: '₹5,258',
  },
  {
    id: 2,
    date: '30/10/2025',
    grn_id: 'GRN 84/24-25',
    invoice_id: 'INV 58/24-25',
    total_amount: '₹52,114',
    received_amount: '₹49,589',
    due_amount: '₹2,525',
  },
  {
    id: 3,
    date: '30/10/2025',
    grn_id: 'GRN 81/24-25',
    invoice_id: 'INV 58/24-25',
    total_amount: '₹32,419',
    received_amount: '₹0.00',
    due_amount: '₹32,419',
  },
  {
    id: 4,
    date: '30/10/2025',
    grn_id: 'GRN 72/24-25',
    invoice_id: 'INV 42/24-25',
    total_amount: '₹3,10,030',
    received_amount: '₹1,13,000',
    due_amount: '₹1,97,030',
  },
  {
    id: 5,
    date: '29/10/2025',
    grn_id: 'GRN 68/24-25',
    invoice_id: 'INV 42/24-25',
    total_amount: '₹5,10,010',
    received_amount: '₹2,61,510',
    due_amount: '₹2,48,500',
  },
];

const DueListTable = () => {
  const theme = useTheme();
  const [loading] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'grn_id',
      headerName: 'GRN ID',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
            gap: 1,
          }}
        >
          <Tooltip title={params.value}>
            <Typography
              sx={{
                color: theme.Colors.primary,
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },

    { field: 'invoice_id', headerName: 'Invoice ID', flex: 1, sortable: false },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 1,
      sortable: false,
    },
    {
      field: 'received_amount',
      headerName: 'Received Amount',
      flex: 1,
      sortable: false,
    },
    { field: 'due_amount', headerName: 'Due Amount', flex: 1, sortable: false },
  ];

  return (
    <>
      <Grid container width="100%" mt={1.2}>
        {/* Header */}
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
            sx={{
              fontSize: theme.MetricsSizes.regular_x,
              fontFamily: theme.fontFamily.inter,
              fontWeight: theme.fontWeight.mediumBold,
              color: theme.Colors.blackPrimary,
            }}
          >
            Due List
          </Typography>

          <Chip
            label="View All"
            sx={{
              backgroundColor: '#F4F7FE',
              color: theme.Colors.primary,
              borderRadius: '12px',
              fontWeight: theme.fontWeight.mediumBold,
              cursor: 'pointer',
              px: 1.5,
            }}
          />
        </Grid>

        {/* Table */}
        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns}
            rows={dueListData}
            loading={loading}
            rowHeight={52}
            isPagination={false}
            isCheckboxSelection={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DueListTable;
