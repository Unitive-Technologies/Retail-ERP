import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FeatureBarBackground } from '@assets/Images';
import Grid from '@mui/material/Grid2';
import { featureList } from '@constants/Constance';
import { useTheme } from '@mui/material';

const FeaturesBar = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        mt: 2,
        backgroundColor: theme.Colors.primary,
        backgroundImage: `url(${FeatureBarBackground})`,
        backgroundBlendMode: 'overlay',
        minHeight: '260px',
      }}
    >
      {featureList.map((item, idx) => (
        <Grid container size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '99%',
            }}
          >
            <img src={item.icon} />
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
              gap={1}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.Colors.whitePrimary,
                  fontWeight: 600,
                  fontFamily: 'Roboto Slab',
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: theme.Colors.whitePrimary,
                  fontWeight: 600,
                  fontFamily: 'Roboto Slab',
                }}
              >
                {item.subtitle}
              </Typography>
            </Box>
          </Box>
          {idx !== featureList.length - 1 && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: '#FFFEFE',
                minHeight: { xs: '85px', md: '180px' },
                alignSelf: 'center',
              }}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturesBar;
