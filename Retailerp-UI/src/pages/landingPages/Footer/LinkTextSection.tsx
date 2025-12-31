import MUHTypography from '@components/MUHTypography';
import { Box, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type LinkItem = {
  id?: string | number;
  text: string;
};

type Props = {
  title: string;
  linkTexts: LinkItem[];
  titleSx?: object;
  linkTextStyle?: object;
};

const LinkTextSection = ({ title, linkTexts, titleSx, linkTextStyle }: Props) => {
  const theme = useTheme();

  return (
    <Box>
      <MUHTypography
        text={title}
        size={18}
        weight={600}
        color={theme.Colors.primaryDarkStart}
        sx={titleSx}
      />

      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, md: 1 },
          mt: 2,
        }}
      >
        {linkTexts.map((item, index) => (
          <MUHTypography
            key={item.id ?? `${item.text}-${index}`} // ✅ UNIQUE & SAFE
            text={item.text}
            size={18}
            color="#1F1F29"
            sx={{ cursor: 'pointer', ...linkTextStyle }}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default LinkTextSection;
