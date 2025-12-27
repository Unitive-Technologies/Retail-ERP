import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  useTheme,
} from '@mui/material';

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    title: 'UPI Payment',
    description: 'Google Pay, Phone pay, Paytm, BHIM, Super money',
  },
  {
    id: 'debit',
    title: 'Debit Card',
    description: 'Enter your debit card details to pay',
  },
  {
    id: 'credit',
    title: 'Credit Card',
    description: 'Enter your credit card details to pay',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    description: 'Enter you bank credentials to pay',
  },
];

const PaymentCheckout: React.FC = () => {
  const theme = useTheme();
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderBottom: '0px',
            p: 2,
            borderRadius: '12px 12px 0px 0px',
          }}
        >
          <Typography
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.Colors.black,
              fontFamily: 'Roboto Slab',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            SELECT PAYMENT METHOD
          </Typography>
        </Box>

        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            paddingLeft: 5,
            paddingTop: 2,
            borderRadius: '0px 0px 12px 12px',
            height: '470px',
          }}
        >
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedPayment}
              onChange={handlePaymentChange}
              sx={{ gap: 3 }}
            >
              {paymentMethods.map((method) => (
                <FormControlLabel
                  key={method.id}
                  value={method.id}
                  control={
                    <Radio
                      checked={selectedPayment === method.id}
                      sx={{
                        padding: 1,
                        borderBottom: `1px solid #CCCCCC`,
                      }}
                    />
                  }
                  label={
                    <Box sx={{ marginLeft: 1 }}>
                      <Typography
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: theme.Colors.black,
                          fontFamily: 'Roboto Slab',
                          marginBottom: 5,
                        }}
                      >
                        {method.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 400,
                          color: theme.Colors.black,
                          fontFamily: 'Roboto Slab',
                          lineHeight: 1.4,
                        }}
                      >
                        {method.description}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    padding: 1.5,
                    width: { xs: '100%', sm: '100%', md: '130%' },
                    borderBottom: `1px solid ${theme.palette.divider}`,

                    alignItems: 'flex-start',
                  }}
                  disableTypography
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentCheckout;
