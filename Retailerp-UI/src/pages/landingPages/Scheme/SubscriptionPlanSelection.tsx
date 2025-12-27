import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  SelectChangeEvent,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MUHButtonComponent from '../../../components/MUHButtonComponent';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: '8px',
}));

interface PaymentOptionProps {
  selected: boolean;
  theme?: Theme;
}

const PaymentOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<PaymentOptionProps>(({ theme, selected }) => ({
  padding: theme.spacing(1),
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'center',
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const SubscriptionPlanSelection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(3000);

  const handlePlanChange = (event: SelectChangeEvent) => {
    setSelectedPlan(event.target.value);
  };

  const calculateSummary = () => {
    const monthlyAmount = parseInt(selectedPayment.toString());
    return {
      installmentAmount: monthlyAmount,
      totalSaving: monthlyAmount * 11, // 11 months
      bonus: Math.floor(monthlyAmount * 0.05), // 5% bonus
      totalAmount: monthlyAmount * 11 + Math.floor(monthlyAmount * 0.05),
    };
  };

  const summary = calculateSummary();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Basic Details
        </Typography>
        <StyledPaper>
          {/* Plan Details Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Plan Details
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Plan</InputLabel>
              <Select
                value={selectedPlan}
                label="Plan"
                onChange={handlePlanChange}
              >
                <MenuItem value="golden">Golden Promise Plan</MenuItem>
                <MenuItem value="silver">Silver Promise Plan</MenuItem>
                <MenuItem value="bronze">Bronze Promise Plan</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Installment Amount"
              value={installmentAmount}
              onChange={(e) => setInstallmentAmount(e.target.value)}
              placeholder="Min ₹1000"
            />
          </Box>

          {/* KYC Details Placeholder */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              KYC Details
            </Typography>
          </Box>

          {/* Payment Checkout Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Checkout
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {[3000, 5000, 10000].map((amount) => (
                <PaymentOption
                  key={amount}
                  selected={selectedPayment === amount}
                  onClick={() => setSelectedPayment(amount)}
                >
                  <Typography variant="h6">
                    ₹{amount.toLocaleString()}
                  </Typography>
                </PaymentOption>
              ))}
            </Box>
          </Box>

          {/* Plan Summary Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Plan Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Installment Amount</Typography>
                <Typography>
                  ₹{summary.installmentAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total Saving Amount (11 Months)</Typography>
                <Typography>₹{summary.totalSaving.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Bonus 5% 12 Month</Typography>
                <Typography>₹{summary.bonus.toLocaleString()}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <Typography>Total Amount</Typography>
                <Typography>₹{summary.totalAmount.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MUHButtonComponent onClick={() => {}} variant="contained">
          Continue
        </MUHButtonComponent>
      </Box>
    </Box>
  );
};

export default SubscriptionPlanSelection;
