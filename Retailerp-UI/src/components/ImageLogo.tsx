import { useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Button, useTheme, Box } from '@mui/material';
import { LogoUpload } from '@assets/Images';

type ImageUploadProps = {
  labelName: string;
  required?: boolean;
  disabled?: boolean;
  onBrowserButtonClick?: (e: any) => void;
  selectedFile?: string | null;
};

const ImageLogo = ({
  labelName,
  required = true,
  disabled,
  onBrowserButtonClick,
}: ImageUploadProps) => {
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Grid
      container
      sx={{ alignItems: 'center', mb: 2, justifyContent: 'center' }}
    >
      <Grid size={12}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            sx={{
              borderRadius: '100px',
              background: 'rgba(249, 250, 251, 1)',
              height: '150px',
              width: '150px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
            }}
            onClick={handleButtonClick}
            disabled={disabled}
          >
            <img
              src={LogoUpload}
              alt="Upload Icon"
              style={{
                maxWidth: '60%',
                maxHeight: '260%',
                objectFit: 'contain',
              }}
            />
          </Button>

          <Typography
            variant="body2"
            sx={{
              fontSize: theme.MetricsSizes.small_xxx,
              fontFamily: theme.fontFamily.inter,
              fontWeight: theme.fontWeight.medium,
              color: theme.Colors.black,
              marginTop: 2,
              marginLeft: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {labelName}
            {required && (
              <span style={{ color: theme.Colors.redPrimary }}>&nbsp;*</span>
            )}
          </Typography>
        </Box>

        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onBrowserButtonClick}
        />
      </Grid>
    </Grid>
  );
};

export default ImageLogo;
