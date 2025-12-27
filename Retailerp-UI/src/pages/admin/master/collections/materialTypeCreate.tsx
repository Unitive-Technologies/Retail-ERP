import { DragDropUpload, styles, TextInput } from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import { UploadPlusIcon } from '@assets/Images';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_SERVICES } from '@services/index';
import { ACCEPTED_IMAGE_MIME_TYPES, HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';
import MUHTypography from '@components/MUHTypography';
import { commonTextInputProps } from '@components/CommonStyles';
import { allowDecimalOnly } from '@utils/form-util';
import TextInputAdornment from '@pages/admin/common/TextInputAdornment';

const MaterialTypeCreate = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const { rowData, type } = location.state || { rowData: null, type: 'create' };

  const [isDocumentUploading, setIsDocumentUploading] = useState(false);

  const UserInitialValues: {
    material_type: string;
    image: string;
    material_price: string;
  } = {
    material_type: rowData?.material_type || '',
    image: rowData?.image || '',
    material_price: (() => {
      const price =
        rowData?.material_price ?? rowData?.material_price_per_g ?? '';
      return price !== null && price !== undefined && price !== ''
        ? String(price)
        : '';
    })(),
  };

  const edit = useEdit(UserInitialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    material_type: false,
    image: false,
    // material_price: false,
  });

  const validateForm = () => {
    const errors = {
      material_type: !edit.getValue('material_type')?.trim(),
      image: !edit.getValue('image')?.trim(),
      // material_price: (() => {
      //   const priceValue = edit.getValue('material_price');
      //   if (priceValue === null || priceValue === undefined) {
      //     return true;
      //   }
      //   const normalized = String(priceValue).trim();
      //   if (!normalized) {
      //     return true;
      //   }
      //   const numericPrice = Number(normalized);
      //   return Number.isNaN(numericPrice) || numericPrice <= 0;
      // })(),
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const uploadMaterialImageError = formErrors.image;
  // const materialPriceError = formErrors.material_price;
  const materialPriceInputValue: string = (() => {
    const value = edit.getValue('material_price');
    if (value === null || value === undefined) {
      return '';
    }
    return typeof value === 'string' ? value : String(value);
  })();

  const handleCreateMaterialType = async () => {
    try {
      // Validate form before submission
      if (!validateForm()) {
        toast.error('Please fill all required fields');
        return;
      }

      setIsSubmitting(true);

      const materialPriceValue = edit.getValue('material_price') ?? '';
      const normalizedPrice = String(materialPriceValue).trim();
      const materialPrice = normalizedPrice ? Number(normalizedPrice) : 0;

      const materialTypeData = {
        material_type: edit.getValue('material_type').trim(),
        material_image_url: edit.getValue('image').trim(),
        material_price: materialPrice,
      };

      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.MaterialTypeService.replace(rowData.id, {
              data: materialTypeData,
            })
          : await API_SERVICES.MaterialTypeService.create({
              data: materialTypeData,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Material type updated successfully!'
            : 'Material type created successfully!'
        );
        handleGoBack();
      }
    } catch (error) {
      console.error('Material type operation error:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigateTo(`/admin/master/collections`);
  };

  const onBrowseClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDocumentUploading(true);

    const file = event?.target?.files?.[0];

    if (!file || !ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      setIsDocumentUploading(false);
      toast.error('Please upload a valid file type (JPEG, PNG, GIF, WebP)');
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    const updateData = (url: string) => {
      edit.update({ image: url });
    };

    try {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = async () => {
          const uploadImageRes : any =
            await API_SERVICES.ImageUploadService.uploadImage(
              formData,
              'Image uploaded successfully',
              'Image upload failed'
            );

          if (
            uploadImageRes?.status < HTTP_STATUSES.BAD_REQUEST &&
            uploadImageRes?.data?.data?.images?.length
          ) {
            const document_url = uploadImageRes.data.data.images[0].Location;
            updateData(document_url);
          }

          setIsDocumentUploading(false);
        };

        img.onerror = () => {
          setIsDocumentUploading(false);
          toast.error('Invalid image file');
        };
      } else {
        // Handle PDF files
        const uploadImageRes : any =
          await API_SERVICES.ImageUploadService.uploadImage(
            formData,
            'PDF uploaded successfully',
            'PDF upload failed'
          );

        if (
          uploadImageRes?.status < HTTP_STATUSES.BAD_REQUEST &&
          uploadImageRes?.data?.data?.images?.length
        ) {
          const document_url = uploadImageRes.data.data.images[0].Location;
          updateData(document_url);
        }

        setIsDocumentUploading(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      setIsDocumentUploading(false);
    }
  };

  return (
    <>
      <Grid
        container
        flexDirection={'column'}
        sx={{ flex: 1, minHeight: 0 }}
        spacing={2}
      >
        <PageHeader
          title={
            type === 'create'
              ? 'CREATE MATERIAL TYPE'
              : type === 'edit'
                ? 'EDIT MATERIAL TYPE'
                : 'VIEW MATERIAL TYPE'
          }
          showDownloadBtn={false}
          showCreateBtn={false}
          showlistBtn={true}
          navigateUrl="/admin/master/collections"
          titleStyle={{ color: theme.Colors.black }}
        />
        <Grid
          container
          size="grow"
          flexDirection={'column'}
          sx={{
            border: `1px solid ${theme.Colors.grayLight}`,
            borderRadius: '8px',
            backgroundColor: theme.Colors.whitePrimary,
          }}
        >
          <MUHTypography
            size={16}
            padding="20px"
            weight={600}
            color={theme.Colors.black}
            sx={{
              borderBottom: `1px solid ${theme.Colors.grayLight}`,
              width: '100%',
              height: '50px',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            MATERIAL TYPE
          </MUHTypography>
          <Grid container padding="20px">
            <Grid
              size={{ xs: 12, md: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '130px', height: '130px' }}>
                <DragDropUpload
                  required
                  image_url={edit.getValue('image')}
                  onBrowseButtonClick={onBrowseClick}
                  handleDeleteImage={() => edit.update({ image: '' })}
                  isError={uploadMaterialImageError}
                  uploadText={isDocumentUploading ? 'Uploading...' : ''}
                  image_icon={<UploadPlusIcon />}
                  disabled={type === 'view'}
                  isViewUploadedImage={edit.getValue('image') ? true : false}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Material Type"
                borderRadius={2}
                value={edit.getValue('material_type')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim() === '' && value !== '') {
                    return;
                  }
                  edit.update({
                    material_type: value,
                  });
                  // Clear error when user starts typing
                  if (formErrors.material_type) {
                    setFormErrors((prev) => ({
                      ...prev,
                      material_type: false,
                    }));
                  }
                }}
                isError={formErrors.material_type}
                {...commonTextInputProps}
                disabled={type === 'view' || isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Material Price /g"
                borderRadius={2}
                value={materialPriceInputValue}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (rawValue === '' || allowDecimalOnly(rawValue)) {
                    edit.update({
                      material_price: rawValue,
                    });
                    // if (materialPriceError) {
                    //   setFormErrors((prev) => ({
                    //     ...prev,
                    //     material_price: false,
                    //   }));
                    // }
                  }
                }}
                placeholderText="0.00"
                // isError={materialPriceError}
                fieldSetStyle={{ pl: '0px' }}
                padding={0.01}
                slotProps={{
                  input: {
                    startAdornment: (
                      <TextInputAdornment
                        text="₹"
                        width="50px"
                        position="start"
                        textStyle={{ mt: 0.5 }}
                      />
                    ),
                  },
                }}
                onBlur={() => {
                  const currentValue = edit.getValue('material_price');
                  if (
                    currentValue !== null &&
                    currentValue !== undefined &&
                    currentValue !== ''
                  ) {
                    const numericValue = Number(currentValue);
                    if (!Number.isNaN(numericValue)) {
                      edit.update({
                        material_price: numericValue.toFixed(2),
                      });
                    }
                  }
                }}
                {...commonTextInputProps}
                disabled={type === 'view' || isSubmitting}
              />
            </Grid>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt={
            isSubmitting
              ? 'Processing...'
              : type === 'create'
                ? 'Create'
                : type === 'edit'
                  ? 'Update'
                  : 'Save'
          }
          handleCreate={handleCreateMaterialType}
          handleCancel={handleGoBack}
          disableCreate={isSubmitting || type === 'view'}
        />
      </Grid>
    </>
  );
};

export default MaterialTypeCreate;
