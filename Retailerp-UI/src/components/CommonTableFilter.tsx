import { Box, useTheme } from '@mui/material';
import MUHTextInput from './MUHTextInput';
import { ClearRounded } from '@mui/icons-material';
import { FilterIcon } from '@assets/Images';
import MUHMenuList from './MUHMenuList';
import { useState } from 'react';
import * as theme from '../theme/schemes/PurelightTheme';
import { isNoSpace } from '@utils/form-util';

const iconBox = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.Colors.grayBorderLight}`,
  cursor: 'pointer',
};

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  onSearchChange?: (text: string) => void;
  placeholderText?: string;
};

const CommonTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onSearchChange,
  placeholderText = 'Search...',
}: Props) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ minWidth: '200px' }}>
        <MUHTextInput
          placeholderText={placeholderText}
          placeholderColor={theme.Colors.blackLightLow}
          placeholderFontSize={12.5}
          fontSize={12.5}
          fontWeight={400}
          fontFamily="Roboto-Regular"
          height={28}
          borderRadius={1.6}
          borderColor={theme.Colors.grayBorderLight}
          value={edit?.getValue('search')}
          onChange={(e: any) => {
            const value = e.target.value;
            if (!isNoSpace(value)) return;
            edit?.update({ search: value });
            onSearchChange && onSearchChange(value);
          }}
        />
      </Box>
      <MUHMenuList
        open={open}
        selectItems={selectItems}
        handleClose={handleClose}
        handleSelectValue={handleSelectValue}
        anchorEl={anchorEl}
        selectedValue={selectedValue}
      />
      <Box
        sx={{
          ...iconBox,
          ':hover': {
            borderColor: theme.Colors.primary,
          },
        }}
        onClick={handleClickFilter}
      >
        <img src={FilterIcon} width={14} height={14} />
      </Box>
      <Box
        sx={{
          ...iconBox,
          ':hover': {
            borderColor: theme.Colors.primary,
          },
        }}
        onClick={handleFilterClear}
      >
        <ClearRounded
          sx={{ fontSize: '18px', color: theme.Colors.blackLightLow }}
        />
      </Box>
    </>
  );
};

export default CommonTableFilter;
