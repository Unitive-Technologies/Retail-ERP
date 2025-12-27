import { Box, Typography, IconButton, useTheme } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Grid from '@mui/material/Grid2';
import { FacebookIcon2, InstagramIcon2, LandingAppbarLogo, ProjectNameLogo, YoutubeIcon2 } from '@assets/Images';
import {
  FacebookOutlined,
  MarkEmailReadOutlined,
  PhoneInTalk,
} from '@mui/icons-material';
import LinkTextSection from './LinkTextSection';
import { CSSProperties } from 'react';
import MUHTypography from '@components/MUHTypography';

const Footer = () => {
  const theme = useTheme();

  const iconBoxStyle: CSSProperties = {
    background: `linear-gradient(90deg, ${theme.Colors.primaryDarkStart} 0%, ${theme.Colors.primaryDarkEnd} 100%)`,
  };

  const iconStyle: CSSProperties = { color: theme.Colors.whitePrimary };

  return (
    <Box
      sx={{
        mt: 3,
        padding: 2,
      }}
    >
      <Grid
        container
        sx={{
          borderRadius: '20px',
          background: '#FCE0E6',
        }}
      >
        <Grid
          container
          width={'100%'}
          p={{ xs: 1.5, md: 5 }}
          pb={{ xs: 4, md: 6 }}
        >
          <Grid size={{ xs: 12, sm: 12, md: 2.6 }}>
            <Grid
              container
              sx={{
                py: 1.8,
                width: { xs: '60%', md: '83%' },
                borderRadius: { xs: '8.78px', md: '12px' },
                background: GRADIENT_BG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={LandingAppbarLogo}
                width={'62.37px'}
                height={'65.27px'}
              />
              <img
                src={ProjectNameLogo}
                width={'119.03px'}
                height={'44.29px'}
              />
            </Grid>
            <Box mt={3}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: '#1F1F29',
                  fontFamily: 'Roboto Slab',
                }}
              >
                Follow Us On
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <IconButton sx={iconBoxStyle}>
                  <InstagramIcon2 style={iconStyle} />
                </IconButton>
                <IconButton sx={iconBoxStyle}>
                  <FacebookIcon2 style={iconStyle} />
                </IconButton>
                <IconButton sx={iconBoxStyle}>
                  <YoutubeIcon2 style={iconStyle} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 6, md: 2.4 }} mt={{ xs: 2, md: 0 }}>
            <LinkTextSection
              title="Pick Your Perfect Bling"
              linkTexts={billing}
            />
          </Grid>

          <Grid display={{ xs: 'none', md: 'block' }} size={2}>
            <LinkTextSection
              title="Client Relations"
              linkTexts={clientRelations}
            />
          </Grid>

          <Grid display={{ xs: 'none', md: 'block' }} size={1.8}>
            <LinkTextSection title="About Us" linkTexts={about} />
          </Grid>

          <Grid
            size={6}
            display={{ xs: 'block', md: 'none' }}
            mt={{ xs: 2, md: 0 }}
          >
            <LinkTextSection
              title="Client Relations"
              linkTexts={clientRelations}
            />
            <Box mt={{ xs: 2, md: 0 }}>
              <LinkTextSection title="About Us" linkTexts={about} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 3.2 }} mt={{ xs: 2, md: 0 }}>
            <MUHTypography
              text="Contact Us"
              size={18}
              weight={600}
              color={theme.Colors.primaryDarkStart}
            />
            <Box
              display={'flex'}
              gap={{ xs: 1.5, md: 1 }}
              mt={1.5}
              flexDirection={'column'}
            >
              <MUHTypography
                text="Chaneira Jewels"
                size={16}
                weight={600}
                color="#1F1F29"
              />
              <MUHTypography
                text="74/1, W Ponnurangam Rd, R.S. Puram Coimbatore"
                size={16}
                color="#1F1F29"
              />
              <MUHTypography
                text="Tamil Nadu - 641 002"
                size={16}
                color="#1F1F29"
              />
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <PhoneInTalk sx={{ fontSize: '16px', color: '#59212D' }} />
                <MUHTypography
                  text="+91 7010794728"
                  size={16}
                  color="#1F1F29"
                />
              </Box>
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <MarkEmailReadOutlined
                  sx={{ fontSize: '16px', color: '#59212D' }}
                />
                <MUHTypography
                  text="chaneirajewels@gmail.com"
                  size={16}
                  color="#1F1F29"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            background: '#7D3141',
            justifyContent: 'center',
            width: '100%',
            py: 0.5,
            borderBottomRightRadius: '20px',
            borderBottomLeftRadius: '20px',
          }}
        >
          <MUHTypography
            text="@2025. Design & Developed by Unitive Technologies Pvt., Ltd.,"
            weight={500}
            color={theme.Colors.whitePrimary}
            sx={{ fontSize: { xs: '8px', md: '14px' } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;

const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;

const billing = [
  {
    text: 'Jewel Rate',
  },
  {
    text: 'Necklace',
  },
  {
    text: 'Earrings',
  },
  {
    text: 'Bangles',
  },
  {
    text: 'Rings',
  },
  {
    text: 'Anklets',
  },
  {
    text: 'Idols',
  },
];

const clientRelations = [
  {
    text: 'Jewel Care',
  },
  {
    text: 'Return & Refund',
  },
];

const about = [
  {
    text: 'Why Choose Us',
  },
  {
    text: 'Our Journey',
  },
];
