import { Box, useTheme } from '@mui/material';

type Props = {
  banners: any[];
  currentIndex: number;
  handleClick: (index: number) => void;
};

let dotStyle = {
  width: 13.3,
  height: 13.3,
  borderRadius: '50%',
};

const CarouselDots = ({ banners, currentIndex, handleClick }: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {banners?.map((_, index) => (
        <Box
          key={index}
          onClick={() => handleClick(index)}
          sx={{
            mx: 0.8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentIndex === index ? (
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: `2px solid ${theme.Colors.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  ...dotStyle,
                  backgroundColor: theme.Colors.primary,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                ...dotStyle,
                backgroundColor: '#b0b0b0',
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
export default CarouselDots;
