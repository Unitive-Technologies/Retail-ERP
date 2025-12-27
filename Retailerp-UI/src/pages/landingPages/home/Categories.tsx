import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@components/ProductCard';
import Grid from '@mui/material/Grid2';
import DecorativeHeader from './DecorativeHeader';
import { ButtonComponent, Loader } from '@components/index';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Category = {
  id: number;
  category_name: string;
  category_image_url: string;
};

type CategoriesProps = {
  data: Category[];
  isLoading?: boolean;
};

const Categories = ({ data, isLoading = false }: CategoriesProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousShowAll = useRef(showAll);

  const categories = useMemo(() => data?.filter(Boolean) || [], [data]);

  const visibleCategories = useMemo(() => {
    const items = showAll ? categories : categories?.slice(0, 8);
    return items || [];
  }, [categories, showAll]);

  useEffect(() => {
    if (!showAll && previousShowAll.current && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    previousShowAll.current = showAll;
  }, [showAll]);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/home/category/${categoryId}`);
  };

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <Grid
      container
      ref={containerRef}
      sx={{
        m: { xs: 1.5, md: 5.5 },
        mx: { xs: 1.5, md: 8 },
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <DecorativeHeader title="Shop by Category" />
      <Grid container width={'100%'} spacing={{ xs: 1, md: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
            }}
          >
            <Loader />
          </Box>
        ) : visibleCategories.length ? (
          visibleCategories.map((item) => (
            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}>
              <ProductCard
                id={String(item.id)}
                image={item.category_image_url || ''}
                category={item.category_name}
                showFavIcon={false}
                showPrice={false}
                imageHeight={280}
                onClick={(cardId) => handleCategoryClick(Number(cardId))}
              />
            </Grid>
          ))
        ) : null}
      </Grid>

      {categories.length > 8 && (
        <ButtonComponent
          buttonText={showAll ? 'View Less' : 'View More'}
          buttonFontSize={16}
          bgColor={theme.Colors.primary}
          buttonTextColor={theme.Colors.whitePrimary}
          buttonFontWeight={600}
          btnBorderRadius={1.7}
          btnHeight={43}
          btnWidth={150}
          onClick={handleToggleShowAll}
        />
      )}
    </Grid>
  );
};

export default Categories;
