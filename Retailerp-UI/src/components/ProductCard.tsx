import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
} from '@mui/icons-material';
import { FavoriteHeartIcon } from '@assets/Images';

interface ProductCardProps {
  id: string;
  name?: string;
  price?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
  onClick?: (id: string) => void;
  showFavIcon?: boolean;
  showPrice?: boolean;
  imageHeight?: number | string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  discount,
  originalPrice,
  onClick,
  showFavIcon = true,
  showPrice = true,
  imageHeight,
}) => {
  const theme = useTheme();

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '9.73px',
        border: 'none',
        boxShadow: 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={name || category || 'product image'}
        onClick={() => onClick?.(id)}
        sx={{
          width: '100%',
          ...(imageHeight ? { height: imageHeight } : {}),
          objectFit: 'cover',
          cursor: 'pointer',
          borderRadius: '9.73px',
        }}
      />

      {showFavIcon ? (
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: theme.Colors.whitePrimary,

            color: isFavorite ? '#e91e63' : '#666',

            '&:hover': {
              backgroundColor: theme.Colors.whitePrimary,
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFavorite ? <FavoriteFilledIcon /> : <FavoriteHeartIcon />}
        </IconButton>
      ) : null}

      {isNew ? (
        <Chip
          label="NEW"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: '#4caf50',
            color: theme.Colors.whitePrimary,
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      ) : null}

      {discount ? (
        <Chip
          label={`${discount}% OFF`}
          size="small"
          sx={{
            position: 'absolute',
            top: isNew ? 44 : 12,
            left: 12,
            backgroundColor: '#f44336',
            color: theme.Colors.whitePrimary,
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      ) : null}

      {/* Product Details */}
      <CardContent
        sx={{
          p: 1,
          '&:last-child': {
            pb: 2,
          },
        }}
      >
        {/* Category */}
        {category ? (
          <Typography
            style={{
              color: theme.Colors.black,
              fontWeight: 400,
              fontSize: '20px',
              fontFamily: 'Roboto Slab',

              textAlign: 'center',
            }}
          >
            {category}
          </Typography>
        ) : null}

        {/* Product Name */}
        <Typography
          style={{
            color: theme.Colors.black,
            fontWeight: 400,
            fontSize: '20px',
            fontFamily: 'Roboto Slab',
          }}
        >
          {name}
        </Typography>

        {/* Price Section */}
        {showPrice && price != null ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                color: theme.Colors.primary,
                fontWeight: 600,
                fontSize: '20px !important',
                fontFamily: 'Roboto Slab',
              }}
            >
              ₹{price?.toLocaleString()}
            </Typography>

            {originalPrice && originalPrice > price ? (
              <Typography
                sx={{
                  color: theme.Colors.primary,
                  fontWeight: 600,
                  fontSize: '20px !important',
                  fontFamily: 'Roboto Slab',
                }}
              >
                ₹{originalPrice.toLocaleString()}
              </Typography>
            ) : null}
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
