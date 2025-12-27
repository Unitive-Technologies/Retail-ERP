import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogActions, DialogContent, useTheme } from '@mui/material';
import { ButtonComponent } from '@components/index';

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  crop: any,
  width: number,
  height: number,
  fileType: string
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas is empty'));
    }, fileType);
  });
}

export default function ImageCropper({
  file,
  onClose,
  onCrop,
  previewUrl,
}: any) {
  const theme = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleDone = async () => {
    const imageUrl = URL.createObjectURL(file);
    const croppedBlob = await getCroppedImg(
      imageUrl,
      croppedAreaPixels,
      600,
      600,
      file
    );
    if (croppedBlob) {
      onCrop(new File([croppedBlob], file.name, { type: 'image/jpeg' }));
    }
    onClose();
  };

  return (
    <Dialog open={!!file} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent style={{ position: 'relative', height: 700, padding: 0 }}>
        <Cropper
          image={previewUrl || ''}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <ButtonComponent
          style={{ width: '100px', height: '35px' }}
          buttonText={'Cancel'}
          buttonTextColor={theme.Colors.primary}
          bgColor={theme.Colors.whitePrimary}
          onClick={onClose}
          btnBorderRadius={1}
        />
        <ButtonComponent
          style={{ width: '100px', height: '35px' }}
          buttonText={'Done'}
          onClick={handleDone}
          bgColor={theme.Colors.primary}
          btnBorderRadius={1}
        />
      </DialogActions>
    </Dialog>
  );
}
