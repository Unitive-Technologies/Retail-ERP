import Grid from '@mui/material/Grid2';
import {
  GridImage1,
  GridImage2,
  GridImage3,
  GridImage4,
} from '@assets/Images/TemporaryImages';
import { CSSProperties } from 'react';

const gridStyle: CSSProperties = { border: '10px solid transparent' };

const imgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '12px',
};

const JewelryView = () => (
  <Grid
    container
    sx={{
      py: { xs: 3, md: 4 },
      px: { xs: 1, md: 3 },
      minHeight: '500px',
    }}
  >
    <Grid size={{ xs: 6, sm: 6, md: 4 }} sx={gridStyle}>
      <img src={GridImage1} style={imgStyle} />
    </Grid>

    <Grid container size={{ xs: 6, sm: 6, md: 8 }}>
      <Grid size={{ xs: 12, md: 6.5 }} sx={gridStyle}>
        <img src={GridImage2} style={imgStyle} />
      </Grid>

      <Grid size={{ xs: 12, md: 5.5 }} sx={gridStyle}>
        <img src={GridImage4} style={imgStyle} />
      </Grid>

      <Grid size={12} display={{ xs: 'none', md: 'block' }} sx={gridStyle}>
        <img src={GridImage3} style={imgStyle} />
      </Grid>
    </Grid>

    <Grid
      size={12}
      display={{ xs: 'block', sm: 'block', md: 'none' }}
      sx={gridStyle}
    >
      <img src={GridImage3} style={imgStyle} />
    </Grid>
  </Grid>
);

export default JewelryView;
