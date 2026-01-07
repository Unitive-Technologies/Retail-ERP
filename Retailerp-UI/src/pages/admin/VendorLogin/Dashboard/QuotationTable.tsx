import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import {
  useTheme,
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { useEffect, useState } from 'react';

const quotationReceivedData = [
  {
    id: 1,
    request_date: '12/02/2025',
    qr_id: 'QR 54/24-25',
    expiry_date: '16/02/2025',
    item_details: 'Pendant, Earrings',
    quantity: 52,
  },
  {
    id: 2,
    request_date: '15/02/2025',
    qr_id: 'QR 54/24-25',
    expiry_date: '15/02/2025',
    item_details: 'Pendant, Earrings',
    quantity: 52,
  },
  {
    id: 3,
    request_date: '20/02/2025',
    qr_id: 'QR 54/24-25',
    expiry_date: '20/02/2025',
    item_details: 'Pendant, Earrings, Anklet',
    quantity: 52,
  },
  {
    id: 4,
    request_date: '25/02/2025',
    qr_id: 'QR 54/24-25',
    expiry_date: '25/02/2025',
    item_details: 'Pendant, Earrings',
    quantity: 52,
  },
  {
    id: 5,
    request_date: '03/03/2025',
    qr_id: 'QR 54/24-25',
    expiry_date: '03/03/2025',
    item_details: 'Pendant, Earrings',
    quantity: 52,
  },
];

const QuotationTable = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'request_date',
      headerName: 'Request Date',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            lineHeight: 1.1,
          }}
        >
          <Tooltip title={params.value || ''} placement="bottom">
            <Typography
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },

    {
      field: 'qr_id',
      headerName: 'OR ID',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            lineHeight: 1.1,
          }}
        >
          <Tooltip title={params.value || ''} placement="bottom">
            <Typography
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },

    {
      field: 'expiry_date',
      headerName: 'Expiry Date',
      flex: 1.3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            lineHeight: 1.1,
          }}
        >
          <Tooltip title={params.value || ''} placement="bottom">
            <Typography
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'item_details',
      headerName: 'Iteam Details',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            lineHeight: 1.1,
          }}
        >
          <Tooltip title={params.value || ''} placement="bottom">
            <Typography
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
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
              fontSize: theme.MetricsSizes.regular_x,
              fontFamily: theme.fontFamily.inter,
              color: theme.Colors.blackPrimary,
              fontWeight: theme.fontWeight.mediumBold,
            }}
          >
            Top Selling Categories
          </Typography>

          <Chip
            label="View All"
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
            columns={columns}
            rows={quotationReceivedData}
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

export default QuotationTable;
