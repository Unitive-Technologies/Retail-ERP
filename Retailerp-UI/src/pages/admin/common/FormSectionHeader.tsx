import React from 'react';
import { Box, Switch, SwitchProps, SxProps, Theme } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

interface FormSectionHeaderProps {
  title: string;
  fontWeight?: number;
  isSwith?: boolean;
  handleSwitch?: () => void;
  isAddOn?: boolean;
  sx?: SxProps<Theme>;
  rightContent?: React.ReactNode;
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 2,
    transitionDuration: '200ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#F3D8D9',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#C7C7C7',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 50,
    backgroundColor: '#EDEDED',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 200,
    }),
  },
}));

const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({
  title,
  fontWeight = 600,
  isSwith = false,
  handleSwitch,
  isAddOn,
  sx,
  rightContent,
}) => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        background: theme.Colors.whitePrimary,
        border: `1px solid ${theme.Colors.grayLight}`,
        fontSize: '14.5px',
        fontWeight: fontWeight,
        color: theme.Colors.black,
        fontFamily: theme.fontFamily.roboto,
        py: 1,
        px: 2,
        ...sx,
      }}
    >
      <span>{title}</span>
      {(rightContent || isSwith) && (
        <Box display="flex" alignItems="center" gap={1}>
          {rightContent}
          {isSwith ? (
            <IOSSwitch checked={isAddOn} onClick={() => handleSwitch?.()} />
          ) : null}
        </Box>
      )}
    </Grid>
  );
};

export default FormSectionHeader;
