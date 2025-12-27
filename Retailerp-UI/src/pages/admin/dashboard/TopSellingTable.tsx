import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useTheme, Box, Typography, Chip, Avatar } from '@mui/material';
import { contentLayout } from '@components/CommonStyles';
import { useEffect, useState } from 'react';
import { topSellingData } from '@constants/DummyData';

const TopSellingTable = () => {
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
      field: 'category_name',
      headerName: 'Category Name',
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
            gap: 1,
          }}
        >
          <Avatar src={row.image} sx={{ width: 36, height: 36 }} />
          <Typography fontWeight={500}>{row.category_name}</Typography>
        </Box>
      ),
    },

    {
      field: 'weight',
      headerName: 'Weight',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.9,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: 'total_sales',
      headerName: 'Total Sales Value',
      flex: 1.2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            py: 1,
          }}
        >
          <Typography>₹ {row.total_sales}</Typography>
        </Box>
      ),
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
              backgroundColor: '#F2F2F2',
              borderRadius: '12px',
              px: 1.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#D4D4D4',
              },
            }}
          />
        </Grid>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns}
            rows={topSellingData}
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

export default TopSellingTable;
