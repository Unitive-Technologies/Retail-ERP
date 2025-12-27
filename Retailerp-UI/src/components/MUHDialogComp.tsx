import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { CloseIconDialog, LandScape, Portrait } from '@assets/Images';
import Grid from '@mui/material/Grid2';

type DialogTitlePropsType = {
  // dialogTitle?: string;
  dialogTitle?: string | JSX.Element;
  onPrint?: () => void;
  onDownload?: () => void;
  onClose?: () => void;
  isViewMode?: boolean;
  printIcon?: boolean;
  downloadIcon?: boolean;
  isHeading?: boolean;
  dialogTitleStyle?: React.CSSProperties;
  renderHeader?: () => React.ReactElement;
  onViewModeClick?: () => void;
};

type DialogProp = DialogTitlePropsType & {
  open: boolean;
  avatarImg?: React.ReactNode;
  renderDialogContent?: () => React.ReactElement;
  renderAction?: () => React.ReactNode;
  dialogIcon?: React.ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  dialogTitleStyle?: React.CSSProperties;
  rootStyle?: React.CSSProperties;
  children?: React.ReactNode;
  dialogWidth?: number | string;
  dialogHeight?: number | string;
  renderHeader?: () => React.ReactElement;
  showTitle?: boolean;
  dialogPadding?: string | number;
  contentPadding?: string | number;
  borderRadius?: number;
};

export const DialogTitleComp = ({
  dialogTitle,
  onClose,
  onViewModeClick,
  dialogTitleStyle,
  renderHeader,
  isViewMode = false,
}: DialogTitlePropsType) => {
  const theme = useTheme();
  const [isViewModeOn, setIsViewModeOn] = useState(true);

  // Toggle icon on click
  const handleViewModeClick = () => {
    setIsViewModeOn((prev) => !prev);
    if (onViewModeClick) onViewModeClick();
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container alignItems="center" sx={{ flexGrow: 1 }}>
        {renderHeader && renderHeader()}
        {dialogTitle ? (
          <Typography
            variant="h3"
            sx={{
              fontSize: theme.MetricsSizes.regular_xxx,
              fontWeight: theme.fontWeight.regular,
              color: theme.Colors.black,
              fontFamily: theme.fontFamily.inter,
              paddingBottom: 0.5,
              flex: 1,
              ...dialogTitleStyle,
            }}
          >
            {dialogTitle}
          </Typography>
        ) : null}
      </Grid>
      {isViewMode ? (
        <IconButton onClick={handleViewModeClick}>
          <img src={isViewModeOn ? LandScape : Portrait} alt="view-mode" />
        </IconButton>
      ) : null}

      {onClose ? (
        <IconButton onClick={onClose} disableRipple>
          <img src={CloseIconDialog} />
        </IconButton>
      ) : null}
    </Box>
  );
};

const MUHDialogComp = ({
  open,
  maxWidth,
  onClose,
  dialogTitle,
  dialogTitleStyle,
  isViewMode,
  onViewModeClick,
  renderDialogContent,
  children,
  renderAction,
  dialogWidth,
  dialogHeight,
  isHeading = false,
  renderHeader,
  showTitle = true,
  dialogPadding = '15px 12px 15px 20px',
  contentPadding = 'auto',
  borderRadius = 5
}: DialogProp) => {
  return (
    <Dialog
      open={open}
      maxWidth={maxWidth || 'md'}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: dialogWidth || 947,
            height: dialogHeight || 770,
            borderRadius: borderRadius,
            padding: dialogPadding,
          },
        },
      }}
    >
      {showTitle ? (
        <DialogTitle>
          <DialogTitleComp
            dialogTitle={dialogTitle}
            onClose={onClose}
            isHeading={isHeading}
            dialogTitleStyle={dialogTitleStyle}
            renderHeader={renderHeader}
            isViewMode={isViewMode}
            onViewModeClick={onViewModeClick}
          />
        </DialogTitle>
      ) : null}
      <DialogContent sx={{ padding: contentPadding }}>
        {(renderDialogContent && renderDialogContent()) || children}
      </DialogContent>
      {renderAction && <DialogActions>{renderAction()}</DialogActions>}
    </Dialog>
  );
};

export default MUHDialogComp;
