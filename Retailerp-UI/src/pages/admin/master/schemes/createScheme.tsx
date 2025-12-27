import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import {
  AutoSearchSelectWithLabel,
  DragDropUpload,
  styles,
  TextInput,
} from '@components/index';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import MUHTypography from '@components/MUHTypography';
import PageHeader from '@components/PageHeader';
import FormAction from '@components/ProjectCommon/FormAction';
import { HTTP_STATUSES, STATUS } from '@constants/Constance';
import { useEdit } from '@hooks/useEdit';
import { Add, Clear } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Box,
  Divider,
} from '@mui/material';
import { Grid } from '@mui/system';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { API_SERVICES } from '@services/index';
import { handleValidatedChange } from '@utils/form-util';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateScheme = () => {
  const theme = useTheme();
  const params = new URLSearchParams(location?.search);
  const type = params.get('type');
  const rowId = params.get('rowId');
  const navigate = useNavigate();
  const [material, setMaterial] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [schemeTypes, setSchemeTypes] = useState<
    { label: string; value: number }[]
  >([]);
  const [paymentFrequencies, setPaymentFrequencies] = useState<
    { label: string; value: number }[]
  >([]);
  const [redemptionTypes, setRedemptionTypes] = useState<
    { label: string; value: number }[]
  >([]);
  const [durations, setDurations] = useState<
    { label: string; value: number }[]
  >([]);
  const [rowData, setRowData] = useState<any>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const UserInitialValues: any = {
    material_type: rowData.material_type || '',
    scheme_name: rowData.scheme_name || '',
    scheme_type_id: rowData.scheme_type_id || '',

    duration_id: rowData.duration_id || '',

    payment_frequency_id: rowData.payment_frequency_id || '',
    min_amount: rowData.min_amount || '',
    redemption_id: rowData.redemption_id || '',
    visible_to: rowData.visible_to || '',
    status: rowData.status || '',
    terms_and_conditions_url: rowData.terms_and_conditions_url || null,
    editIndex: null,
  };

  const edit = useEdit(UserInitialValues);

  const handleCancel = () => {};
  // const handleCreate = () => {};

  const handleClickAddVariants = () => {
    if (type === 'view') return;

    const variantValue = edit.getValue('values')?.trim();
    if (!variantValue) return;

    // editing an existing variant
    if (edit.getValue('editIndex') !== null) {
      // update existing variant
      setVariants((prev) => {
        const updated = [...prev];
        updated[edit.getValue('editIndex')] = variantValue;
        return updated;
      });
      edit.update({ values: '', editIndex: null });
      return;
    }

    // add
    const variantExists = variants.some((item) => item === variantValue);
    if (!variantExists) {
      setVariants((prevVariants) => [...prevVariants, variantValue]);
      edit.update({ values: '' });
    }
  };
  const handleGoBack = () => {
    navigate('/admin/master/schemes');
  };

  const removeVariant = (index: number) => {
    if (type !== 'view') {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleEditVariant = (index: number) => {
    if (type === 'view') return;
    const selected = variants[index];
    edit.update({ values: selected, editIndex: index });
  };

  const formatINR = (val: string) => {
    const num = Number(String(val).replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const handleInstallmentChange = (e: any) => {
    const raw = String(e.target.value || '');
    const digits = raw.replace(/[^0-9]/g, '');
    const formatted = digits ? formatINR(digits) : '';
    edit.update({ values: formatted });
  };

  const handleCreate = async () => {
    const payload: any = {
      material_type_id: edit.getValue('material_type_id'),
      scheme_name: edit.getValue('scheme_name'),
      scheme_type_id: Number(edit.getValue('scheme_type_id')),
      duration_id: Number(edit.getValue('duration_id')),
      monthly_installments: variants.map((v) =>
        Number(String(v).replace(/[^0-9]/g, ''))
      ),
      payment_frequency_id: Number(edit.getValue('payment_frequency_id')),
      min_amount: Number(edit.getValue('min_amount')),
      redemption_id: Number(edit.getValue('redemption_id')),
      visible_to: Array.isArray(edit.getValue('visible_to'))
        ? edit.getValue('visible_to').map((v: any) => Number(v))
        : [Number(edit.getValue('visible_to'))],
      status: edit.getValue('status'),
      terms_and_conditions_url: edit.getValue('terms_and_conditions_url'),
    };

    try {
      if (
        !edit.allFilled(...RequiredFields) ||
        variants.length === 0 || // ensure monthly installments added
        !edit.getValue('material_type_id') ||
        !edit.getValue('scheme_name') ||
        !edit.getValue('scheme_type_id') ||
        !edit.getValue('duration_id') ||
        !edit.getValue('payment_frequency_id') ||
        !edit.getValue('min_amount') ||
        !edit.getValue('redemption_id') ||
        !edit.getValue('status') ||
        !edit.getValue('terms_and_conditions_url')
      ) {
        setIsError(true);
        toast.error('Please fill all required fields.');
        return;
      }
      const response: any =
        type === 'edit' && rowData?.id
          ? await API_SERVICES.SchemeMasterService.replace(rowData.id, {
              data: payload,
            })
          : await API_SERVICES.SchemeMasterService.create({
              data: payload,
            });

      if (
        response?.data?.statusCode === HTTP_STATUSES.SUCCESS ||
        response?.status < HTTP_STATUSES.BAD_REQUEST
      ) {
        toast.success(
          type === 'edit'
            ? 'Scheme updated successfully!'
            : 'Scheme created successfully!'
        );
        handleGoBack();
      }
      console.log('Upload response:', response);
    } catch (error) {
      toast.error('Failed to create Sub Category');
    }
  };
  const handleDeleteImage = () => {
    edit.update({ terms_and_conditions_url: '', tc_file: null });
  };

  const onBrowseClick = async (event: any) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // local preview
    const previewURL = URL.createObjectURL(file);
    edit.update({
      terms_and_conditions_url: previewURL, // <-- FIXED
      tc_file: file,
    });

    try {
      const formData = new FormData();
      formData.append('files', file);

      const uploadImageRes =
        await API_SERVICES.ImageUploadService.uploadImage(formData);
      const res: any = uploadImageRes;
      if (
        res?.status < HTTP_STATUSES.BAD_REQUEST &&
        res?.data?.data?.images?.length
      ) {
        const document_url = res.data.data.images[0].Location;
        // edit.update({ tc_file: document_url });
        edit.update({
          terms_and_conditions_url: document_url, // <-- FIXED
          tc_file: document_url,
        });
      } else {
        toast.error('Failed to upload file');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed. Please try again.');
    }
  };

  const fetchMaterialType = async () => {
    try {
      const response: any = await DropDownServiceAll.getMaterialTypes();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.materialTypes ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        const options = Array.isArray(raw)
          ? raw.map((item: any) => ({
              value: Number(item?.id ?? item?.material_type_id ?? item?.value),
              label:
                item?.label ??
                item?.material_type ??
                item?.name ??
                String(item ?? ''),
            }))
          : [];
        setMaterial(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchemeType = async () => {
    try {
      let response: any;
      if (edit.getValue('scheme_type_id')) {
        // No per-id API for scheme types in dropdown currently
      } else {
        response = await DropDownServiceAll.getSchemeType();
      }
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.schemeTypes ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        console.log('API schemeTypes response:', raw);
        const filteredData = Array.isArray(raw)
          ? raw.map((item: any) => {
              const label =
                item?.label ??
                item?.scheme_type_name ??
                item?.scheme_type ??
                item?.name ??
                String(item ?? '');
              const value = Number(
                item?.id ?? item?.scheme_type_id ?? item?.value
              );
              return { label, value };
            })
          : [];
        setSchemeTypes(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDuration = async () => {
    try {
      const response: any = await DropDownServiceAll.getDuration();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.durations ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        const options = Array.isArray(raw)
          ? raw.map((item: any) => {
              const label =
                item?.label ??
                item?.duration_name ??
                item?.name ??
                item?.duration ??
                String(item ?? '');
              const value = Number(
                item?.id ?? item?.duration_id ?? item?.value
              );
              return { label, value };
            })
          : [];
        setDurations(options);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPaymentFrequency = async () => {
    try {
      const response: any = await DropDownServiceAll.getPaymentFrequency();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.paymentFrequencies ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        const options = Array.isArray(raw)
          ? raw.map((item: any) => {
              const label =
                item?.label ??
                item?.frequency_name ??
                item?.name ??
                item?.payment_frequency ??
                String(item ?? '');
              const value = Number(
                item?.id ?? item?.payment_frequency_id ?? item?.value
              );
              return { label, value };
            })
          : [];
        setPaymentFrequencies(options);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRedemption = async () => {
    try {
      const response: any = await DropDownServiceAll.getRedemption();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.redemptionTypes ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        const options = Array.isArray(raw)
          ? raw.map((item: any) => {
              const label =
                item?.label ??
                item?.redemption_type_name ??
                item?.name ??
                item?.redemption ??
                String(item ?? '');
              const value = Number(
                item?.id ?? item?.redemption_id ?? item?.value
              );
              return { label, value };
            })
          : [];
        setRedemptionTypes(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMaterialType();
    fetchSchemeType();
    fetchPaymentFrequency();
    fetchRedemption();
    fetchDuration();
  }, []);

  useEffect(() => {
    const fetchScheme = async () => {
      if (!rowId || type === 'create') return;
      try {
        const res: any = await API_SERVICES.SchemeMasterService.getById(
          Number(rowId)
        );
        if (res?.status < HTTP_STATUSES.BAD_REQUEST) {
          const data =
            res?.data?.data?.scheme ?? res?.data?.scheme ?? res?.data ?? {};
          setRowData(data);
          const prefill: Record<string, any> = {
            material_type_id:
              data.material_type_id ??
              data.material_type?.id ??
              edit.getValue('material_type_id'),
            scheme_name: data.scheme_name ?? '',
            scheme_type_id:
              data.scheme_type_id ?? edit.getValue('scheme_type_id') ?? '',
            duration_id: data.duration_id ?? edit.getValue('duration_id') ?? '',
            payment_frequency_id:
              data.payment_frequency_id ??
              edit.getValue('payment_frequency_id') ??
              '',
            min_amount: data.min_amount ?? '',
            redemption_id:
              data.redemption_id ?? edit.getValue('redemption_id') ?? '',
            visible_to: Array.isArray(data.visible_to)
              ? data.visible_to[0] ?? ''
              : data.visible_to ?? '',
            status: data.status ?? '',
            terms_and_conditions_url: data.terms_and_conditions_url ?? null,
          };
          edit.update(prefill);
          const fetchedInstallments: number[] = Array.isArray(
            data.monthly_installments
          )
            ? data.monthly_installments
            : [];
          if (fetchedInstallments.length) {
            setVariants(
              fetchedInstallments.map((n: number) =>
                new Intl.NumberFormat('en-IN').format(Number(n || 0))
              )
            );
          } else {
            setVariants([]);
          }
        }
      } catch (e) {
        // swallow error and keep defaults
      }
    };
    fetchScheme();
  }, [rowId, type]);
  const selectedMaterial = material?.find(
    (item) => Number(item.value) === Number(edit.getValue('material_type_id'))
  );
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await DropDownServiceAll.getBranches();
        const r: any = res;
        if (
          r?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(r?.data?.data?.branches)
        ) {
          const options = r.data.data.branches.map((branch: any) => ({
            label: branch.branch_name,
            value: Number(branch.id),
          }));
          setBranchOptions(options);
        } else {
          setBranchOptions([]);
        }
      } catch (err) {
        setBranchOptions([]);
      }
    };
    fetchBranches();
  }, []);
  const RequiredFields = [
    'material_type_id',
    'scheme_name',
    'scheme_type_id',
    'duration_id',
    'payment_frequency_id',
    'min_amount',
    'redemption_id',
    'status',
    'terms_and_conditions_url',
  ];
  // 🔹 Field-level validation errors (same pattern for all fields)
  const materialTypeError = isError && !edit.allFilled('material_type_id');
  const schemeError = isError && !edit.allFilled('scheme_name');
  const schemeTypeError = isError && !edit.allFilled('scheme_type_id');
  const durationError = isError && !edit.allFilled('duration_id');
  const monthlyInstallError = isError && variants.length === 0; // since it's an array
  const paymentError = isError && !edit.allFilled('payment_frequency_id');
  const minAmountError = isError && !edit.allFilled('min_amount');
  const redemptionError = isError && !edit.allFilled('redemption_id');
  const statusError = isError && !edit.allFilled('status');
  const termsError = isError && !edit.allFilled('terms_and_conditions_url');

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
              ? 'CREATE NEW SCHEME MASTER'
              : type === 'edit'
                ? 'EDIT NEW SCHEME MASTER'
                : 'VIEW NEW SCHEME MASTER'
          }
          navigateUrl="/admin/master/schemes"
          showCreateBtn={false}
          showlistBtn={false}
          showDownloadBtn={false}
          showBackButton={true}
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
            SCHEME DETAILS
          </MUHTypography>
          <Grid container padding="20px">
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <AutoSearchSelectWithLabel
                required
                isError={materialTypeError}
                label="Material Type"
                options={material}
                value={selectedMaterial || null}
                onChange={(e, newValue) => {
                  edit.update({
                    material_type_id: newValue?.value ?? 0,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                isError={schemeError}
                inputLabel="Scheme Name"
                value={edit.getValue('scheme_name')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'scheme_name', 'string')
                }
                //  isError={nameError}
                {...commonTextInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHSelectBoxComponent
                selectLabel="Scheme Type"
                value={edit.getValue('scheme_type_id')}
                onChange={(e: any) =>
                  edit.update({ scheme_type_id: Number(e.target.value) })
                }
                selectItems={schemeTypes}
                isError={schemeTypeError}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <MUHSelectBoxComponent
                selectLabel="Duration"
                value={edit.getValue('duration_id')}
                onChange={(e: any) =>
                  edit.update({ duration_id: Number(e.target.value) })
                }
                selectItems={durations}
                isError={durationError}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid container size={{ xs: 12, md: 12 }} alignItems="center">
              <Grid size={{ xs: 12, md: 2.2 }}>
                <Typography
                  sx={{
                    color: theme.Colors.blackPrimary,
                    fontWeight: 400,
                    fontFamily: 'Roboto-Regular',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Monthly Installment
                  <span style={{ color: theme.Colors.redPrimary }}>*</span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 9.8 }}>
                <TextInput
                  isError={monthlyInstallError}
                  required
                  height={40}
                  fontSize={14}
                  fontWeight={500}
                  fontFamily="Roboto Slab"
                  borderRadius={2}
                  value={edit.getValue('monthly_installments')}
                  onChange={handleInstallmentChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ pr: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            ₹
                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                mx: 2,
                                height: 37,
                                color: theme.Colors.grayPrimary,
                              }}
                            />
                          </Box>
                        </InputAdornment>
                      ),
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
                  disabled={type === 'view'}
                />
              </Grid>
              <Box mt={1.5} display="flex" flexWrap="wrap" gap={1.5}>
                {variants
                  .filter(
                    (_: any, index: number) =>
                      index !== edit.getValue('editIndex')
                  )
                  .map((val: string, index: number) => (
                    <Box
                      key={`${val}-${index}`}
                      sx={{
                        display: 'flex',
                        minHeight: '30px',
                        border: `1px solid #CCCCCC`,
                        borderRadius: '4px',
                      }}
                    >
                      <Box
                        onClick={() => handleEditVariant(index)}
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
                          text={`₹ ${val}`}
                          color={theme.Colors.black}
                          weight={500}
                          family={theme.fontFamily.roboto}
                        />
                      </Box>
                      <Box
                        onClick={
                          type !== 'view'
                            ? () => removeVariant(index)
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
                  ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHSelectBoxComponent
                selectLabel="Payment Frequency"
                value={edit.getValue('payment_frequency_id')}
                onChange={(e: any) =>
                  edit.update({ payment_frequency_id: Number(e.target.value) })
                }
                selectItems={paymentFrequencies}
                isError={paymentError}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <TextInput
                inputLabel="Minimum Amount"
                value={edit.getValue('min_amount')}
                onChange={(e: any) =>
                  handleValidatedChange(e, edit, 'min_amount', 'number')
                }
                isError={minAmountError}
                {...commonTextInputProps}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHSelectBoxComponent
                selectLabel="Redemption"
                value={edit.getValue('redemption_id')}
                onChange={(e: any) =>
                  edit.update({ redemption_id: Number(e.target.value) })
                }
                selectItems={redemptionTypes}
                isError={redemptionError}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <AutoSearchSelectWithLabel
                label="Visible To"
                options={branchOptions}
                value={
                  branchOptions.find(
                    (itm) => itm.value === Number(edit.getValue('visible_to'))
                  ) ?? null
                }
                onChange={(_e, value) =>
                  edit.update({ visible_to: value?.value ?? null })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.leftItem}>
              <MUHSelectBoxComponent
                selectLabel="Status"
                value={edit.getValue('status')}
                onChange={(e: any) => edit.update({ status: e.target.value })}
                selectItems={STATUS}
                isError={statusError}
                {...commonSelectBoxProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={styles.rightItem}>
              <DragDropUpload
                labelText="T&C"
                required
                image_url={edit.getValue('terms_and_conditions_url')}
                onBrowseButtonClick={onBrowseClick}
                handleDeleteImage={handleDeleteImage}
                isError={termsError}
              />
            </Grid>
          </Grid>
        </Grid>
        <FormAction
          firstBtntxt={'Create'}
          secondBtntx={'Cancel'}
          handleCancel={handleCancel}
          handleCreate={handleCreate}
        ></FormAction>
      </Grid>
    </>
  );
};

export default CreateScheme;
