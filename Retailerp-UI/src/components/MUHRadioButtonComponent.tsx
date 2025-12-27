import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { Typography, useTheme } from '@mui/material';

const MUHRadioButtonComponent = ({
  selectedValue,
  handleChange,
}: any) => {
  const theme = useTheme();
  return (
    <FormControl>
      <Stack
        direction="row"
        alignItems="center"
        spacing={3}
        sx={{ marginTop: 1 }}
      >
        <Typography variant="h6">Is Manager?</Typography>
        <RadioGroup row value={selectedValue} onChange={handleChange}>
          <FormControlLabel
            value={true}
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: theme.Colors.primary,
                  },
                }}
              />
            }
            label="Yes"
            sx={{
              marginLeft: 1,
              fontSize: theme.MetricsSizes.small_xxx,
              fontWeight: theme.fontWeight.medium,
              color: theme.Colors.black,
              fontFamily: theme.fontFamily.inter,
            }}
            disableTypography
          />
          <FormControlLabel
            value={false}
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: theme.Colors.primary,
                  },
                }}
              />
            }
            label="No"
            sx={{
              marginLeft: 2,
              fontSize: theme.MetricsSizes.small_xxx,
              fontWeight: theme.fontWeight.medium,
              color: theme.Colors.black,
              fontFamily: theme.fontFamily.inter,
            }}
            disableTypography
          />
        </RadioGroup>
      </Stack>
    </FormControl>
  );
};

export default MUHRadioButtonComponent;
