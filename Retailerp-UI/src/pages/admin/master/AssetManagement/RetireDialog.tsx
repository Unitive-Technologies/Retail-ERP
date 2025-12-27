import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RetireAssetIcon } from '@assets/Images';
import Grid from '@mui/material/Grid2';
import { DualActionButton } from '@components/index';
import DisposalDetailsDialog from './DisposalDetailsDialog';

type RetireDialogProps = {
  open: boolean;
  onClose: () => void;
  onMoveToScrap?: () => void;
  onAssetDisposal?: () => void;
};

const RetireDialog: React.FC<RetireDialogProps> = ({
  open,
  onClose,
  onMoveToScrap,
  onAssetDisposal,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showDisposalDialog, setShowDisposalDialog] = useState(false);

  const handleMoveToScrap = () => {
    navigate('/admin/assetManagement/create/AssetScrap');
  };

  const handleAssetDisposal = () => {
    onClose();

    setShowDisposalDialog(true);
  };

  const handleDisposalDialogClose = () => {
    setShowDisposalDialog(false);

    if (onAssetDisposal) {
      onAssetDisposal();
    }
  };

  const handleDisposalUpdate = () => {
    handleDisposalDialogClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '20px 0',
          }}
        >
          {/* Icon */}

          <RetireAssetIcon />

          {/* Message */}
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: theme.fontWeight.medium,
              fontFamily: theme.fontFamily.roboto,
              color: theme.Colors.black,
              lineHeight: 1.5,
              maxWidth: '400px',
            }}
          >
            You Are About To Retire This Asset. Please Choose How You Want To
            Handle It:
          </Typography>

          {/* Buttons */}
          <Grid container justifyContent={'center'}>
            <DualActionButton
              leftButtonText={'Moved to Scrap'}
              rightButtonText={'Asset Disposal'}
              onLeftButtonClick={handleMoveToScrap}
              onRightButtonClick={handleAssetDisposal}
              rightButtonWidth={'180px'}
              leftButtonWidth="180px"
              rightButtonStyle={{
                border: '1px solid #6D2E3D',
                backgroundColor: '#F3D8D9',
                borderRadius: '8px',
              }}
              rightButtonTextColor="#6D2E3D"
              containerStyle={{ gap: '10px' }}
              leftButtonStyle={{ borderRadius: '8px' }}
            />
          </Grid>
        </DialogContent>
      </Dialog>
      <DisposalDetailsDialog
        open={showDisposalDialog}
        onClose={handleDisposalDialogClose}
        onUpdate={handleDisposalUpdate}
      />
    </>
  );
};

export default RetireDialog;
