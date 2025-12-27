import { useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Button, useTheme } from '@mui/material';
import { FolderIcon, ImageUpload } from '@assets/Images';
import { useTranslation } from 'react-i18next';

type ImageUploadProps = {
  labelName: string;
  required?: boolean;
  disabled?: boolean;
  onBrowserButtonClick?: (e: any) => void;
  selectedFile?: string | null;
};

const MUHBrowserImageUpload = ({
  labelName,
  required = true,
  disabled,
  onBrowserButtonClick,
  selectedFile,
}: ImageUploadProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Grid container sx={{ marginTop: 0.5, alignItems: 'center' }}>
      <Grid size={4.5} sx={{ marginTop: 0.5, scrollPaddingLeft: '6px' }}>
        <Typography
          sx={{
            fontSize: theme.MetricsSizes.small_xxx,
            fontFamily: theme.fontFamily.inter,
            fontWeight: theme.fontWeight.medium,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {labelName}
          {required && (
            <span style={{ color: theme.Colors.redPrimary }}>&nbsp;*</span>
          )}
        </Typography>
      </Grid>

      <Grid sx={{ width: '320px', height: '40px' }}>
        <Button
          variant={selectedFile ? 'contained' : 'outlined'}
          fullWidth
          sx={{
            border: !selectedFile
              ? `2px dashed ${theme.Colors.silverFoilWhite}`
              : 'none',
            backgroundColor: selectedFile
              ? theme.Colors.primary
              : 'transparent',
            color: selectedFile
              ? theme.Colors.whitePrimary
              : theme.Colors.silverFoilWhite,
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            fontSize: theme.MetricsSizes.small_xxx,
            fontFamily: theme.fontFamily.inter,
            fontWeight: theme.fontWeight.medium,
            width: '320px',
          }}
          onClick={handleButtonClick}
          disabled={disabled}
        >
          {!selectedFile ? (
            <>
              <img
                src={ImageUpload}
                alt="Upload Icon"
                style={{ marginRight: '10px' }}
              />
              {t('Common.uploadName')}
            </>
          ) : (
            <span
              style={{
                flex: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '85%',
              }}
            >
              {selectedFile}
            </span>
          )}

          {selectedFile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <img src={FolderIcon} alt="Folder Icon" />
            </div>
          )}
        </Button>

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

export default MUHBrowserImageUpload;
