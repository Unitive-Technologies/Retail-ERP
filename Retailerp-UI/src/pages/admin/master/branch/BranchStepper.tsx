import React from 'react';
import { Box, useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import {
  BranchProfileIcon,
  InvoiceSettingsIcon,
} from '@assets/Images/AdminImages';

interface BranchStepperProps {
  activeTab: number;
  handleTabClick: (id: number) => void;
  type?: string | null;
  invoiceStepEnabled?: boolean;
}

const BranchStepper: React.FC<BranchStepperProps> = ({
  activeTab,
  handleTabClick,
  type,
  invoiceStepEnabled,
}) => {
  const theme = useTheme();

  const isInvoiceStepAccessible =
    invoiceStepEnabled !== undefined ? invoiceStepEnabled : type === 'edit';

  const steps = [
    { id: 1, label: 'Profile', Icon: BranchProfileIcon },
    {
      id: 2,
      label: 'Invoice Setting',
      Icon: InvoiceSettingsIcon,
      disabled: !isInvoiceStepAccessible,
    },
  ];

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
      {steps.map((step, index) => {
        const isActive = activeTab === step.id;
        const IconComp = step.Icon;
        const isDisabled = step.disabled;

        return (
          <React.Fragment key={step.id}>
            <Box
              display={step.id === 1 ? 'flex' : 'block'}
              flexDirection="column"
              alignItems="center"
              onClick={() => !isDisabled && handleTabClick(step.id)}
              sx={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              <Box
                width={58}
                height={58}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: isActive
                    ? `linear-gradient(100deg, ${theme.Colors.primaryDarkStart} 0%, ${theme.Colors.primaryDarkEnd} 100%)`
                    : theme.Colors.whitePrimary,
                  border: isActive ? 'none' : `2px solid ${theme.Colors.black}`,
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                <IconComp
                  style={{
                    color: isActive
                      ? theme.Colors.whitePrimary
                      : theme.Colors.black,
                  }}
                />
              </Box>

              <MUHTypography
                text={step.label}
                family="Roboto-Medium"
                size={18}
                weight={500}
                color={isActive ? theme.Colors.primary : theme.Colors.black}
                mt={1}
                sx={{
                  ...(step.id === 2 && { ml: -2 }),
                  opacity: isDisabled ? 0.5 : 1,
                }}
              />
            </Box>

            {index < steps.length - 1 && (
              <Box
                width="28%"
                height={'2px'}
                mb={3}
                sx={{
                  borderTop: '1px dashed transparent',
                  borderImage:
                    'repeating-linear-gradient(to right, black 0 9px, transparent 9px 15px) 16',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default BranchStepper;
