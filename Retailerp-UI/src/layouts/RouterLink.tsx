import { Box, List, useTheme } from '@mui/material';
import { RouterLinkProps as LinkProps } from '@utils/util-types';
import RouterLinkItem from './RouterLinkItem';
import { useState } from 'react';

interface RouterLinkProps {
  links: LinkProps[];
  depth: number;
}

const RouterLink = (props: RouterLinkProps) => {
  const theme = useTheme()
  const { links, depth } = props;
  const [openParent, setOpenParent] = useState<string | null>(null);

  return (
    <List
      sx={{
        height: '100%',
        overflowY: 'scroll',
        background: theme.Colors.whitePrimary,
        scrollbarWidth: '0px',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          // my: 1,
          mx: 1,
          overflowY: 'auto',
          background: theme.Colors.whitePrimary,
          scrollbarWidth: '0px',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {links?.map((link) => (
          <RouterLinkItem
            key={link.title}
            link={link}
            depth={depth}
            openParent={openParent}
            setOpenParent={setOpenParent}
          />
        ))}
      </Box>
    </List>
  );
};

export default RouterLink;
