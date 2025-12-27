import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, useTheme } from '@mui/material';
import { commonTextInputProps } from '@components/CommonStyles';
import { DragDropUpload, styles } from '@components/index';
import MUHTypography from '@components/MUHTypography';
import MUHTextArea from '@components/MUHTextArea';
import FormAction from '@components/ProjectCommon/FormAction';
import { CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

type DisposalDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
};

/* eslint-disable react/prop-types */
const DisposalDetailsDialog: React.FC<DisposalDetailsDialogProps> = ({
  open,
  onClose,
  onUpdate,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [reason, setReason] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleCancel = () => {
    navigate('/admin/assetManagement/create/AssetScrap');
  };

  const handleUpdate = () => {};

  const onBrowseClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    let previewURL = '';
    previewURL = URL.createObjectURL(file);

    setUploadedFile(file);
    setUploadedImageUrl(previewURL);
  };

  const handleDeleteImage = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedFile(null);
    setUploadedImageUrl(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          padding: '0',
          minWidth: '600px',
          maxWidth: '800px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Grid
          flexDirection={'row'}
          sx={{
            width: '100%',

            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <CardContent
            sx={{
              p: 3,

              borderBottom: `1px solid ${theme.Colors.grayLight}`,
            }}
          >
            <MUHTypography
              size={'16px'}
              weight={600}
              sx={{
                fontFamily: 'Roboto-regular',
                backgroundColor: theme.Colors.whitePrimary,
              }}
            >
              DISPOSAL DETAILS
            </MUHTypography>
          </CardContent>
          <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid size={{ xs: 8 }} sx={styles.leftItem}>
              <DragDropUpload
                labelText="Upload Document"
                fileName={uploadedFile?.name}
                image_url={uploadedImageUrl}
                onBrowseButtonClick={(e) => onBrowseClick(e)}
                handleDeleteImage={() => handleDeleteImage()}
              />
            </Grid>
            <Grid size={{ xs: 8.3 }} sx={styles.leftItem}>
              <MUHTextArea
                label="Reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                minRows={4}
                maxRows={6}
                width={'540px'}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          gap: 2,
        }}
      >
        <FormAction
          firstBtntxt="Update"
          secondBtntx="Cancel"
          handleCancel={handleCancel}
          handleCreate={handleUpdate}
          {...commonTextInputProps}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DisposalDetailsDialog;
