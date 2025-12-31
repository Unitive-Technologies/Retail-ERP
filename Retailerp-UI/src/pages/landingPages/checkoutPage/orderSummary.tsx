import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { formatCurrency } from '@constants/AmountFormats';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shippingFee: number;
  deliveryFee: number;
  total: number;
}

const OrderSummaryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
}));

const Row = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const GrandTotalRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 700,
}));

const TextStyle = styled(Typography)(() => ({
  fontFamily: 'Roboto Slab',
}));

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  deliveryFee,
  shippingFee,
  total,
}) => {
  return (
    <OrderSummaryContainer>
      <TextStyle variant="h6">Order Summary</TextStyle>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #CCCCCC',
          padding: '8px',
          gap: '8px',
          borderRadius: '8px',
        }}
      >
        <Row>
          <TextStyle sx={{ color: '#303030' }}>Sub Total</TextStyle>
          <TextStyle>{formatCurrency(subtotal)}</TextStyle>
        </Row>
        <Row>
          <TextStyle sx={{ color: '#303030' }}>Discount</TextStyle>
          <TextStyle>{formatCurrency(discount)}</TextStyle>
        </Row>
        <Row>
          <TextStyle sx={{ color: '#303030' }}>Delivery Fee</TextStyle>
          <TextStyle style={{ color: 'green' }}>
            {deliveryFee ? formatCurrency(deliveryFee) : 'FREE'}
          </TextStyle>
        </Row>
        <Row>
          <TextStyle sx={{ color: '#303030' }}>Shipping Fee</TextStyle>
          <TextStyle style={{ color: 'green' }}>
            {' '}
            {shippingFee ? formatCurrency(shippingFee) : 'FREE'}
          </TextStyle>
        </Row>

        <GrandTotalRow>
          <TextStyle sx={{ color: '#7F3242' }}>Grand Total</TextStyle>
          <TextStyle sx={{ color: '#7F3242' }}>
            {formatCurrency(total)}
          </TextStyle>
        </GrandTotalRow>
      </Box>
    </OrderSummaryContainer>
  );
};

export default OrderSummary;
