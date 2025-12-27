import { useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { HomeBanner1, HomeBanner2 } from '@assets/Images';
import CarouselButton from './CarouselButton';
import CarouselDots from './CarouselDots';

const banners = [HomeBanner1, HomeBanner2];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Grid
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src={banners[currentIndex]}
        alt="banner"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <CarouselButton direction="left" onClick={handlePrev} />
      <CarouselButton direction="right" onClick={handleNext} />
      <CarouselDots
        banners={banners}
        currentIndex={currentIndex}
        handleClick={handleDotClick}
      />
    </Grid>
  );
};

export default Banner;
