import {
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';

type menuProps = {
  open: boolean;
  selectItems: any[];
  handleClose: () => void;
  handleSelectValue: (val: any) => void;
  anchorEl: null | HTMLElement;
  selectedValue: any[];
};

const MUHMenuList = ({
  selectItems,
  handleClose,
  handleSelectValue,
  open,
  anchorEl,
  selectedValue,
}: menuProps) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      elevation={0}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        style: {
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        },
      }}
      disableScrollLock={true}
    >
      {selectItems?.length &&
        selectItems?.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value}
            sx={{
              zIndex: 10,
              backgroundColor: theme.Colors.whitePrimary,
              px: 1.5,
              py: 0.2,
            }}
            onClick={() => handleSelectValue(item)}
          >
            <ListItemIcon style={{ alignItems: 'center' }}>
              <Checkbox
                checked={
                  selectedValue?.includes(item?.headerName) ? false : true
                }
              />
              <ListItemText
                primary={item.headerName}
                sx={{ paddingLeft: theme.Spacing.tiny_x }}
              />
            </ListItemIcon>
          </MenuItem>
        ))}
    </Menu>
  );
};

export default MUHMenuList;
