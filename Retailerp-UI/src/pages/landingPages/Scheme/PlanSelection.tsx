import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormHelperText,
  Button,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SelectBoxComponent, TextInput } from '../../../components/index';
import { PopularIcon } from '@assets/Images';

interface PlanOption {
  value: number;
  label: string;
  isPopular?: boolean;
}

interface PlanSelectionProps {
  onContinue?: (selectedPlan: string, installmentAmount: number) => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    'Golden Promise Plan'
  );
  const theme = useTheme();
  const [installmentAmount, setInstallmentAmount] = useState<number>(3000);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(5000);

  const planOptions = [
    { value: 'Golden Promise Plan', label: 'Golden Promise Plan' },
    { value: 'Silver Promise Plan', label: 'Silver Promise Plan' },
    { value: 'Bronze Promise Plan', label: 'Bronze Promise Plan' },
  ];

  const planAmountOptions: PlanOption[] = [
    { value: 3000, label: '₹3,000' },
    { value: 5000, label: '₹5,000', isPopular: true },
    { value: 10000, label: '₹10,000' },
  ];

  const handleInstallmentAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setInstallmentAmount(value);
  };

  const handlePlanAmountSelect = (amount: number) => {
    setSelectedPlanAmount(amount);
    setInstallmentAmount(amount);
  };

  const calculateTotalSavingAmount = () => {
    return selectedPlanAmount * 11; // 11 months
  };

  const calculateBonusAmount = () => {
    return Math.floor(selectedPlanAmount * 0.05); // 5% bonus
  };

  const calculateTotalAmount = () => {
    return (
      installmentAmount + calculateTotalSavingAmount() + calculateBonusAmount()
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
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
        {/* Header */}
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme.Colors.black,
            fontFamily: 'Roboto Slab',
            textAlign: 'left',
          }}
        >
          SELECT YOUR PLAN
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          padding: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '0px 0px 12px 12px',
        }}
      >
        <Grid
          container
          size={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {/* Plan Selection */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              sx={{
                marginBottom: 1,
                color: theme.Colors.black,
                fontSize: '14px',
                fontWeight: 500,

                fontFamily: 'Roboto Slab',
              }}
            >
              Plan
            </Typography>
            <Grid>
              <SelectBoxComponent
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value)}
                selectItems={planOptions}
                variant="outlined"
                borderRadius={8}
              />
            </Grid>
          </Grid>

          {/* Installment Amount */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: theme.Colors.black,
                fontFamily: 'Roboto Slab',
                marginBottom: 1,
              }}
            >
              Instalment Amount
            </Typography>
            <Grid>
              <TextInput
                type="number"
                value={installmentAmount}
                onChange={handleInstallmentAmountChange}
                fullWidth
              />
              <FormHelperText
                sx={{
                  color: '#F80004',
                  fontSize: '14px',
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                * Min. ₹1000
              </FormHelperText>
            </Grid>
          </Grid>
        </Grid>

        {/* Plan Amount Options */}
        <Box display="flex" gap={2} justifyContent="center" sx={{ mt: 2 }}>
          {planAmountOptions.map((option) => (
            <Box key={option.value} textAlign="center" position="relative">
              <Button
                onClick={() => handlePlanAmountSelect(option.value)}
                sx={{
                  width: 100,
                  height: 40,
                  backgroundColor: '#FDEEF0',
                  color: '#000',
                  borderRadius: option.isPopular ? '8px 8px 0px 0px' : '8px',
                  px: 3,
                  py: 2,
                  fontSize: '16px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
              >
                {option.label}
              </Button>

              {option.isPopular && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    backgroundColor: '#6D2E3D',
                    color: '#fff',
                    px: 1,
                    py: 0.5,
                    borderRadius: '0 0 8px 8px',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontFamily: 'Roboto Slab',
                    width: 100,
                  }}
                >
                  <PopularIcon />
                  Popular
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {/* Plan Summary */}
        <Grid size={12}>
          <Typography
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: theme.Colors.black,
              marginBottom: 2,
              marginTop: 3,
              fontFamily: 'Roboto Slab',
            }}
          >
            Plan Summary
          </Typography>
          <Box sx={{ borderTop: '1px solid #ABABAB', marginY: 1 }} />

          <Box sx={{ marginBottom: 2 }}>
            {/* Installment Amount */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                Instalment Amount
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                ₹{installmentAmount.toLocaleString()}
              </Typography>
            </Box>

            {/* Total Saving Amount */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                Total Saving Amount (11 Months)
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                ₹{calculateTotalSavingAmount().toLocaleString()}
              </Typography>
            </Box>

            {/* Bonus */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                Bonus 5% on 12 Month
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                  fontWeight: 400,
                }}
              >
                ₹{calculateBonusAmount().toLocaleString()}
              </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: '1px solid #e0e0e0', marginY: 1 }} />

            {/* Total Amount */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: theme.Colors.primary,
                  fontWeight: 600,
                  fontFamily: 'Roboto Slab',
                }}
              >
                Total Amount
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: theme.Colors.primary,
                  fontWeight: 700,
                  fontFamily: 'Roboto Slab',
                }}
              >
                ₹{calculateTotalAmount().toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlanSelection;
