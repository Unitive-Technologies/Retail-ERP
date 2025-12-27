import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ImageCropper from '@pages/admin/common/ImageCropper';
import Grid from '@mui/material/Grid2';
import { sectionContainerStyle } from '@components/CommonStyles';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import toast from 'react-hot-toast';
import { HTTP_STATUSES } from '@constants/Constance';
import { API_SERVICES } from '@services/index';

interface Props {
  edit: any;
}

export default function ProductImageSection({ edit }: Props) {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const images = edit.getValue('image_urls') || [];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  // const handleCrop = (croppedFile: File) => {
  //   const croppedUrl = URL.createObjectURL(croppedFile);
  //   const updatedImages = [...images, { file: croppedFile, url: croppedUrl }];
  //   edit.update({ image_urls: updatedImages });
  // };

  // const handleCrop = async (croppedFile: File) => {
  //   try {
  //     const croppedUrl = URL.createObjectURL(croppedFile);
  //     const updatedImages = [...images, { file: croppedFile, url: croppedUrl }];
  //     edit.update({ image_urls: updatedImages });

  //     const formData = new FormData();
  //     formData.append('files', croppedFile);

  //     const uploadImageRes =
  //       await API_SERVICES.ImageUploadService.uploadImage(formData);

  //     const res: any = uploadImageRes;

  //     if (
  //       res?.status < HTTP_STATUSES.BAD_REQUEST &&
  //       res?.data?.data?.images?.length
  //     ) {
  //       const document_url = res.data.data.images[0].Location;

  //       const finalImages = [
  //         ...edit.getValue('image_urls'),
  //         { file: croppedFile, url: document_url },
  //       ];

  //       edit.update({
  //         image_urls: finalImages,
  //       });
  //     } else {
  //       toast.error('Failed to upload image');
  //     }
  //   } catch (err: any) {
  //     toast.error(err?.message || 'Upload failed. Please try again.');
  //   }
  // };

  const handleCrop = async (croppedFile: File) => {
    try {
      const formData = new FormData();
      formData.append('files', croppedFile);

      const uploadImageRes =
        await API_SERVICES.ImageUploadService.uploadImage(formData);
      const res: any = uploadImageRes;

      if (
        res?.status < HTTP_STATUSES.BAD_REQUEST &&
        res?.data?.data?.images?.length
      ) {
        const document_url = res.data.data.images[0].Location;

        const finalImages = [...edit.getValue('image_urls'), document_url];

        edit.update({ image_urls: finalImages });
      } else {
        toast.error('Failed to upload image');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed. Please try again.');
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_: any, i: number) => i !== index);
    edit.update({ image_urls: updated });
  };

  return (
    <Grid width="100%">
      <FormSectionHeader title="Product Image" />
      <Grid
        container
        gap={1}
        sx={{
          ...sectionContainerStyle,
          overflowX: 'scroll',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
          minHeight: '181px',
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.Colors.grayStormDark,
            borderRadius: 8,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.Colors.grayLightDark,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        }}
      >
        <Box
          sx={{
            flex: '0 0 auto',
            width: 123,
            height: 123,
            border: `1px dashed ${theme.Colors.grayBorderDim}`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: theme.Colors.whitePrimaryDark,
          }}
          onClick={() => document.getElementById('imageUploadInput')?.click()}
        >
          <IconButton
            sx={{
              background: theme.Colors.primary,
              width: 24,
              height: 24,
              '&:hover': { backgroundColor: theme.Colors.primary },
            }}
          >
            <Add sx={{ fontSize: 24, color: theme.Colors.whitePrimary }} />
          </IconButton>
        </Box>

        <input
          id="imageUploadInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {images.map((img: any, index: number) => (
          <Grid
            key={index}
            sx={{
              position: 'relative',
              width: 123,
              height: 123,
              flex: '0 0 auto',
            }}
          >
            <Box
              component="img"
              src={img}
              alt="product"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '5px',
                border: `1px solid ${theme.Colors.grayBorderFrame}`,
                objectFit: 'cover',
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemove(index)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 5,
                width: 17,
                height: 17,
                backgroundColor: theme.Colors.primary,
                '&:hover': { backgroundColor: theme.Colors.primary },
              }}
            >
              <Close sx={{ fontSize: 15, color: theme.Colors.whitePrimary }} />
            </IconButton>
          </Grid>
        ))}
      </Grid>

      {selectedFile && (
        <ImageCropper
          file={selectedFile}
          previewUrl={previewUrl}
          onCrop={handleCrop}
          onClose={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
          }}
        />
      )}
    </Grid>
  );
}
