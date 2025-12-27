import { useState } from 'react';
import ProductCard from '@components/ProductCard';
import Grid from '@mui/material/Grid2';
import DecorativeHeader from './DecorativeHeader';
import { ButtonComponent } from '@components/index';
import { useTheme } from '@mui/material';

type Props = {
  data: any[];
  title: string;
};

const ProductWrapper = ({ data, title }: Props) => {
  const theme = useTheme();

  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? data : data?.slice(0, 4);

  return (
    <Grid
      container
      sx={{ m: { xs: 1.5, md: 5.5 }, justifyContent: 'center', gap: 3 }}
    >
      <DecorativeHeader title={title} />
      <Grid container width={'100%'} spacing={{ xs: 1, md: 3 }}>
        {visibleCategories.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}>
            <ProductCard
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              // navigateTo={`/home/${item.path}`}
            />
          </Grid>
        ))}
      </Grid>

      <ButtonComponent
        buttonText={showAll ? 'View Less' : 'View More'}
        buttonFontSize={16}
        bgColor={theme.Colors.primary}
        buttonTextColor={theme.Colors.whitePrimary}
        buttonFontWeight={600}
        btnBorderRadius={1.7}
        btnHeight={43}
        btnWidth={150}
        onClick={() => setShowAll((prev) => !prev)}
      />
    </Grid>
  );
};

export default ProductWrapper;
