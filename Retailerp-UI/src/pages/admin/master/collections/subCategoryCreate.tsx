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

import { commonTextInputProps } from '@components/CommonStyles';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { ACCEPTED_IMAGE_MIME_TYPES, HTTP_STATUSES } from '@constants/Constance';
import MUHTypography from '@components/MUHTypography';
import { handleValidatedChange } from '@utils/form-util';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

const SubCategoryCreate = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, type } = location.state;
  const [isError, setIsError] = useState(false);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [material, setMaterial] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const UserInitialValues = {
    material_type_id:
      rowData?.materialtype_id || rowData?.material_type_id || 0, // ✅ handles both API and legacy cases
    category_id: rowData?.category_id || 0,
    subcategory_name: rowData?.subcategory_name || '',
    subcategory_image_url: rowData?.subcategory_image_url || '',
    reorder_level: rowData?.reorder_level || '',
  };

  const edit = useEdit(UserInitialValues);
  const RequiredFields = [
    'material_type_id',
    'category_id',
    'subcategory_name',
    'subcategory_image_url',
    'reorder_level',
    // 'making_changes',
    // 'margin',
  ];
  const hasError = (specificError: boolean) => isError && specificError;
  const fieldErrors = {
    material_type_id: isError && !edit.allFilled('material_type_id'),
    category_id: isError && !edit.allFilled('category_id'),
    subcategory_name: isError && !edit.allFilled('subcategory_name'), // <-- fixed parenthesis
    subcategory_image_url: isError && !edit.allFilled('subcategory_image_url'),
    reorder_level: isError && !edit.allFilled('reorder_level'),
    // making_changes: isError && !edit.allFilled('making_changes'),
    // margin: isError && !edit.allFilled('margin'),
  };
  const onBrowseClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDocumentUploading(true);

    const file = event?.target?.files?.[0];

    if (!file || !ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      setIsDocumentUploading(false);
      toast.error(
        'Please upload a valid file type (JPEG, PNG, GIF, WebP, or PDF)'
      );
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    const updateData = (url: string) => {
      edit.update({ subcategory_image_url: url });
    };

    try {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = async () => {
          const uploadImageRes =
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
        const uploadImageRes =
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
  const handleCreateSubCategory = async () => {
    if (!edit.allFilled(...RequiredFields)) {
      setIsError(true);
      return toast.error('Please fill all required fields.');
    }

    // Prepare payload for SubCategoryService
    const payload = {
      materialtype_id: edit.getValue('material_type_id'),
      category_id: edit.getValue('category_id'),
      subcategory_name: edit.getValue('subcategory_name'),
      subcategory_image_url: edit.getValue('subcategory_image_url'),
      reorder_level: Number(edit.getValue('reorder_level')),
      // making_changes: Number(edit.getValue('making_changes')),
      // margin: Number(edit.getValue('margin')),
    };

    try {
      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.SubCategoryService.replace(rowData.id, {
              data: payload,
            })
          : await API_SERVICES.SubCategoryService.create({
              data: payload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Sub Category updated successfully!'
            : 'Sub Category created successfully!'
        );
        handleGoBack();
      }
    } catch (error) {
      toast.error('Failed to create Sub Category');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/master/collections');
  };
  useEffect(() => {
    if (type === 'edit' && rowData) {
      const matchedMaterial = material.find(
        (item) =>
          item.value === rowData.materialtype_id ||
          item.label.toLowerCase() ===
            (rowData.material_type || '').toLowerCase()
      );
      if (matchedMaterial) {
        edit.update({ material_type_id: matchedMaterial.value });
      }
    }
  }, [material, type, rowData]);

  const fetchMaterialType = async () => {
    try {
      const response: any = await DropDownServiceAll.getMaterialTypes();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const materialTypes = response?.data?.data?.materialTypes || [];
        const filteredData = materialTypes.map((item: any) => ({
          value: item.id,
          label: item.material_type,
        }));
        setMaterial(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMaterialType();
  }, []);

  const fetchCategoryType = async () => {
    try {
      const materialTypeId = edit.getValue('material_type_id');
      if (!materialTypeId) {
        setCategory([]);
        return;
      }
      const response: any = await DropDownServiceAll.getCategories({
        material_type_id: materialTypeId,
      });
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const categories = response?.data?.data?.categories || [];
        const filteredData = categories.map((item: any) => ({
          value: item.id,
          label: item.category_name,
        }));
        setCategory(filteredData);
      }
    } catch (error) {
      console.log(error);
      setCategory([]);
    }
  };

  useEffect(() => {
    fetchCategoryType();
  }, [edit.getValue('material_type_id')]);

  const findOption = (options: any[], id: number | string) => {
    if (!id) return '';
    return options.find((opt) => opt.value == id) || '';
  };

  const selectedMaterial = findOption(material, edit.getValue('material_type_id'));
  const selectedCategory = findOption(category, edit.getValue('category_id'));
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
              ? 'CREATE SUB CATEGORY'
              : type === 'edit'
                ? 'EDIT SUB CATEGORY'
                : 'VIEW SUB CATEGORY'
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
            SUB CATEGORY DETAILS
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
                {/* <DragDropUpload
                  required
                  image_url={edit.getValue('image')}
                  onBrowseButtonClick={onSubCategoryImageBrowse}
                  handleDeleteImage={() => edit.update({ image: '' })}
                  isError={hasError(fieldErrors.image)}
                  uploadText=""
                  image_icon={<UploadPlusIcon />}
                /> */}
                <DragDropUpload
                  required
                  image_url={edit.getValue('subcategory_image_url')}
                  onBrowseButtonClick={onBrowseClick}
                  handleDeleteImage={() =>
                    edit.update({ subcategory_image_url: '' })
                  }
                  isError={hasError(fieldErrors.subcategory_image_url)}
                  uploadText={isDocumentUploading ? 'Uploading...' : ''}
                  image_icon={<UploadPlusIcon />}
                  disabled={type === 'view'}
                  isViewUploadedImage={
                    edit.getValue('subcategory_image_url') ? true : false
                  }
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                label="Material Type"
                options={material}
                isReadOnly={type === 'view'}
                value={selectedMaterial || null}
                onChange={(_e, newValue) => {
                  edit.update({
                    material_type_id: newValue?.value ?? 0,
                    category_id: 0,
                  });
                }}
                isError={hasError(fieldErrors.material_type_id)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                required
                label="Category Name"
                options={category}
                value={selectedCategory || null}
                onChange={(_e, newValue) => {
                  edit.update({
                    category_id: newValue?.value ?? 0,
                  });
                }}
                isReadOnly={!edit.getValue('material_type_id') || type === 'view'}
                isError={hasError(fieldErrors.category_id)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Sub Category"
                value={edit.getValue('subcategory_name')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.trim() === '' && value !== '') {
                    return;
                  }

                  edit.update({ subcategory_name: value });
                }}
                isError={hasError(fieldErrors.subcategory_name)}
                {...commonTextInputProps}
                disabled={type === 'view'}
              />
            </Grid>
            <Grid size={{ xs: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Reorder Level"
                value={edit.getValue('reorder_level')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.includes(' ') || /\s/.test(value)) {
                    return;
                  }
                  handleValidatedChange(e, edit, 'reorder_level', 'number');
                }}
                isError={hasError(fieldErrors.reorder_level)}
                {...commonTextInputProps}
                disabled={type === 'view'}
              />
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                inputLabel="Making Charges"
                value={edit.getValue('making_changes')}
                onChange={(e: any) =>
                  edit.update({ making_changes: e.target.value })
                }
                isError={hasError(fieldErrors.making_changes)}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Margin %"
                value={edit.getValue('margin')}
                onChange={(e: any) => edit.update({ margin: e.target.value })}
                isError={hasError(fieldErrors.margin)}
                {...commonTextInputProps}
              />
            </Grid> */}
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt={
            type === 'edit' ? 'Update' : type === 'create' ? 'Create' : 'Edit'
          }
          handleCreate={handleCreateSubCategory}
          handleCancel={handleGoBack}
          secondBtntx={type === 'view' ? 'Back' : 'Cancel'}
          disableCreate={type === 'view'}
        />
      </Grid>
    </>
  );
};

export default SubCategoryCreate;
