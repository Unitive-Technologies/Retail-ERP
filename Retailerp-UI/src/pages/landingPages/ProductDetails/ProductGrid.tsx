import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from '@components/ProductCard';
import MUHLoader from '@components/MUHLoader';
import { useNavigate } from 'react-router-dom';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  onProductClick?: (product: any) => void;
  onWishlistClick?: (productId: number, currentWishlistStatus: boolean) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  onProductClick,
  onWishlistClick,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(
      `/home/${products[0]?.category
        .replace(/[^a-z0-9]/g, '')
        .replace(/-+/g, '')
        .replace(/^-|-$/g, '')
        .toLowerCase()}/productdetails?id=${Number(productId)}`
    );

    if (onProductClick) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        onProductClick(product);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {loading ? (
        <MUHLoader />
      ) : products.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}
        >
          No products found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
            // gap: {
            //   xs: 2,
            //   sm: 2,
            //   md: 2.5,
            //   lg: 1.5,
            //   xl: 0,
            // },
            gap: 2.5,
            justifyItems: 'center',
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              isNew={product.isNew}
              is_wishlisted={product.is_wishlisted}
              imageHeight={300}
              userId={0} // TODO: Get from auth context
              productId={Number(product.id)}
              productItemId={Number(product.product_item_id)}
              skuId={product.sku_id || 'SKU_' + product.id}
              discount={product.discount}
              originalPrice={product.originalPrice}
              onClick={() => handleProductClick(product.id)}
              onWishlistClick={onWishlistClick}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;
