import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import { useTheme } from '@mui/material';
import PageHeader from '@components/PageHeader';
import { UploadPlusIcon } from '@assets/Images';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_SERVICES } from '@services/index';
import toast from 'react-hot-toast';
import { ACCEPTED_IMAGE_MIME_TYPES, HTTP_STATUSES } from '@constants/Constance';
import MUHTypography from '@components/MUHTypography';
import { commonTextInputProps } from '@components/CommonStyles';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const CategoryCreate = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any[]>([]);

  const { rowData, type } = location.state || { rowData: null, type: 'create' };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    material_type: boolean;
    image: boolean;
    category_name: boolean;
    short_name: boolean;
  }>({
    material_type: false,
    image: false,
    category_name: false,
    short_name: false,
  });

  const UserInitialValues: {
    material_type_id: number;
    material_type: string;
    image: string;
    category_name: string;
    short_name: string;
  } = {
    material_type_id: rowData?.material_type_id || 0,
    material_type: rowData?.material_type || '',
    image: rowData?.image || '',
    category_name: rowData?.category_name || '',
    short_name: rowData?.short_name || '',
  };

  const edit = useEdit(UserInitialValues);

  const uploadCategoryImageError = formErrors.image;

  const validateForm = () => {
    const errors = {
      material_type: !edit.getValue('material_type')?.trim(),
      category_name: !edit.getValue('category_name')?.trim(),
      image: !edit.getValue('image')?.trim(),
      short_name: !edit.getValue('short_name')?.trim(),
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleCreateCategory = async () => {
    try {
      // Validate form before submission
      if (!validateForm()) {
        toast.error('Please fill all required fields');
        return;
      }

      setIsSubmitting(true);

      // Prepare payload with material_type, category_name, short_name, and image
      const payload = {
        material_type_id: edit.getValue('material_type_id'),
        material_type: edit.getValue('material_type').trim(),
        category_name: edit.getValue('category_name').trim(),
        short_name: edit.getValue('short_name').trim(),
        category_image_url: edit.getValue('image').trim(),
      };

      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.CategoryService.replace(rowData.id, {
              data: payload,
            })
          : await API_SERVICES.CategoryService.create({
              data: payload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Category updated successfully!'
            : 'Category created successfully!'
        );
        handleGoBack();
      }
    } catch (error) {
      console.error('Category operation error:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/master/collections');
  };

  const fetchMaterial = async () => {
    try {
      const response: any = await DropDownServiceAll.getMaterialTypes();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const materialTypes = response?.data?.data?.materialTypes || [];
        const filteredData = materialTypes.map((item: any) => ({
          value: item.id,
          label: item.material_type,
        }));
        setCategory(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findOption = (options: any[], id: number | string) => {
    if (!id) return '';
    return options.find((opt) => opt.value == id) || '';
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

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
            (uploadImageRes as any)?.data?.data?.images?.length
          ) {
            const document_url =
              (uploadImageRes as any)?.data?.data?.images?.[0]?.Location ?? '';
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
        const uploadImageRes: any =
          await API_SERVICES.ImageUploadService.uploadImage(
            formData,
            'PDF uploaded successfully',
            'PDF upload failed'
          );

        if (
          uploadImageRes?.status < HTTP_STATUSES.BAD_REQUEST &&
          (uploadImageRes as any)?.data?.data?.images?.length
        ) {
          const document_url =
            (uploadImageRes as any)?.data?.data?.images?.[0]?.Location ?? '';
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

  const selectedCategory = findOption(category, edit.getValue('material_type_id'));

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
              ? 'CREATE CATEGORY'
              : type === 'edit'
                ? 'EDIT CATEGORY'
                : 'VIEW CATEGORY'
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
            CATEGORY DETAILS
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
                  isError={uploadCategoryImageError}
                  uploadText={isDocumentUploading ? 'Uploading...' : ''}
                  image_icon={<UploadPlusIcon />}
                  disabled={type === 'view'}
                  isViewUploadedImage={edit.getValue('image') ? true : false}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Material Type"
                options={category}
                value={selectedCategory || null}
                onChange={(_e, newValue) => {
                  edit.update({
                    material_type_id: newValue?.value ?? 0,
                    material_type: newValue?.label ?? '',
                  });
                  if (formErrors.material_type) {
                    setFormErrors((prev) => ({
                      ...prev,
                      material_type: false,
                    }));
                  }
                }}
                isError={formErrors.material_type}
                isReadOnly={type === 'view'}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Category Name"
                borderRadius={2}
                value={edit.getValue('category_name')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.trim() === '' && value !== '') {
                    return;
                  }
                  edit.update({
                    category_name: value,
                  });
                  if (formErrors.category_name) {
                    setFormErrors((prev) => ({
                      ...prev,
                      category_name: false,
                    }));
                  }
                }}
                {...commonTextInputProps}
                isError={formErrors.category_name}
                disabled={type === 'view' || isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Short Name"
                borderRadius={2}
                value={edit.getValue('short_name')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.trim() === '' && value !== '') {
                    return;
                  }
                  edit.update({
                    short_name: value,
                  });
                  if (formErrors.short_name) {
                    setFormErrors((prev) => ({
                      ...prev,
                      short_name: false,
                    }));
                  }
                }}
                {...commonTextInputProps}
                isError={formErrors.short_name}
                disabled={type === 'view' || isSubmitting}
              />
            </Grid>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt={
            type === 'edit' ? 'Update' : type === 'create' ? 'Create' : 'Edit'
          }
          handleCreate={handleCreateCategory}
          handleCancel={handleGoBack}
          secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
        />
      </Grid>
    </>
  );
};

export default CategoryCreate;
