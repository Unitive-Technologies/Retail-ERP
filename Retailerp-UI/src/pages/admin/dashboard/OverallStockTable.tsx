import Grid from '@mui/material/Grid2';
import { MUHTable } from '@components/index';
import { GridColDef } from '@mui/x-data-grid';
import { useTheme, Box, Typography, Chip, Avatar } from '@mui/material';
import {
  contentLayout,
  CommonFilterAutoSearchProps,
} from '@components/CommonStyles';
import { useState } from 'react';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { ClearRounded } from '@mui/icons-material';
import { overallStockData } from '@constants/DummyData';

const OverallStockTable = () => {
  const theme = useTheme();
  const [loading] = useState(false);
  const [selectedGold, setSelectedGold] = useState<any | null>({
    label: 'Gold',
    value: 'gold',
  });
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const goldOptions = [
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
  ];

  const categoryOptions = [
    { label: 'Earrings', value: 'earrings' },
    { label: 'Idols', value: 'idols' },
    { label: 'Rings', value: 'rings' },
  ];

  const iconBox = {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.Colors.grayBorderLight}`,
    cursor: 'pointer',
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'S. No',
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'branch_name',
      headerName: 'Branch Name',
      flex: 1.4,
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
          <Avatar src={row.category_image} sx={{ width: 36, height: 36 }} />
          <Typography fontWeight={500}>{row.category_name}</Typography>
        </Box>
      ),
    },
    {
      field: 'sub_category',
      headerName: 'Sub Category',
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
          <Avatar src={row.sub_category_image} sx={{ width: 36, height: 36 }} />
          <Typography fontWeight={500}>{row.sub_category}</Typography>
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
  ];
  const handleCategoryClear = () => {
    setSelectedCategory(null);
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
            Overall Stock
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

        {/* Filters Section */}
        <Grid
          container
          size={12}
          bgcolor="#FFFFFF"
          sx={{
            paddingX: 2,
            paddingY: 1.5,
            border: '1px solid #E5E7EB',
            borderTop: 'none',
            borderBottom: 'none',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <Grid size={1.5}>
            <AutoSearchSelectWithLabel
              options={goldOptions}
              placeholder="Gold"
              value={selectedGold}
              onChange={(_e, value) => setSelectedGold(value)}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid
            size={1.5}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box sx={{ flex: 1 }}>
              <AutoSearchSelectWithLabel
                options={categoryOptions}
                placeholder="Category"
                value={selectedCategory}
                onChange={(_e, value) => setSelectedCategory(value)}
                {...CommonFilterAutoSearchProps}
              />
            </Box>
            <Box
              sx={{
                ...iconBox,
                '&:hover': {
                  borderColor: theme.Colors.primary,
                },
              }}
              onClick={handleCategoryClear}
            >
              <ClearRounded
                sx={{ fontSize: '18px', color: theme.Colors.blackLightLow }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container sx={contentLayout}>
          <MUHTable
            columns={columns}
            rows={overallStockData}
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

export default OverallStockTable;
