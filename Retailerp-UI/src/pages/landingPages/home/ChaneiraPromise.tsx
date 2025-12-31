import Grid from '@mui/material/Grid2';
import { Box, Typography, useTheme } from '@mui/material';
import { PromiseBackground, PromiseStars, ShopImage } from '@assets/Images';
import MUHTypography from '@components/MUHTypography';

const ChaneiraPromise = () => {
  const theme = useTheme();

  const promiseFeatures = [
    {
      id: 1,
      title: 'Premium Quality Silver',
      description:
        'Crafted using the finest 92.5% pure silver for lasting shine and durability',
    },
    {
      id: 2,
      title: 'Elegant & Timeless Designs',
      description:
        'A perfect blend of traditional charm and modern aesthetics.',
    },
    {
      id: 3,
      title: 'Trust & Transparency',
      description:
        'Clear pricing, certified products, and honest craftsmanship',
    },
    {
      id: 4,
      title: 'Customer-Centric Approach',
      description:
        'Personalized service, easy exchanges, and a team that truly cares.',
    },
  ];

  return (
    <Grid
      container
      sx={{
        mt: 3,
        p: 6,
        flexDirection: { xs: 'column', md: 'row' },
        px: { xs: 4, md: 8 },
        width: '100%',
        backgroundImage: `url(${PromiseBackground})`,
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '26px', md: '28px' },
          color: theme.Colors.primary,
          fontFamily: 'Roboto Slab',
          pl: 1,
          mb: 4,
          display: { xs: 'block', md: 'none' },
        }}
      >
        The Chaneira Promise
      </Typography>
      <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
        <img src={ShopImage} width={'100%'} height={'100%'} />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 12, md: 7, lg: 7 }}
        p={{ xs: '0px', md: '35px 0px 10px 50px' }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: theme.Colors.primary,
            fontFamily: 'Roboto Slab',
            p: 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          The Chaneira Promise
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 5.5 }}>
          {promiseFeatures.map((feature, index) => (
            <Box
              key={feature.id}
              sx={{
                display: 'flex',
                gap: { xs: 0.0, md: 2 },
                p: 1,
                alignItems:'center',
                overflow:'hidden',
                borderRadius: '150px',
                border: `1px solid ${theme.Colors.primaryDarkEnd}`,
                background:
                  index % 2 === 0
                    ? `linear-gradient(91.03deg, #F3E6C6 0%, ${theme.Colors.whitePrimary} 70%)`
                    : `linear-gradient(91.03deg, ${theme.Colors.whitePrimary} 30%, #F3E6C6 100%)`,
              }}
            >
              {index % 2 === 0 ? (
                <Box
                  component="img"
                  src={PromiseStars}
                  sx={{
                    width: '100px',
                    height: '100px',
                    [theme.breakpoints.down('md')]: {
                      width: '50px',
                      height: '50px',
                    },
                  }}
                />
              ) : null}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  borderRadius: '150px',
                }}
              >
                <MUHTypography
                  text={feature.title}
                  weight={600}
                  color={theme.Colors.black}
                  sx={{
                    textAlign:'center',
                    fontSize: { xs: '13px', md: '18px' },
                    mb: 0.7,
                  }}
                />
                <MUHTypography
                  text={feature.description}
                  weight={400}
                  color={theme.Colors.black}
                  sx={{
                    textAlign:'center',
                    fontSize: { xs: '11px', md: '16px' },
                  }}
                />
              </Box>
              {index % 2 !== 0 ? (
                <Box
                  component="img"
                  src={PromiseStars}
                   sx={{
                    width: '100px',
                    height: '100px',
                    [theme.breakpoints.down('md')]: {
                      width: '50px',
                      height: '50px',
                    },
                  }}
                ></Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChaneiraPromise;
