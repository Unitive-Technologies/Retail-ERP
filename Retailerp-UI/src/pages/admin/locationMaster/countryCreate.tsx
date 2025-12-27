import { styles, TextInput, DragDropUpload } from '@components/index';
import PageHeader from '@components/PageHeader';
import { useEdit } from '@hooks/useEdit';
import { Grid } from '@mui/system';
import { onlyString } from '@utils/form-util';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { CountryService } from '@services/CountryService';
import { ImageUploadService } from '@services/imageUploadService';
import toast from 'react-hot-toast';
import FormAction from '@components/ProjectCommon/FormAction';
import { commonTextInputProps } from '@components/CommonStyles';

const CountryMaster = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const rowId = params.get('rowId');

  const CountryInitialValue = {
    country_name: '',
    short_name: '',
    currency_symbol: '',
    country_code: '',
    country_image_url: '',
  };

  const handleCancel = () => {
    navigate('/admin/locationMaster', { replace: true });
  };

  const edit = useEdit(CountryInitialValue);

  const fetchCountryData = useCallback(async () => {
    try {
      const response: any = await CountryService.getById(Number(rowId));
      if (response?.data?.data) {
        const data = response.data.data?.country;
        console.log('Country data fetched:', data);
        edit.update({
          country_name: data.country_name || '',
          short_name: data.short_name || '',
          currency_symbol: data.currency_symbol || '',
          country_code: data.country_code || '',
          country_image_url: data.country_image_url || '',
        });
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Failed to fetch country data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  useEffect(() => {
    if ((type === 'edit' || type === 'view') && rowId) {
      fetchCountryData();
    }
  }, [type, rowId, fetchCountryData]);

  const countryError = isError && !edit.allFilled('country_name');
  const shortError = isError && !edit.allFilled('short_name');
  const currencySymbolError = isError && !edit.allFilled('currency_symbol');
  const countryCodeError = isError && !edit.allFilled('country_code');
  const countryImageError = isError && !edit.allFilled('country_image_url');

  const onImageBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !file.type?.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const formData = new FormData();
      formData.append('files', file);

      const uploadImageRes: any =
        await ImageUploadService.uploadImage(formData);

      if (
        uploadImageRes?.status < 400 &&
        uploadImageRes?.data?.data?.images?.length
      ) {
        const imageUrl = uploadImageRes.data.data.images[0].Location;
        edit.update({ country_image_url: imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Image upload failed');
    }
  };

  const handleSave = async () => {
    if (
      !edit.allFilled('country_name') ||
      !edit.allFilled('short_name') ||
      !edit.allFilled('currency_symbol') ||
      !edit.allFilled('country_code') ||
      !edit.allFilled('country_image_url')
    ) {
      setIsError(true);
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        country_name: edit.getValue('country_name'),
        short_name: edit.getValue('short_name'),
        currency_symbol: edit.getValue('currency_symbol'),
        country_code: edit.getValue('country_code'),
        country_image_url: edit.getValue('country_image_url'),
      };

      if (type === 'edit' && rowId) {
        await CountryService.update(Number(rowId), {
          data: payload,
          successMessage: 'Country updated successfully',
          failureMessage: 'Failed to update country',
        });
      } else {
        await CountryService.create({
          data: payload,
          successMessage: 'Country created successfully',
          failureMessage: 'Failed to create country',
        });
      }

      navigate('/admin/locationMaster', { replace: true });
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/locationMaster', { replace: true });
  };

  const isDisabled = type === 'view';

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
              ? 'CREATE COUNTRY MASTER'
              : type === 'edit'
                ? 'UPDATE COUNTRY MASTER'
                : 'VIEW COUNTRY MASTER'
          }
          navigateUrl="/admin/locationMaster"
          showCreateBtn={false}
          showlistBtn={true}
          showDownloadBtn={false}
        />
        <Grid container spacing={2} size="grow">
          <Grid
            container
            width={'100%'}
            sx={{
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: theme.Colors.grayLight,
              alignContent: 'flex-start',
              backgroundColor: theme.Colors.whitePrimary,
            }}
          >
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                required
                disabled={isDisabled}
                inputLabel="Country Name"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('country_name')}
                onChange={(e) => {
                  if (!onlyString(e.target.value)) {
                    return;
                  }
                  edit.update({
                    country_name: e.target.value,
                  });
                }}
                isError={countryError}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                required
                disabled={isDisabled}
                inputLabel="Short Name"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('short_name')}
                onChange={(e) => {
                  const val = (e.target.value || '')
                    .toUpperCase()
                    .replace(/[^A-Z]/g, '');
                  edit.update({ short_name: val });
                }}
                isError={shortError}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <TextInput
                required
                disabled={isDisabled}
                inputLabel="Currency Symbol"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('currency_symbol')}
                onChange={(e) => {
                  edit.update({
                    currency_symbol: e.target.value,
                  });
                }}
                isError={currencySymbolError}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                required
                disabled={isDisabled}
                inputLabel="Country Code"
                fontSize={14}
                fontWeight={500}
                fontFamily="Roboto Slab"
                borderRadius={2}
                inputLabelStyle={{
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
                value={edit.getValue('country_code')}
                onChange={(e) => {
                  const val = (e.target.value || '')
                    .toUpperCase()
                    .replace(/[^A-Z0-9+]/g, '');
                  edit.update({ country_code: val });
                }}
                isError={countryCodeError}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <DragDropUpload
                required
                disabled={isDisabled}
                labelText="Country Image"
                image_url={edit.getValue('country_image_url')}
                onBrowseButtonClick={onImageBrowse}
                handleDeleteImage={() => edit.update({ country_image_url: '' })}
                isError={countryImageError}
                uploadText=""
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container justifyContent={'center'}>
          <ButtonComponent
            style={{ width: '100px', height: '35px' }}
            buttonText={'Save'}
            btnWidth={102}
            // onClick={handleCreateUser}
            bgColor={theme.Colors.primary}
            btnBorderRadius={1}
            // loading={isLoading}
          />
          <ButtonComponent
            style={{ width: '100px', height: '35px' }}
            buttonText={'Cancel'}
            btnWidth={102}
            buttonTextColor={theme.Colors.primary}
            bgColor={theme.Colors.whitePrimary}
            // onClick={handleGoBack}
            border={`1px solid ${theme.Colors.primary}`}
            btnBorderRadius={1}
          />
        </Grid> */}
        <Grid
          container
          width={'100%'}
          justifyContent={'center'}
          sx={{ mt: 3, mb: 2 }}
        >
          {type !== 'view' && (
            <FormAction
              firstBtntxt="Save"
              secondBtntx="Cancel"
              handleCancel={handleCancel}
              handleCreate={handleSave}
              {...commonTextInputProps}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CountryMaster;
