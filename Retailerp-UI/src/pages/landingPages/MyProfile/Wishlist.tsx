import {
  Box,
  Typography,
  IconButton,
  CardMedia,
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Grid2';
import { wishlistItems } from '@constants/DummyData';
import MUHButtonComponent from '@components/MUHButtonComponent';
import { CrossIcon } from '@assets/Images';

const Wishlist = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Typography
        style={{
          fontWeight: 600,
          marginBottom: 2,
          borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
          width: 'fit-content',

          fontFamily: 'Roboto Slab',
          fontSize: '20px',
        }}
      >
        Wishlist
      </Typography>

      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}
      >
        {wishlistItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3.5 }} key={item.id}>
            <Box
              sx={{
                borderRadius: '12px',

                position: 'relative',
              }}
            >
              <IconButton
                sx={{
                  width: '40px',
                  height: '40px',
                  position: 'absolute',
                  top: 7,
                  right: 10,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: theme.Colors.whitePure },
                }}
              >
                <CrossIcon />
              </IconButton>

              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  width: '100%',

                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />

              <Box sx={{ pt: 2 }}>
                <Typography
                  style={{
                    fontWeight: 400,
                    fontFamily: 'Roboto Slab',
                    fontSize: '20px',
                    marginBottom: 2,
                    color: theme.Colors.black,
                  }}
                  noWrap
                >
                  {item.name}
                </Typography>

                <Typography
                  style={{
                    fontWeight: 600,
                    fontFamily: 'Roboto Slab',
                    fontSize: '20px',
                    marginBottom: 10,
                    color: theme.Colors.primary,
                  }}
                >
                  {item.price}
                </Typography>

                <MUHButtonComponent
                  buttonText="Add to Cart"
                  bgColor="#64232f"
                  buttonTextColor={theme.Colors.whitePrimary}
                  btnWidth="100%"
                  padding="8px 16px"
                  buttonStyle={{
                    fontFamily: 'Roboto Slab',
                    fontSize: '16px',
                    fontWeight: 500,
                    borderRadius: '8px',
                  }}
                  onClick={() => console.log('Added to cart:', item.name)}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Wishlist;
