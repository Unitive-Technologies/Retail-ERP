import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';

type Prop = {
  disabled?: boolean;
  renderIcon?: () => React.ReactNode;
  text: string;
  onClick: (val?: never) => void;
};

type RowActionProp = {
  open: boolean;
  selectedActionRow: any;
  rowActions: Prop[];
  handleClose: () => void;
  anchorEl: null | HTMLElement;
};

const MenuActionComp = (props: RowActionProp) => {
  const theme = useTheme();
  const { open, selectedActionRow, rowActions, handleClose, anchorEl } = props;

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        elevation={0}
        disableScrollLock={true}
        PaperProps={{
          style: {
            minWidth: 150,
            marginLeft: '13px',
            marginTop: '10px',
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        {rowActions?.map((action, index) => (
          <MenuItem
            key={index}
            disabled={action.disabled}
            onClick={() => action.onClick(selectedActionRow)}
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.Colors.black,
              fontFamily: 'Roboto-Regular',
              borderBottom:
                index === rowActions.length - 1 ? 'none' : '1px solid #E5E5E5',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {action.renderIcon && (
                <div style={{ display: 'flex' }}>{action.renderIcon()}</div>
              )}
              {action.text}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuActionComp;
