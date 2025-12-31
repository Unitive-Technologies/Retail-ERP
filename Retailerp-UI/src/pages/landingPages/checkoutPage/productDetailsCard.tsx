import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatCurrency } from '@constants/AmountFormats';
import { ProductItemDetails, ProductList } from 'response';

interface ProductDetailsCardProps {
  product?: ProductList;
  quantity: number;
  productItems: ProductItemDetails;
  onIncrease: () => void;
  onDecrease: () => void;
}

const Card = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ContentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  background: '#FBFBFB',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  border: '1px solid #CCCCCC',
}));

const ProductInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const QuantityControls = styled(Box)(({ theme }) => ({
  gap: 10,
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  borderRadius: theme.spacing(1),
  border: '1px solid #C3C3C3',
}));

const ProductImage = styled('img')(() => ({
  width: 130,
  height: 130,
  borderRadius: 6,
  objectFit: 'fill' as const,
}));

const ProductNameBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const PriceWeightBox = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const ProductNameTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontFamily: 'Roboto Slab',
}));

const PriceTypography = styled(Typography)(() => ({
  color: '#7a1c2d',
  fontFamily: 'Roboto slab',
  fontWeight: 600,
}));

const WeightTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto slab',
  textAlign: 'end' as const,
}));

const QtyTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto slab',
}));

const QuantityIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.Colors.primaryDarkEnd,
  borderRadius: '50%',
  width: 15,
  height: 15,
  minWidth: 'unset',
  '&:hover': {
    backgroundColor: theme.Colors.primaryDarkEnd,
  },
}));

const QuantityTypography = styled(Typography)(() => ({
  mx: 1,
  fontSize: '14px',
  fontWeight: 400,
  fontFamily: 'Roboto Slab',
  minWidth: '20px',
  textAlign: 'center',
}));

const CardTitleTypography = styled(Typography)(() => ({
  fontFamily: 'Roboto Slab',
}));

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  product,
  quantity,
  productItems,
  onIncrease,
  onDecrease,
}) => {
  const theme = useTheme();
  
  const firstItemPrice = productItems?.price_details?.selling_price || 0;
  
  const formatWeight = (weight: string | number | undefined): string => {
    if (!weight) return '0';
    
    const weightStr = typeof weight === 'number' ? weight.toString() : weight;
    
    if (weightStr.endsWith('.000')) {
      return weightStr.replace('.000', '.00');
    }
    
    return weightStr;
  };
  return (
    <Card>
      <CardTitleTypography variant="h6">Product Details</CardTitleTypography>
      <ContentRow>
        <ProductImage src={product?.image_urls[0]} alt={product?.product_name} />
        <ProductInfo>
          <ProductNameBox>
            <ProductNameTypography>{product?.product_name}</ProductNameTypography>
            <PriceWeightBox>
              <PriceTypography>{formatCurrency(firstItemPrice)}</PriceTypography>
              <WeightTypography>Weight: {formatWeight(productItems?.net_weight)} g </WeightTypography>
            </PriceWeightBox>
          </ProductNameBox>

          <QuantityControls>
            <QtyTypography>Qty</QtyTypography>
            <QuantityIconButton size="small" onClick={onDecrease}>
              <RemoveIcon
                sx={{ fontSize: '12px', color: theme.Colors.whitePrimary }}
              />
            </QuantityIconButton>
            <QuantityTypography>{quantity}</QuantityTypography>
            <QuantityIconButton size="small" onClick={onIncrease}>
              <AddIcon
                sx={{ fontSize: '12px', color: theme.Colors.whitePrimary }}
              />
            </QuantityIconButton>
          </QuantityControls>
        </ProductInfo>
      </ContentRow>
    </Card>
  );
};

export default ProductDetailsCard;
