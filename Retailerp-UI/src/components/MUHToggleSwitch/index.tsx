import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Switch from 'react-switch';
import './switchStyles.css';
import { Breakpoints } from '../../theme/schemes/PurelightTheme';

const MUHToggleSwitch = ({
  checked,
  handleChange,
  leftLabel,
  rightLabel,
  labelStyle,
  isLanding = false,
}: {
  checked: boolean;
  handleChange: () => void;
  leftLabel?: string;
  rightLabel?: string;
  labelStyle?: React.CSSProperties;
  isLanding?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={2}
      justifyContent={'center'}
      alignItems={'center'}
      alignContent={'center'}
      p={2}
    >
      {leftLabel ? (
        <Grid>
          <Typography
            // variant="h2"
            sx={{
              fontSize: isLanding
                ? theme.MetricsSizes.regular_xxx
                : theme.MetricsSizes.regular_xx,
              fontWeight: isLanding
                ? theme.fontWeight.medium
                : theme.fontWeight.bold,
              color: theme.Colors.black,
              fontFamily: isLanding
                ? theme.fontFamily.poppins
                : theme.fontFamily.inter,
              [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
                fontSize: isLanding
                  ? theme.MetricsSizes.regular_xxx
                  : theme.MetricsSizes.regular_xx,
              },
              [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
                fontSize: theme.MetricsSizes.regular_x,
              },
              [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
                fontSize: theme.MetricsSizes.regular,
              },
              [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
                fontSize: theme.MetricsSizes.small_xxx,
              },
              [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
                fontSize: theme.MetricsSizes.small_xxx,
              },
              ...labelStyle,
            }}
          >
            {leftLabel}
          </Typography>
        </Grid>
      ) : null}
      <Grid container>
        <Switch
          onChange={handleChange}
          checked={checked}
          onColor={theme.Colors.primary}
          offColor={theme.Colors.primary}
          onHandleColor={'red'}
          handleDiameter={window?.innerWidth <= 600 ? 13 : 15}
          checkedIcon={false}
          uncheckedIcon={false}
          width={window.innerWidth <= 600 ? 38 : 40}
          height={window.innerWidth <= 600 ? 19 : 21}
          className="switch"
        />
      </Grid>
      {rightLabel ? (
        <Grid sx={{ paddingLeft: window.innerWidth <= 600 ? 2 : 0.5 }}>
          <Typography
            // variant="body1"
            sx={{
              fontSize: isLanding
                ? theme.MetricsSizes.regular_xxx
                : theme.MetricsSizes.regular_xx,
              fontWeight: isLanding
                ? theme.fontWeight.medium
                : theme.fontWeight.bold,
              color: theme.Colors.black,
              fontFamily: isLanding
                ? theme.fontFamily.poppins
                : theme.fontFamily.inter,
              [`@media screen and (max-width: ${Breakpoints.values.xl}px)`]: {
                fontSize: isLanding
                  ? theme.MetricsSizes.regular_xxx
                  : theme.MetricsSizes.regular_xx,
              },
              [`@media screen and (max-width: ${Breakpoints.values.lg}px)`]: {
                fontSize: theme.MetricsSizes.regular_x,
              },
              [`@media screen and (max-width: ${Breakpoints.values.md}px)`]: {
                fontSize: theme.MetricsSizes.regular,
              },
              [`@media screen and (max-width: ${Breakpoints.values.sm}px)`]: {
                fontSize: theme.MetricsSizes.small_xxx,
              },
              [`@media screen and (max-width: ${Breakpoints.values.xs}px)`]: {
                fontSize: theme.MetricsSizes.small_xxx,
              },
              ...labelStyle,
            }}
          >
            {rightLabel}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default MUHToggleSwitch;
