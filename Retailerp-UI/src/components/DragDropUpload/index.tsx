import { useRef } from 'react';
import { Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/material';
import './dragDrop.css';
import { isValidURL } from '@utils/form-util';
import {
  EditBtnIcon,
  UploadFolderImages,
  UploadIcon,
} from '@assets/Images/AdminImages';

type imageUploadProps = {
  image_url?: any;
  width?: any;
  height?: any;
  onBrowseButtonClick?: (e: any) => void;
  labelText?: string;
  disabled?: boolean;
  required?: boolean;
  isError?: boolean;
  handleDeleteImage?: (name: string) => void;
  uploadText?: string;
  image_icon?: any;
  fileName?: string;
  uploadedContainerStyle?: any;
  textStyle?: any;
  dashWidth?: number;
  dashGap?: number;
  isViewUploadedImage?: boolean | string;
};

const DragDropUpload = (props: imageUploadProps) => {
  const {
    image_url,
    fileName,
    onBrowseButtonClick,
    handleDeleteImage,
    labelText,
    disabled,
    required,
    isError,
    uploadText,
    image_icon,
    uploadedContainerStyle,
    textStyle,
    dashWidth = 6.5,
    dashGap = 5.5,
    isViewUploadedImage = false,
  } = props;
  const theme = useTheme();
  const dragRef: any = useRef(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onDragEnter = () => dragRef.current.classList.add('dragover');
  const onDragLeave = () => dragRef.current.classList.remove('dragover');

  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ width: '100%' }}
    >
      {labelText ? (
        <Grid xs={5}>
          <Typography
            style={{
              fontSize: theme.MetricsSizes.small_xx,
              fontFamily: theme.fontFamily.inter,
              color: isError
                ? theme.Colors.redPrimary
                : theme.Colors.blackPrimary,
              fontWeight: theme.fontWeight.medium,
            }}
          >
            {labelText}
            {required && (
              <span
                style={{
                  color: theme.Colors.redPrimary,
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                &nbsp;*
              </span>
            )}
          </Typography>
        </Grid>
      ) : null}
      <Grid xs={labelText ? 7 : 12}>
        {image_url ? (
          <>
            {!isViewUploadedImage ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: '8px',
                  position: 'relative',
                  backgroundColor: theme.Colors.primary,
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  paddingLeft: 16,
                  paddingRight: '25px',
                  borderColor: isError
                    ? theme.Colors.redPrimary
                    : theme.Colors.primary,
                  ...uploadedContainerStyle,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.Colors.whitePrimary,
                    fontSize: theme.MetricsSizes.small_xx,
                    fontWeight: 500,
                    fontFamily: 'Roboto-Regular',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    ...textStyle,
                  }}
                >
                  {fileName ||
                    (isValidURL(image_url)
                      ? image_url?.split(
                          'https://etsimages.s3.ap-south-1.amazonaws.com/'
                        )[1] || image_url
                      : '')}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    position: 'absolute',
                    right: 10,
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    handleDeleteImage &&
                    handleDeleteImage(
                      image_url?.split(
                        'https://profilepictureenchr.s3.ap-south-1.amazonaws.com/'
                      )[1]
                    )
                  }
                >
                  <UploadFolderImages />
                </div>
              </div>
            ) : null}
            {isViewUploadedImage ? (
              <div
                style={{
                  marginTop: 8,
                  width: '100%',
                  height: image_icon ? 130 : 130,
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  borderColor: isError
                    ? theme.Colors.redPrimary
                    : theme.Colors.primary,
                  backgroundColor: theme.Colors.whitePrimary,
                }}
              >
                <img
                  src={image_url}
                  alt="uploaded"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Change image"
                >
                  <EditBtnIcon />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div
            ref={dragRef}
            className="drag-drop"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDragLeave}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: image_icon ? 130 : 40,
                border: '1px dashed #AEAFB0',
                borderRadius: '8px',
                position: 'relative',
                backgroundColor: image_url
                  ? theme.Colors.primary
                  : theme.Colors.whitePrimary,
                // backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23333' stroke-width='1' stroke-dasharray='${dashWidth}%2c ${dashGap}' stroke-dashoffset='9' stroke-linecap='square'/%3e%3c/svg%3e")`,
                borderColor: isError
                  ? theme.Colors.redPrimary
                  : theme.Colors.silverFoilWhite,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '8px',
                }}
              >
                {image_icon ? image_icon : <UploadIcon />}
              </div>
            </div>
            <input
              type={'file'}
              name=""
              id=""
              value={''}
              accept="image/png, image/jpg, image/jpeg"
              onChange={onBrowseButtonClick}
              disabled={disabled}
            />
          </div>
        )}
        {/* Hidden input to support re-selecting an image when preview is shown */}
        <input
          ref={fileInputRef}
          type={'file'}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={onBrowseButtonClick}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
};
export default DragDropUpload;
