import { createElement } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  useTheme,
  Grid2,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import * as Icons from '@mui/icons-material';
import { CONFIRM_MODAL } from '@constants';
import { ButtonComponent } from '.';
import { DeleteIcon, DownloadOrReplace } from '@assets/Images';

const MUHConfirmModal = ({
  iconType,
  description,
  title,
  open,
  onCancelClick,
  onConfirmClick,
  rightBtnText,
  leftBtnText,
  renderDialogContent,
  isButton = true,
}: any) => {
  const theme = useTheme();

  const types = {
    [CONFIRM_MODAL.delete]: {
      icon: Icons.DeleteOutlineSharp,
    },
    [CONFIRM_MODAL.cancel]: {
      icon: Icons.CancelOutlined,
    },

    [CONFIRM_MODAL.logout]: {
      icon: Icons.ExitToApp,
    },
    [CONFIRM_MODAL.create]: {
      icon: Icons.Done,
    },
    [CONFIRM_MODAL.edit]: {
      icon: Icons.Edit,
    },
    [CONFIRM_MODAL.done]: {
      icon: Icons.Done,
    },
    [CONFIRM_MODAL.warning]: {
      icon: Icons.PriorityHighRounded,
    },
    [CONFIRM_MODAL.downloadReplace]: {
      icon: DownloadOrReplace,
    },
  };
  const iconData = types[iconType];

  const renderIcon = () => {
    if (!iconType) {
      return null;
    }
    return (
      <Box display="flex" justifyContent="center">
        <div
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            marginBottom: 14,
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.Colors.secondaryLight,
          }}
        >
          {typeof iconData.icon === 'string' ? (
            <img
              src={iconData.icon}
              alt={iconType}
              style={{ width: 20, height: 20 }}
            />
          ) : (
            createElement(types[iconType].icon, {
              style: { color: theme.Colors.primary },
              fontSize: 'large',
            })
          )}
        </div>
      </Box>
    );
  };

  return (
    <Dialog open={open} fullWidth maxWidth={'xs'}>
      <DialogTitle>
        {renderIcon()}
        <Typography
          align="center"
          variant="inherit"
          sx={{
            fontSize: 20,
            fontWeight: theme.fontWeight.mediumBold,
            fontFamily: theme.fontFamily.inter,
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: 'inline-grid' }}>
        <Typography
          variant="descriptionLabel"
          sx={{
            textAlign: 'center',
            color: theme.Colors.blueGray,
            fontSize: theme.MetricsSizes.small_xxx,
            textWrap: 'wrap',
            fontWeight: theme.fontWeight.medium,
            fontFamily: theme.fontFamily.inter,
          }}
        >
          {description}
        </Typography>
        {renderDialogContent ? renderDialogContent() : null}
      </DialogContent>
      {isButton ? (
        <DialogActions
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            paddingBottom: 2,
          }}
        >
          <Grid2>
            <ButtonComponent
              buttonText={leftBtnText || 'Yes'}
              buttonTextColor={theme.Colors.whitePrimary}
              onClick={onConfirmClick}
              btnWidth={80}
              btnHeight={30}
              buttonFontSize={theme.MetricsSizes.small_x3}
              buttonFontWeight={theme.fontWeight.medium}
              buttonStyle={{
                fontFamily: theme.fontFamily.roboto,
              }}
              padding={'2px'}
            />
          </Grid2>
          <Grid2>
            <ButtonComponent
              buttonText={rightBtnText || 'Cancel'}
              padding={'2px'}
              btnWidth={80}
              btnHeight={30}
              buttonTextColor={theme.Colors.primary}
              onClick={onCancelClick}
              bgColor={theme.Colors.whitePrimary}
              border={` 1px solid ${theme.Colors.dustyGray}`}
              buttonFontSize={theme.MetricsSizes.small_x3}
              buttonStyle={{

                fontFamily: theme.fontFamily.roboto,
              }}
            />
          </Grid2>
        </DialogActions>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent={'center'}
          sx={{ padding: 2 }}
        >
          <ButtonComponent
            buttonText={leftBtnText || 'Close'}
            buttonTextColor={theme.palette.common.white}
            btnWidth="fit-content"
            onClick={onConfirmClick}
            border={` 1px solid ${theme.Colors.dustyGray}`}
          />
        </Grid>
      )}
    </Dialog>
  );
};

export default MUHConfirmModal;
