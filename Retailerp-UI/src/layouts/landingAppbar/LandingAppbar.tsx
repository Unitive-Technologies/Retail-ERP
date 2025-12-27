import { useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

export const LandingAppbar = () => {
  const theme = useTheme();
  const [goldRate, setGoldRate] = useState('');

  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: theme.Colors.whitePrimary, borderBottom: '1px solid #DFDFDF' }}
    >
      <Toolbar sx={{ minHeight: '70px', py: 1 }}>
        <Grid
          container
          alignItems="center"
          spacing={1.5}
          width={'100%'}
          wrap="nowrap"
          sx={{
            overflowX: 'scroll',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <LeftContainer />
          <RightContainer goldRate={goldRate} setGoldRate={setGoldRate} />
        </Grid>
      </Toolbar>
    </MuiAppBar>
  );
};
