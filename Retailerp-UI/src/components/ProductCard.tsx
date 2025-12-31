import React, { useCallback } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
  styled,
} from '@mui/material';
import { Favorite as FavoriteFilledIcon } from '@mui/icons-material';
import { FavoriteHeartIcon } from '@assets/Images';

// Styled Components
const StyledCard = styled(Card)(() => ({
  width: '100%',
  border: 'none',
  boxShadow: 'none',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
}));

interface StyledIconButtonProps {
  isFavorite: boolean;
}

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isFavorite',
})<StyledIconButtonProps>(({ theme, isFavorite }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: theme.Colors.whitePrimary,
  color: isFavorite ? '#e91e63' : '#666',
  '&:hover': {
    backgroundColor: theme.Colors.whitePrimary,
    transform: 'scale(1.1)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: theme.Colors.primary,
  color: theme.Colors.whitePrimary,
  fontWeight: 'bold',
  fontSize: '0.7rem',
  '&.discount-chip': {
    left: 'auto',
    right: 12,
    backgroundColor: '#f44336',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  color: theme.Colors.black,
  fontWeight: 600,
  fontSize: '1.1rem',
  fontFamily: 'Roboto Slab',
}));

const OriginalPriceText = styled(Typography)(({ theme }) => ({
  color: theme.Colors.primary,
  textDecoration: 'line-through',
  fontSize: '0.9rem',
  fontFamily: 'Roboto Slab',
}));

const CategoryText = styled(Typography)(({ theme }) => ({
  color: theme.Colors.primary,
  fontFamily: 'Roboto Slab',
  fontSize: '20px',
  textAlign: 'center',
  fontWeight: 500,
}));

const ProductNameText = styled(Typography)(({ theme }) => ({
  color: theme.Colors.black,
  fontFamily: 'Roboto Slab',
  fontSize: '20px',
}));

interface ProductCardProps {
  id: string;
  name?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  discount?: number;
  showFavIcon?: boolean;
  showPrice?: boolean;
  imageHeight?: string | number;
  onClick?: (id: string) => void;
  // Additional props for wishlist API
  userId?: number;
  productId?: number;
  productItemId?: number;
  skuId?: string;
  is_wishlisted?:boolean;
  onWishlistClick?: (productId: number, currentWishlistStatus: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  originalPrice,
  image,
  isNew = false,
  discount,
  showFavIcon = true,
  showPrice = true,
  imageHeight,
  onClick,
  productId,
  is_wishlisted, // Add is_wishlisted prop
  onWishlistClick,
}) => {
  
  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onWishlistClick && productId) {
        onWishlistClick(productId, is_wishlisted || false);
      }
    },
    [productId, is_wishlisted, onWishlistClick]
  );

  const handleCardClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  return (
    <StyledCard onClick={handleCardClick}>
      <CardMedia
        component="img"
        image={image}
        alt={name || category || 'product image'}
        onClick={() => onClick?.(id)}
        sx={{
          width: '100%',
          ...(imageHeight ? { height: imageHeight } : {}),
          objectFit: 'fill',
          cursor: 'pointer',
          borderRadius: '9.73px',
          // Mobile styles
          '@media (max-width: 600px)': {
            width: '100%',
            height: '155px',
            margin: '0 auto',
            display: 'block',
          },
        }}
      />

      {showFavIcon && (
        <StyledIconButton onClick={handleFavoriteClick} isFavorite={is_wishlisted || false}>
          {is_wishlisted ? <FavoriteFilledIcon /> : <FavoriteHeartIcon />}
        </StyledIconButton>
      )}

      {isNew && <StyledChip label="NEW" size="small" />}

      {discount ? (
        <StyledChip
          className="discount-chip"
          label={`${discount}% OFF`}
          size="small"
        />
      ) : null}

      <StyledCardContent>
        {category ? <CategoryText>{category}</CategoryText> : null}
        {name ? <ProductNameText>{name}</ProductNameText> : null}

        {showPrice && price != null ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PriceText>₹{price?.toLocaleString()}</PriceText>
            {originalPrice && originalPrice > price ? (
              <OriginalPriceText>
                ₹{originalPrice.toLocaleString()}
              </OriginalPriceText>
            ) : null}
          </Box>
        ) : null}
      </StyledCardContent>
    </StyledCard>
  );
};

export default ProductCard;
