import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import * as theme from '../../../../theme/schemes/PurelightTheme'

let chevonStyle = {
  fontSize: 32,
  color: theme.Colors.black,
};

const CarouselButton = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      [direction]: 16,
      top: '50%',
      width: '38px',
      height: '50px',
      borderRadius: '8px',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255,255,255,0.7)',
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
    }}
  >
    {direction === 'left' ? (
      <ChevronLeft sx={chevonStyle} />
    ) : (
      <ChevronRight sx={chevonStyle} />
    )}
  </IconButton>
);

export default CarouselButton;
