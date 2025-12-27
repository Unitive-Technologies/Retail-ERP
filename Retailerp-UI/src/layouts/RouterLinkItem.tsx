import { NavLink, useLocation } from 'react-router-dom';
import {
  Collapse,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
} from '@mui/material';
import { RouterLinkProps as LinkProps } from '@utils/util-types';
import RouterLink from './RouterLink';
import { Circle, KeyboardArrowDown } from '@mui/icons-material';

interface RouterLinkItemProps {
  link: LinkProps;
  depth: number;
  openParent: string | null;
  setOpenParent: any;
}

const RouterLinkItem = (props: RouterLinkItemProps) => {
    const theme = useTheme();

  const { link, depth, openParent, setOpenParent } = props;
  const location = useLocation();

  const isActive =
    (link.path && location.pathname.startsWith(link.path)) ||
    (link.children &&
      link.children.some((child) =>
        location.pathname.startsWith(child.path || '')
      ));

  const renderWithCollapse = () => {
    const isOpen = openParent === link.title;

    const handleOnClick = () => {
      setOpenParent(isOpen ? null : link.title);
    };

    return (
      <Box>
        <ListItemButton
          onClick={handleOnClick}
          sx={{
            background: isActive ? theme.Colors.secondaryLight : 'transparent',
            color: isActive ? theme.Colors.primaryDarkStart : 'inherit',
            borderRadius: '4px',
            paddingRight: '10px',
            height: '40px',
            ':hover': {
              background: theme.Colors.secondaryLight,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 26,
              color: isActive ? theme.Colors.primaryDarkStart : theme.Colors.black,
            }}
          >
            {isActive && link.IconActive ? (
              <link.IconActive />
            ) : link.Icon ? (
              <link.Icon />
            ) : null}
          </ListItemIcon>
          <ListItemText
            primary={link.title}
            sx={{
              fontWeight: 400,
              fontSize: 14,
              color: isActive ? theme.Colors.primaryDarkStart : theme.Colors.black,
            }}
            disableTypography
          />
          <IconButton
            sx={{
              width: '20px',
              height: '20px',
              background: isActive ? '#FCE0E6' : theme.Colors.grayLightLow,
              // ':hover': {
              //  background: 'transparent'
              // },
            }}
          >
            <KeyboardArrowDown
              sx={{
                transform: isOpen ? 'rotate(360deg)' : 'rotate(260deg)',
                transition: '0.3s',
                color: isOpen ? theme.Colors.primaryDarkStart : theme.Colors.black,
                fontSize: '20px',
              }}
            />
          </IconButton>
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto">
          <RouterLink links={link.children || []} depth={depth + 1.5} />
        </Collapse>
      </Box>
    );
  };

  const renderWithNavLink = () => {
    return (
      <NavLink
        to={link.path || ''}
        style={({ isActive }) => ({
          minHeight: link.isParent ? '40px' : '32px',
          textDecoration: 'none',
          // color: isActive ? '#FF742F' : 'black',
        })}
      >
        {({ isActive }) => (
          <Box
            sx={{
              pl: depth * 1,
            }}
          >
            <ListItemButton
              sx={{
                borderRadius: '4px',
                width: '100%',
                height: link.isParent ? '40px' : '32px',
                marginLeft: 0,
                color: isActive ? theme.Colors.primary : theme.Colors.black,
                background:
                  link.isParent && isActive ? theme.Colors.secondaryLight : 'transparent',
                ':hover': {
                  background: link.isParent ? theme.Colors.secondaryLight : 'none',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: link.isParent ? 25 : 20,
                  color: isActive ? theme.Colors.primary : theme.Colors.black,
                }}
              >
                {isActive && link.IconActive ? (
                  <link.IconActive />
                ) : link.Icon ? (
                  <link.Icon />
                ) : (
                  <Circle sx={{ fontSize: '6px' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={link.title}
                sx={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: isActive ? theme.Colors.primary : theme.Colors.black,
                  ':hover': {
                    color: theme.Colors.primary,
                  },
                  marginLeft: 0,
                  paddingLeft: 0,
                }}
                disableTypography
              />
            </ListItemButton>
          </Box>
        )}
      </NavLink>
    );
  };

  return <>{link.children ? renderWithCollapse() : renderWithNavLink()}</>;
};

export default RouterLinkItem;
