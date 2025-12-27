import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from '@components/ProductCard';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
}

interface ProductGridProps {
  products: Product[];

  onProductClick?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/home/earrings/productdetails?id=${productId}`);

    if (onProductClick) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        onProductClick(product);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {products.length === 0 ? (
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
              discount={product.discount}
              originalPrice={product.originalPrice}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;
