import {
  BangleIcon,
  BraceletsIcon,
  EarringIcon,
  KadaIcon,
  NeckpieceIcon,
  NosePinIcon,
  PendandsIcon,
  RingIcon,
  SilverCoinIcon,
} from '@assets/Images';
import CategoryCard from '@components/CategoryCardComponent';
import {
  Box,
  Typography,
  Button,
  Chip,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { KeyboardArrowDown } from '@mui/icons-material';
import React from 'react';

const categoryData = [
  {
    name: 'Necklace',
    metricLabel: 'Weight-',
    metricValue: 180,
    metricUnit: ' Kg',
    image: <NeckpieceIcon />,
  },
  {
    name: 'Bangles',
    metricLabel: 'Weight-',
    metricValue: 120,
    metricUnit: ' Kg',
    image: <BangleIcon />,
  },
  {
    name: 'Silver Coins',
    metricLabel: 'Weight - ',
    metricValue: 105,
    metricUnit: ' Kg',
    image: <SilverCoinIcon />,
  },
  {
    name: 'Kadas',
    metricLabel: 'Weight - ',
    metricValue: 68,
    metricUnit: ' Kg',
    image: <KadaIcon />,
  },
  {
    name: 'Rings',
    metricLabel: 'Weight - ',
    metricValue: 62,
    metricUnit: ' Kg',
    image: <RingIcon />,
  },
  {
    name: 'Earrings',
    metricLabel: 'Weight - ',
    metricValue: 89,
    metricUnit: ' Kg',
    image: <EarringIcon />,
  },
  {
    name: 'Pendants',
    metricLabel: 'Weight - ',
    metricValue: 145,
    metricUnit: ' Kg',
    image: <PendandsIcon />,
  },
  {
    name: 'Bracelets',
    metricLabel: 'Weight - ',
    metricValue: 112,
    metricUnit: ' Kg',
    image: <BraceletsIcon />,
  },
];

const filterOptions = ['Weekly', 'Monthly', 'Quarterly'];

const PurchaseByCategory = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = React.useState('Monthly');

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        padding: 3,
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={600} fontSize="18px">
          Purchase By Category
        </Typography>

        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDown />}
          onClick={handleFilterClick}
          sx={{
            borderRadius: '24px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            borderColor: '#E5E7EB',
            color: theme.Colors.black,
            px: 2,
            minWidth: 130,
          }}
        >
          {selectedFilter}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleFilterSelect(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Grid container spacing={2}>
        {categoryData.map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            <CategoryCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PurchaseByCategory;
