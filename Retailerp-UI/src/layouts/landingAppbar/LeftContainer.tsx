import Grid from '@mui/material/Grid2';
import { LandingAppbarLogo, ProjectNameLogo, SearchIcon } from '@assets/Images';
import MUHTextInput from '@components/MUHTextInput';
import { InputAdornment, Box } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;
const DARK_TEXT = '#2D2D2D';

const LeftContainer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        sx={{
          minWidth: { xs: '107px', md: '200px' },
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            navigate('/home');
          }}
          sx={{
            height: { xs: 32.1, md: 57 },
            borderRadius: { xs: '5.35px', md: '10px' },
            background: GRADIENT_BG,
            px: { xs: 1, md: 2 },
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={LandingAppbarLogo}
            sx={{
              width: { xs: '27px', md: 'auto' },
              height: { xs: '27px', md: 'auto' },
            }}
          />
          <Box
            component="img"
            src={ProjectNameLogo}
            sx={{
              width: { xs: '50px', md: 'auto' },
              height: { xs: '18px', md: 'auto' },
              ml: { xs: 0.5, md: 1 },
            }}
          />
        </Grid>
      </Grid>

      {/* Hide search input on mobile (xs and sm), show on md and up */}
      <Grid
        size={{ md: 2.8, lg: 3 }}
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
        }}
      >
        <MUHTextInput
          placeholderText="Search product"
          placeholderColor={DARK_TEXT}
          placeholderFontSize={14}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    style={{ color: DARK_TEXT, opacity: 0.8, p: 0.3 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          padding={0.01}
          fontSize={14}
          fontWeight={400}
          height={40}
          borderColor="#595959"
        />
      </Grid>
    </>
  );
};

export default LeftContainer;
