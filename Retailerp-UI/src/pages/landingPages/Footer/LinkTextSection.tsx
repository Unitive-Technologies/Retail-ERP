import MUHTypography from '@components/MUHTypography';
import { Box, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = {
  title: string;
  linkTexts: any[];
};

const LinkTextSection = ({ title, linkTexts }: Props) => {
  const theme = useTheme();

  return (
    <Box>
      <MUHTypography
        text={title}
        size={18}
        weight={600}
        color={theme.Colors.primaryDarkStart}
      />
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, md: 1 },
          mt: 2,
        }}
      >
        {linkTexts.map((item) => {
          return (
            <MUHTypography
              text={item.text}
              size={18}
              color="#1F1F29"
              sx={{ cursor: 'pointer' }}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

export default LinkTextSection;
