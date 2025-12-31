import { Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { handleExcelDownload } from '@utils/excelDowload-util';
import { handlePdfClick } from '@utils/pdfDownload-util';

import { memo } from 'react';

const MenuDropDown = ({
  anchorEl,
  handleCloseMenu,
  hiddenCols,
  columnMapping,
  pdfData,
  pdfHeaders,
  fileName,
  address,
}: any) => {
  const theme = useTheme();
  const columns = pdfHeaders;

  const settings = [
    {
      Icon: '',
      title: 'PDF',
      handleClick: () => {
        handlePdfClick({
          pdfData,
          pdfHeaders,
          fileName,
          address,
          hiddenCols,
          columnMapping,
        });
        handlePdfClick({ pdfData, pdfHeaders, fileName, address });
        handleCloseMenu();
      },
    },
    {
      Icon: '',
      title: 'Excel',
      handleClick: () => {
        handleExcelDownload({
          columns: columns || [],
          pdfData,
          fileName,
          address,
        });
        handleCloseMenu();
      },
    },
  ];

  return (
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      disableScrollLock={true}
    >
      {settings.map(({ Icon, title, handleClick }: any) => (
        <MenuItem key={title} onClick={handleClick}>
          {Icon && <Icon />}
          <Typography
            textAlign="center"
            sx={{
              ml: theme.Spacing.tiny_xx,
              fontWeight: theme.fontWeight.regular,
              fontSize: theme.MetricsSizes.small_x3,
              color: theme.Colors.blackPrimary,
            }}
          >
            {title}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default memo(MenuDropDown);
