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
import { Box, Typography, Button, Chip, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

const categoryData = [
  { name: 'Necklace', total: 250, image: <NeckpieceIcon />, width: 395 },
  { name: 'Bangles', total: 236, image: <BangleIcon />, width: 288 },
  { name: 'Silver Coins', total: 124, image: <SilverCoinIcon />, width: 168 },
  { name: 'Kadas', total: 98, image: <KadaIcon />, width: 115 },
  { name: 'Rings', total: 86, image: <RingIcon />, width: 114 },
  { name: 'Earrings', total: 156, image: <EarringIcon />, width: 250 },
  { name: 'Pendants', total: 120, image: <PendandsIcon />, width: 352 },
  { name: 'Bracelets', total: 169, image: <BraceletsIcon />, width: 296 },
  { name: 'Nose Pins', total: 153, image: <NosePinIcon />, width: 230 },
];

const handleViewAllClick = () => {};

const JewellList = () => {
  const theme = useTheme();

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
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontWeight: 500,
            fontSize: '18px',
          }}
        >
          Top Selling Sub Category
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
      </Box>

      <Grid container spacing={2}>
        {categoryData.map((item, i) => (
          <Grid size="auto" key={i}>
            <CategoryCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JewellList;
