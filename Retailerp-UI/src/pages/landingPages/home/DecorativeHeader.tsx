import { TitleLineLeft, TitleLineXSLeft } from '@assets/Images';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MUHTypography from '@components/MUHTypography';

const DecorativeHeader = ({ title }: { title: string }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 2,
    }}
  >
    <Grid display={{ xs: 'none', md: 'block' }}>
      <img src={TitleLineLeft} />
    </Grid>

    {/* <Grid display={{ xs: 'block', md: 'none' }}>
      <img src={TitleLineXSLeft} />
    </Grid> */}

    <MUHTypography
      text={title}
      weight={600}
      color="#653934"
      sx={{
        fontFamily: 'Roboto Slab',
        fontSize: { xs: '26px', md: '28px' },
        px: { xs: 1.2, md: 2 },
      }}
    />

    <Grid display={{ xs: 'none', md: 'block' }}>
      <img src={TitleLineLeft} style={{ transform: 'rotate(180deg)' }} />
    </Grid>

    {/* <Grid display={{ xs: 'block', md: 'none' }}>
      <img src={TitleLineXSLeft} style={{ transform: 'rotate(180deg)' }} />
    </Grid> */}
  </Box>
);

export default DecorativeHeader;
