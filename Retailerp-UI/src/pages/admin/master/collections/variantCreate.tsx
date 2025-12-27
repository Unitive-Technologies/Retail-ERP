import { styles, TextInput } from '@components/index';
import { Grid } from '@mui/system';
import { useEdit } from '@hooks/useEdit';
import {
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import { handleValidatedChange } from '@utils/form-util';
import { Add, Clear } from '@mui/icons-material';
import MUHTypography from '@components/MUHTypography';

const VariantCreate = () => {
  const navigateTo = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const { rowData, type } = location.state;
  const [variants, setVariants] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dataLoadedRef = useRef(false);
  const [formErrors, setFormErrors] = useState({
    variant_type: false,
  });

  const UserInitialValues = {
    variant_type: rowData.variant_type || '',
    values: '',
    editIndex: null,
  };

  const edit = useEdit(UserInitialValues);

  const validateForm = () => {
    const errors = {
      variant_type: !edit.getValue('variant_type')?.trim(),
      values: !variants.length,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleClickAddVariants = () => {
    if (type === 'view') return;

    const variantValue = edit.getValue('values')?.trim();
    if (!variantValue) return;

    // Editing an existing variant
    if (edit.getValue('editIndex') !== null) {
      setVariants((prev) => {
        const updated = [...prev];
        updated[edit.getValue('editIndex')] = variantValue;
        return updated;
      });
      edit.update({ values: '', editIndex: null });
      return;
    }

    // Add new variant
    const variantExists = variants.some((item) => item === variantValue);
    if (!variantExists) {
      setVariants((prevVariants) => [...prevVariants, variantValue]);
      edit.update({ values: '' });
    }
  };

  const removeVariant = (index: number) => {
    if (type !== 'view') {
      setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
      if (edit.getValue('editIndex') === index) {
        edit.update({ values: '', editIndex: null });
      }
    }
  };

  const handleEditVariant = (index: number) => {
    if (type === 'view') return;
    const selectedValue = variants[index];
    edit.update({ values: selectedValue, editIndex: index });
  };

  const handleGoBack = () => {
    navigateTo(`/admin/master/collections`);
  };

  const loadVariantData = useCallback(async () => {
    if (
      (type === 'edit' || type === 'view') &&
      rowData?.id &&
      !dataLoadedRef.current
    ) {
      try {
        setIsLoading(true);
        const response = await API_SERVICES.VariantService.getById(rowData.id);
        if (
          response &&
          'status' in response &&
          response.status < HTTP_STATUSES.BAD_REQUEST &&
          'data' in response &&
          response.data
        ) {
          const variantData = response.data.data.variant;

          edit.update({
            variant_type: variantData.variant_type ?? '',
            values: '',
            editIndex: null,
          });

          if (Array.isArray(variantData.variant_values)) {
            const variantArray = variantData.variant_values.map((v) => v.value);
            setVariants(variantArray);
          }

          dataLoadedRef.current = true;
          console.log('Variant data loaded successfully');
        }
      } catch (error) {
        console.error('Error loading variant data:', error);
        toast.error('Failed to load variant data');
      } finally {
        setIsLoading(false);
      }
    }
  }, [type, rowData?.id, edit]);

  const handleCreateVariant = async () => {
    try {
      if (!validateForm()) {
        toast.error('Please fill all required fields');
        return;
      }

      setIsSubmitting(true);
      const variantPayload = {
        variant_type: edit.getValue('variant_type').trim(),
        values: variants,
      };

      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.VariantService.update({
              id: rowData.id,
              data: variantPayload,
            })
          : await API_SERVICES.VariantService.create({
              data: variantPayload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Variant updated successfully!'
            : 'Variant created successfully!'
        );
        edit.update({ values: '', editIndex: null });
        handleGoBack();
      }
    } catch (error) {
      console.error('Variant operation error:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (dataLoadedRef.current) return;

    const valuesData = rowData?.values || rowData?.Values;
    if (valuesData && typeof valuesData === 'string') {
      const valuesArray = valuesData
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val);
      setVariants(valuesArray);
      dataLoadedRef.current = true;
    } else if (
      (type === 'edit' || type === 'view') &&
      rowData?.id &&
      !dataLoadedRef.current
    ) {
      loadVariantData();
    }
  }, [rowData, type, loadVariantData]);

  return (
    <>
      {isLoading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: '400px' }}
        >
          <Typography>Loading variant data...</Typography>
        </Grid>
      ) : (
        <Grid
          container
          flexDirection={'column'}
          sx={{ flex: 1, minHeight: 0 }}
          spacing={2}
        >
          <PageHeader
            title={
              type === 'create'
                ? 'CREATE VARIANTS'
                : type === 'edit'
                  ? 'EDIT VARIANTS'
                  : 'VIEW VARIANTS'
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
              VALUE DETAILS
            </MUHTypography>

            <Grid container padding="20px">
              <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
                <TextInput
                  required
                  inputLabel="Type"
                  fontSize={14}
                  fontWeight={500}
                  fontFamily="Roboto Slab"
                  borderRadius={2}
                  inputLabelStyle={{
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'Roboto Slab',
                  }}
                  value={edit.getValue('variant_type')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    handleValidatedChange(e, edit, 'variant_type', 'string');
                    if (formErrors.variant_type) {
                      setFormErrors((prev) => ({
                        ...prev,
                        variant_type: false,
                      }));
                    }
                  }}
                  isError={formErrors.variant_type}
                  disabled={type === 'view' || isSubmitting}
                />
              </Grid>

              {/* Variant Value Field */}
              <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
                <TextInput
                  required
                  inputLabel="Value"
                  fontSize={14}
                  fontWeight={500}
                  fontFamily="Roboto Slab"
                  borderRadius={2}
                  inputLabelStyle={{
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'Roboto Slab',
                  }}
                  value={edit.getValue('values')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleValidatedChange(
                      e,
                      edit,
                      'values',
                      'alphaNumericWithQuotesAndSlash'
                    );
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            background: theme.Colors.primaryLight,
                            borderRadius: '0 8px 8px 0',
                            maxHeight: 'none',
                          }}
                        >
                          <IconButton onClick={handleClickAddVariants}>
                            <Add sx={{ color: theme.Colors.primary }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  disabled={type === 'view' || isSubmitting}
                />
              </Grid>

              {/* Variant Chips */}
              <Box mt={2} display="flex" flexWrap="wrap" gap={1.5}>
                {variants
                  .map((val: string, originalIndex: number) => {
                    if (originalIndex === edit.getValue('editIndex'))
                      return null;
                    return (
                      <Box
                        key={`${val}-${originalIndex}`}
                        sx={{
                          display: 'flex',
                          minHeight: '30px',
                          border: `1px solid #CCCCCC`,
                          borderRadius: '4px',
                        }}
                      >
                        <Box
                          onClick={() => handleEditVariant(originalIndex)}
                          sx={{
                            px: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <MUHTypography
                            text={val}
                            color={theme.Colors.black}
                            weight={500}
                            family={theme.fontFamily.roboto}
                          />
                        </Box>
                        <Box
                          onClick={
                            type !== 'view'
                              ? () => removeVariant(originalIndex)
                              : undefined
                          }
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderLeft: `1px solid #CCCCCC`,
                            px: 0.8,
                            cursor: 'pointer',
                          }}
                        >
                          <Clear sx={{ fontSize: '18px', fontWeight: 600 }} />
                        </Box>
                      </Box>
                    );
                  })
                  .filter(Boolean)}
              </Box>
            </Grid>
          </Grid>

          <FormAction
            firstBtntxt={
              type === 'create' ? 'Create' : type === 'edit' ? 'Update' : 'View'
            }
            handleCreate={handleCreateVariant}
            handleCancel={handleGoBack}
            disableCreate={type === 'view' || isSubmitting}
          />
        </Grid>
      )}
    </>
  );
};

export default VariantCreate;
