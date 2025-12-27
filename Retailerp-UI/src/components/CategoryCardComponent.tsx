import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

interface CategoryCardProps {
  item: {
    name: string;
    total: number;
    image: string | React.ReactNode;
    width?: number | string;
  };
}

const CategoryCard = ({ item }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isReactComponent = React.isValidElement(item.image);
  const showNameBelow =
    item.name.toLowerCase() === 'kadas' || item.name.toLowerCase() === 'rings';

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: item.width,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: showNameBelow ? 'column' : 'row',
        alignItems: 'center',
        gap: 3,
        height: 170,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: '#fff',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Box>
        {isReactComponent ? (
          <Box>{item.image}</Box>
        ) : (
          <img src={item.image as string} alt={item.name} />
        )}
      </Box>

      <Box
        sx={{ flex: 1, minWidth: 0, marginLeft: showNameBelow ? 0 : '16px' }}
      >
        <Typography
          style={{
            fontWeight: isHovered ? 500 : 500,
            fontSize: isHovered ? 20 : 16,
            marginBottom: 4,
            color: '#000000',
            transition: 'all 0.2s ease',
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </Typography>

        <Typography
          style={{
            fontWeight: isHovered ? 600 : 600,
            fontSize: isHovered ? 18 : 14,
            color: '#000000',
            transition: 'all 0.2s ease',
            lineHeight: 1.2,
          }}
        >
          Total - {item.total}
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryCard;
