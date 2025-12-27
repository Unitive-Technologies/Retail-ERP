import { Drawer, Divider, Box, useTheme } from '@mui/material';
import RouterLink from './RouterLink';
import Grid from '@mui/material/Grid2';
import { LandingAppbarLogo, ProjectNameLogo } from '@assets/Images';
import { superAdminTabLinks } from '@utils/link-util';
interface SideNavProps {
  drawerWidth: number;
  open: boolean;
}

const superAdminTabs = superAdminTabLinks();

const GRADIENT_BG = `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`;

const SideNav = (props: SideNavProps) => {
  const theme = useTheme();
  const { drawerWidth, open } = props;

  return (
    <nav>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.Colors.grayLight}`
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ...theme.mixins.toolbar,
            minHeight: '60px !important'
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            gap={0.8}
            sx={{
              height: '100%',
              width: '100%',
              background: GRADIENT_BG,
            }}
          >
            <img src={LandingAppbarLogo} />
            <img src={ProjectNameLogo} />
          </Grid>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <RouterLink
          links={superAdminTabs}
          depth={0}
        />
      </Drawer>
    </nav>
  );
};

export default SideNav;
