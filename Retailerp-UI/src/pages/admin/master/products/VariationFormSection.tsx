import Grid from '@mui/material/Grid2';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
  useTheme,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import TextInput from '@components/MUHTextInput';
import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import TextInputAdornment from '@pages/admin/common/TextInputAdornment';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import {
  MakingChageType,
  MeasurementType,
  PRODUCT_TYPE,
  VARIATION_TYPE,
} from '@constants/Constance';
import { Add, Clear, ExpandMore } from '@mui/icons-material';
import MUHTypography from '@components/MUHTypography';
import { AutoSearchSelectWithLabel, ButtonComponent } from '@components/index';
import { allowDecimalOnly } from '@utils/form-util';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  MeasurementAddIcon,
  MeasurementDeleteIcon,
} from '@assets/Images/AdminImages';

type Props = {
  edit: any;
  fieldErrors?: any;
  index: number;
  handleErrorUpdate?: (fieldKey: any) => void;
  purchaseRecord?: Record<string, any> | null;
};

const normalizeVisibilityValue = (value: any, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'string') {
    return value.toLowerCase() !== 'hide';
  }
  return Boolean(value);
};

const formatCurrency = (value: number, fractionDigits = 2) => {
  if (!Number.isFinite(value)) return '0.00';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const parseNumber = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getMaterialRateFromPurchaseRecord = (
  purchaseRecord?: Record<string, any> | null
) => {
  if (!purchaseRecord) return 0;
  const candidates = [
    purchaseRecord.rate_per_g,
    purchaseRecord.material_price_per_g,
    purchaseRecord.material_price,
    purchaseRecord.rate_per_gram,
  ];
  for (const candidate of candidates) {
    const num = Number(candidate);
    if (Number.isFinite(num)) return num;
  }
  return 0;
};

const VariationFormSection = ({
  edit,
  fieldErrors,
  index,
  handleErrorUpdate,
  purchaseRecord,
}: Props) => {
  const theme = useTheme();
  const itemDetails: any = edit.getValue('item_details');
  if (!itemDetails.length) return null;
  const productType = edit.getValue('product_type');
  const item = itemDetails[index];
  const selectedMaterialType = edit.getValue('material_type_id');
  const rawMaterialPrice = selectedMaterialType?.material_price;
  const dropdownMaterialRate =
    rawMaterialPrice !== null &&
    rawMaterialPrice !== undefined &&
    rawMaterialPrice !== ''
      ? parseNumber(rawMaterialPrice)
      : null;
  const stoneVisibility = normalizeVisibilityValue(
    item?.stone_visibility,
    true
  );
  const netWeight = parseNumber(item?.net_weight);
  const stoneRate = parseNumber(item?.stone_value);
  const othersRate = (item?.additional_details || []).reduce(
    (acc: number, detail: any) => acc + parseNumber(detail?.value),
    0
  );
  const materialRatePerGram =
    productType === PRODUCT_TYPE.PIECE
      ? dropdownMaterialRate !== null &&
        dropdownMaterialRate > parseNumber(item?.rate_per_gram)
        ? dropdownMaterialRate
        : parseNumber(item?.rate_per_gram)
      : dropdownMaterialRate !== null
        ? dropdownMaterialRate
        : getMaterialRateFromPurchaseRecord(purchaseRecord);
  const materialContribution = materialRatePerGram * netWeight;
  const makingChargeValue = parseNumber(item?.making_charge);
  const makingChargeType = item?.making_charge_type;
  let makingContribution = 0;
  if (makingChargeType === 'Per Gram') {
    makingContribution = makingChargeValue * netWeight;
  } else if (makingChargeType === 'Amount') {
    makingContribution = makingChargeValue;
  } else if (makingChargeType === 'Percentage') {
    makingContribution =
      (makingChargeValue / 100) * netWeight * materialRatePerGram;
  }
  const wastageValue = parseNumber(item?.wastage);
  const wastageType = item?.wastage_type;
  let wastageContribution = 0;
  if (wastageType === 'Per Gram') {
    wastageContribution = wastageValue * netWeight;
  } else if (wastageType === 'Amount') {
    wastageContribution = wastageValue;
  } else if (wastageType === 'Percentage') {
    wastageContribution =
      (wastageValue / 100) * netWeight * materialRatePerGram;
  }
  const sellingPrice =
    makingContribution +
    materialContribution +
    stoneRate +
    othersRate +
    wastageContribution;
  const formattedSellingPrice = ` ₹${formatCurrency(sellingPrice)}`;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [manualBasePrice] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isFocused, setIsFocused] = useState(false); // 🔹 Track Gross Weight focus
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wsRef = useRef<WebSocket | null>(null);

  // --- WebSocket connection for weight updates ---
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;

    ws.onopen = () => console.log('✅ Connected to weight server');
    ws.onerror = (err) => console.error('❌ WebSocket error:', err);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (isFocused && data.weight) {
          handleInputChange('gross_weight', data.weight);
        }
      } catch (err) {
        console.error('⚠️ Invalid WebSocket message:', event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [isFocused]); // reconnect only if focus changes

  const sumAdditionalWeights = (additionalDetails: any[] = []) =>
    additionalDetails.reduce((acc, detail) => {
      const weight = detail?.weight;
      if (weight === null || weight === undefined || weight === '') return acc;
      return acc + parseNumber(weight);
    }, 0);

  const recalculateNetWeight = (item: any) => {
    const grossWeight = parseNumber(item?.gross_weight);
    const stoneWeight = parseNumber(item?.stone_weight);
    const othersWeight = sumAdditionalWeights(item?.additional_details);
    const netWeight = grossWeight - stoneWeight - othersWeight;

    if (!grossWeight && !stoneWeight && !othersWeight) {
      return { ...item, net_weight: '' };
    }

    const normalizedNet = Math.max(0, Number(netWeight.toFixed(3)));
    return {
      ...item,
      net_weight: normalizedNet === 0 ? '0.000' : normalizedNet.toFixed(3),
    };
  };

  const updateItemDetails = (updater: (item: any) => any) => {
    const currentItems = edit.getValue('item_details') || [];
    const updatedItems = currentItems.map((item: any, idx: number) => {
      if (idx !== index) return item;
      const updatedItem = updater(item);
      return recalculateNetWeight(updatedItem);
    });

    edit.update({ item_details: updatedItems });
  };

  const handleInputChange = (field: string, value: any) => {
    updateItemDetails((item) => ({ ...item, [field]: value }));

    const fieldKey = `item_details_${index}_${field}`;
    if (fieldErrors?.[fieldKey]) handleErrorUpdate?.(fieldKey);
  };

  const canUpdateAgainstRemaining = (
    field: 'gross_weight' | 'quantity',
    rawValue: any
  ) => {
    if (rawValue === '' || rawValue === null || rawValue === undefined)
      return true;

    const isWithVariation =
      edit.getValue('variation_type') === VARIATION_TYPE.WITH;
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) return false;

    const remainingWeightRaw = Number(edit.getValue('remaining_weight'));
    const remainingQuantityRaw = Number(edit.getValue('remaining_quantity'));
    const itemDetailsList: any[] = edit.getValue('item_details') || [];
    const totalGrossExisting = itemDetailsList.reduce(
      (acc, detail) =>
        acc + parseNumber(detail?.gross_weight) * parseNumber(detail?.quantity),
      0
    );
    const totalQuantityExisting = itemDetailsList.reduce(
      (acc, detail) => acc + parseNumber(detail?.quantity),
      0
    );
    const grossCapacity = Number.isFinite(remainingWeightRaw)
      ? remainingWeightRaw + totalGrossExisting
      : Number.POSITIVE_INFINITY;
    const quantityCapacity = Number.isFinite(remainingQuantityRaw)
      ? remainingQuantityRaw + totalQuantityExisting
      : Number.POSITIVE_INFINITY;
    const currentGrossWeight = parseNumber(item?.gross_weight);
    const currentQuantity = parseNumber(item?.quantity);

    if (field === 'gross_weight') {
      const currentItemWeightContribution =
        currentGrossWeight * currentQuantity;
      const newItemWeightContribution = numericValue * currentQuantity;
      const newTotalGross =
        totalGrossExisting -
        currentItemWeightContribution +
        newItemWeightContribution;
      if (newTotalGross > grossCapacity) {
        toast.error(
          isWithVariation
            ? 'Total gross weight of all variations cannot exceed the available GRN weight.'
            : 'Gross weight cannot exceed the available GRN weight.'
        );
        return false;
      }
    } else if (field === 'quantity') {
      const newTotalQuantity =
        totalQuantityExisting - currentQuantity + numericValue;
      if (newTotalQuantity > quantityCapacity) {
        toast.error(
          isWithVariation
            ? 'Total quantity of all variations cannot exceed the available GRN quantity.'
            : 'Quantity cannot exceed the available GRN quantity.'
        );
        return false;
      }
      // Also check weight when quantity changes
      const currentItemWeightContribution =
        currentGrossWeight * currentQuantity;
      const newItemWeightContribution = currentGrossWeight * numericValue;
      const newTotalGross =
        totalGrossExisting -
        currentItemWeightContribution +
        newItemWeightContribution;
      if (newTotalGross > grossCapacity) {
        toast.error(
          isWithVariation
            ? 'Total gross weight of all variations cannot exceed the available GRN weight.'
            : 'Gross weight cannot exceed the available GRN weight.'
        );
        return false;
      }
    }

    return true;
  };

  const isCurrentSectionActive = productType === PRODUCT_TYPE.PIECE;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isCurrentSectionActive) return;

    const itemDetails = edit.getValue('item_details') || [];
    if (!itemDetails.length || !itemDetails[index]) return;

    const item = itemDetails[index];
    if (!manualBasePrice) {
      const autoBasePrice =
        Number(item?.net_weight || 0) * Number(item?.rate_per_gram || 0);

      if (autoBasePrice !== item?.base_price) {
        const currentItems = [...itemDetails];
        currentItems[index] = { ...item, base_price: autoBasePrice };
        edit.update({ item_details: currentItems });
      }
    }
  }, [
    edit.getValue('item_details')?.length,
    edit.getValue('item_details')[index]?.net_weight,
    edit.getValue('item_details')[index]?.rate_per_gram,
    manualBasePrice,
    isCurrentSectionActive,
  ]);

  const handleAddAdditionalDetails = () => {
    updateItemDetails((currentItem: any) => ({
      ...currentItem,
      additional_details: [
        ...(currentItem?.additional_details || []),
        {
          label_name: '',
          actual_weight: '',
          weight: '',
          value: '',
          is_visible: true,
        },
      ],
    }));
  };

  const handleAdtnlDtlsChange = (field: string, value: any, idx: number) => {
    updateItemDetails((currentItem: any) => {
      const updatedAdditional = (currentItem?.additional_details || []).map(
        (detail: any, detailIndex: number) => {
          if (detailIndex !== idx) return detail;

          const updatedDetail = { ...detail, [field]: value };
          if (field === 'actual_weight') {
            updatedDetail.weight = value;
          }
          return updatedDetail;
        }
      );

      return { ...currentItem, additional_details: updatedAdditional };
    });
  };

  const handleRemoveAdditionalDetails = (detailIndex: number) => {
    updateItemDetails((currentItem: any) => {
      const filtered =
        currentItem?.additional_details?.filter(
          (_: any, i: number) => i !== detailIndex
        ) || [];
      return { ...currentItem, additional_details: filtered };
    });
  };

  const handleMeasurementChange = (
    field: string,
    value: any,
    measurementIndex: number
  ) => {
    updateItemDetails((currentItem: any) => {
      const updatedMeasurements = (currentItem?.measurement_details || []).map(
        (measurement: any, index: number) => {
          if (index !== measurementIndex) return measurement;
          return { ...measurement, [field]: value };
        }
      );
      return { ...currentItem, measurement_details: updatedMeasurements };
    });
  };

  const handleAddMeasurement = () => {
    const currentMeasurements = item?.measurement_details || [];
    const currentMeasurement = currentMeasurements[0];

    if (
      !currentMeasurement ||
      !currentMeasurement.label_name?.trim() ||
      !currentMeasurement.value?.trim() ||
      !currentMeasurement.measurement_type
    ) {
      toast.error('Please fill all  Measurement detail.');
      return;
    }

    updateItemDetails((currentItem: any) => ({
      ...currentItem,
      measurement_details: [
        {
          label_name: '',
          value: '',
          measurement_type: '',
        },
        ...(currentItem?.measurement_details || []),
      ],
    }));
  };

  const handleRemoveMeasurement = (measurementIndex: number) => {
    updateItemDetails((currentItem: any) => {
      const filtered =
        currentItem?.measurement_details?.filter(
          (_: any, i: number) => i !== measurementIndex
        ) || [];
      return { ...currentItem, measurement_details: filtered };
    });
  };
  return (
    <Grid container width={'100%'} gap={1} flexDirection={'column'}>
      <TextInput
        inputLabel="Gross Weight"
        value={item?.gross_weight}
        onFocus={() => setIsFocused(true)} // start receiving live weight
        onBlur={() => setIsFocused(false)} // stop when unfocused
        onChange={(e: any) => {
          if (!allowDecimalOnly(e.target.value)) return;
          // if (!canUpdateAgainstRemaining('gross_weight', e.target.value))
          //   return;
          handleInputChange('gross_weight', e.target.value);
        }}
        labelFlexSize={4.3}
        isError={fieldErrors?.[`item_details_${index}_gross_weight`]}
        {...commonTextInputProps}
        slotProps={{
          input: {
            endAdornment: <TextInputAdornment text="g" position="end" />,
          },
        }}
      />
      <TextInput
        {...commonTextInputProps}
        required={false}
        inputLabel="Actual Stone Weight"
        value={item?.actual_stone_weight}
        onChange={(e: any) => {
          if (!allowDecimalOnly(e.target.value)) {
            return;
          }
          const value = e.target.value;
          updateItemDetails((currentItem: any) => ({
            ...currentItem,
            actual_stone_weight: value,
            stone_weight: value,
          }));
        }}
        labelFlexSize={4.3}
        slotProps={{
          input: {
            endAdornment: <TextInputAdornment text="g" position="end" />,
          },
        }}
      />
      <Grid container width={'100%'} mt={'8px'}>
        <Grid size={4.3}>
          <MUHTypography
            text={'Stone Weight & Value'}
            family={theme.fontFamily.roboto}
          />
        </Grid>
        <Grid container gap={1.5} size={'grow'}>
          <Grid size={4.2}>
            <TextInput
              value={item?.stone_weight}
              onChange={(e: any) => {
                if (!allowDecimalOnly(e.target.value)) return;
                handleInputChange('stone_weight', e.target.value);
              }}
              {...commonTextInputProps}
              slotProps={{
                input: {
                  endAdornment: (
                    <TextInputAdornment
                      text="g"
                      width={'65px'}
                      position="end"
                    />
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={4.2}>
            <TextInput
              value={item?.stone_value}
              onChange={(e: any) => {
                if (!allowDecimalOnly(e.target.value)) return;
                handleInputChange('stone_value', e.target.value);
              }}
              {...commonTextInputProps}
              fieldSetStyle={{ pl: '0px' }}
              padding={0.01}
              slotProps={{
                input: {
                  startAdornment: (
                    <TextInputAdornment
                      text="₹"
                      width={'50px'}
                      position="start"
                      textStyle={{ mt: 0.5 }}
                    />
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={'grow'}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stoneVisibility}
                  onChange={(e: any) =>
                    handleInputChange('stone_visibility', e.target.checked)
                  }
                  sx={{
                    color: theme.Colors.primary,
                    '&.Mui-checked': {
                      color: theme.Colors.primary,
                    },
                    zIndex: 0,
                  }}
                />
              }
              label={
                <MUHTypography
                  text={'Visibility'}
                  family={theme.fontFamily.roboto}
                  weight={500}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <TextInput
        {...commonTextInputProps}
        inputLabel="Net Weight"
        value={item?.net_weight}
        onChange={(e: any) => {
          if (!allowDecimalOnly(e.target.value)) {
            return;
          }
          handleInputChange('net_weight', e.target.value);
        }}
        isError={fieldErrors?.[`item_details_${index}_net_weight`]}
        labelFlexSize={4.3}
        disabled={true}
        slotProps={{
          input: {
            endAdornment: <TextInputAdornment text="g" position="end" />,
          },
        }}
      />

      <TextInput
        inputLabel="Quantity"
        value={item?.quantity}
        onChange={(e: any) => {
          const value = e.target.value;
          if (isNaN(Number(value))) {
            return;
          }
          if (value !== '' && Number(value) <= 0) {
            toast.error('Quantity must be greater than 0');
            return;
          }
          // if (!canUpdateAgainstRemaining('quantity', value)) {
          //   return;
          // }
          handleInputChange('quantity', value);
        }}
        labelFlexSize={4.3}
        isError={fieldErrors?.[`item_details_${index}_quantity`]}
        {...commonTextInputProps}
      />
      {productType == PRODUCT_TYPE.PIECE ? (
        <TextInput
          {...commonTextInputProps}
          inputLabel="Rate Per Gram"
          value={item?.rate_per_gram}
          onChange={(e: any) => {
            if (!allowDecimalOnly(e.target.value)) return;
            handleInputChange('rate_per_gram', e.target.value);
          }}
          isError={fieldErrors?.[`item_details_${index}_rate_per_gram`]}
          labelFlexSize={4.3}
          fieldSetStyle={{ pl: '0px' }}
          padding={0.01}
          slotProps={{
            input: {
              startAdornment: <TextInputAdornment text="₹" position="start" />,
            },
          }}
        />
      ) : null}

      <Grid container width={'100%'} mt={'8px'}>
        <Grid size={4.3}>
          <Typography
            sx={{
              color: fieldErrors?.[`item_details_${index}_making_charge`]
                ? theme.Colors.redPrimary
                : 'auto',
            }}
          >
            Making Charge{' '}
            <span
              style={{
                color: theme.Colors.redPrimary,
                fontWeight: theme.fontWeight.medium,
                fontSize: theme.MetricsSizes.small_xx,
              }}
            >
              *
            </span>
          </Typography>
        </Grid>

        <Grid container gap={1} size={'grow'}>
          <Grid size={5.9}>
            <MUHSelectBoxComponent
              value={item?.making_charge_type}
              onChange={(e: any) => {
                const newType = e.target.value;
                updateItemDetails((currentItem: any) => ({
                  ...currentItem,
                  making_charge_type: newType,
                  making_charge: '',
                }));
              }}
              selectItems={MakingChageType}
              {...commonSelectBoxProps}
            />
          </Grid>

          <Grid size={'grow'}>
            <TextInput
              {...commonTextInputProps}
              value={item?.making_charge}
              onChange={(e: any) => {
                const value = e.target.value;

                if (!allowDecimalOnly(value)) return;

                if (value !== '' && Number(value) <= 0) {
                  toast.error('Making charge must be greater than 0');
                  return;
                }

                if (value === '') {
                  handleInputChange('making_charge', '');
                  return;
                }

                handleInputChange('making_charge', value);
              }}
              isError={fieldErrors?.[`item_details_${index}_making_charge`]}
              slotProps={{
                input: {
                  endAdornment: (
                    <TextInputAdornment
                      text={
                        item?.making_charge_type === 'Percentage' ? '%' : '₹'
                      }
                      width={55}
                      position="end"
                    />
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container width={'100%'} mt={'8px'}>
        <Grid size={4.3}>
          <Typography
            sx={{
              color: fieldErrors?.[`item_details_${index}_wastage_charge`]
                ? theme.Colors.redPrimary
                : 'auto',
            }}
          >
            Wastage{' '}
            <span
              style={{
                color: theme.Colors.redPrimary,
                fontWeight: theme.fontWeight.medium,
                fontSize: theme.MetricsSizes.small_xx,
              }}
            >
              *
            </span>
          </Typography>
        </Grid>
        <Grid container gap={1} size={'grow'}>
          <Grid size={5.9}>
            <MUHSelectBoxComponent
              value={item?.wastage_type}
              onChange={(e: any) => {
                const newType = e.target.value;
                updateItemDetails((currentItem: any) => ({
                  ...currentItem,
                  wastage_type: newType,
                  wastage: '',
                }));
              }}
              selectItems={MakingChageType}
              {...commonSelectBoxProps}
            />
          </Grid>
          <Grid size={'grow'}>
            <TextInput
              {...commonTextInputProps}
              value={item?.wastage}
              onChange={(e: any) => {
                if (!allowDecimalOnly(e.target.value)) {
                  return;
                }
                handleInputChange('wastage', e.target.value);
              }}
              isError={fieldErrors?.[`item_details_${index}_wastage`]}
              fieldSetStyle={{ pl: '0px' }}
              padding={0.01}
              slotProps={{
                input: {
                  startAdornment: (
                    <TextInputAdornment
                      text={item.wastage_type == 'Percentage' ? '%' : '₹'}
                      width={'50px'}
                      position="start"
                      textStyle={{ mt: 0.5 }}
                    />
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container width={'100%'} mt={'8px'}>
        <Grid size={4.3}>
          <Typography
            sx={{
              color: 'auto',
            }}
          >
            Website Price
          </Typography>
        </Grid>
        <Grid container gap={1} size={'grow'}>
          <Grid size={5.9}>
            <MUHSelectBoxComponent
              value={item?.website_price_type}
              onChange={(e: any) =>
                handleInputChange('website_price_type', e.target.value)
              }
              selectItems={MakingChageType}
              {...commonSelectBoxProps}
            />
          </Grid>
          <Grid size={'grow'}>
            <TextInput
              {...commonTextInputProps}
              value={item?.website_price}
              onChange={(e: any) => {
                if (!allowDecimalOnly(e.target.value)) {
                  return;
                }
                handleInputChange('website_price', e.target.value);
              }}
              fieldSetStyle={{ pl: '0px' }}
              padding={0.01}
              slotProps={{
                input: {
                  startAdornment: (
                    <TextInputAdornment
                      text={item.website_price_type == 'Percentage' ? '%' : '₹'}
                      width={'50px'}
                      position="start"
                      textStyle={{ mt: 0.5 }}
                    />
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid size={4.3} mt={1.5}>
          Measurement Details
        </Grid>
        <Grid
          container
          mt={'6px'}
          gap={1}
          size={'grow'}
          flexDirection={'column'}
        >
          {(item?.measurement_details || []).map(
            (measurement: any, measurementIndex: number) => (
              <Grid
                container
                key={measurementIndex}
                gap={1}
                alignItems={'center'}
              >
                <Grid size={3.5}>
                  <TextInput
                    placeholderText="Label Name"
                    placeholderColor={theme.Colors.grayWhiteDark}
                    placeholderFontSize={13.5}
                    value={measurement?.label_name || ''}
                    onChange={(e: any) =>
                      handleMeasurementChange(
                        'label_name',
                        e.target.value,
                        measurementIndex
                      )
                    }
                    {...commonTextInputProps}
                  />
                </Grid>
                <Grid size={3.5}>
                  <TextInput
                    placeholderText="Value"
                    placeholderColor={theme.Colors.grayWhiteDark}
                    placeholderFontSize={13.5}
                    value={measurement?.value || ''}
                    onChange={(e: any) =>
                      handleMeasurementChange(
                        'value',
                        e.target.value,
                        measurementIndex
                      )
                    }
                    {...commonTextInputProps}
                  />
                </Grid>
                <Grid size={3.5}>
                  <AutoSearchSelectWithLabel
                    value={measurement?.measurement_type || ''}
                    onChange={(_, value: any) =>
                      handleMeasurementChange(
                        'measurement_type',
                        value,
                        measurementIndex
                      )
                    }
                    options={MeasurementType}
                    {...commonSelectBoxProps}
                    required={false}
                  />
                </Grid>
                <Grid
                  size={'grow'}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {measurementIndex > 0 ? (
                    <img
                      onClick={() => handleRemoveMeasurement(measurementIndex)}
                      src={MeasurementDeleteIcon}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : null}
                  {measurementIndex === 0 ? (
                    <img
                      onClick={handleAddMeasurement}
                      src={MeasurementAddIcon}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : null}
                </Grid>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
      <Grid size={12} mt={1}>
        {item?.additional_details?.length > 0 ? (
          <Accordion
            defaultExpanded
            sx={{
              width: '100%',
              mb: 1.5,
              boxShadow: 'none',
              overflow: 'visible',
            }}
          >
            <AccordionSummary
              sx={{
                padding: '0px !important',
                height: '24px !important',
                minHeight: '0px !important',
                borderBottom: '1px solid #B6B6B6',
              }}
              expandIcon={<ExpandMore sx={{ color: '#B6B6B6' }} />}
            >
              <MUHTypography
                text={'Additional Details'}
                size={15.5}
                weight={600}
                color={theme.Colors.primary}
                family={theme.fontFamily.roboto}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '10px 0px' }}>
              <Grid container flexDirection={'column'} gap={1.5} width={'100%'}>
                {item?.additional_details?.map((detail: any, index: number) => (
                  <Grid
                    container
                    key={index}
                    sx={{
                      flexDirection: 'column',
                      width: '100%',
                      border: `1px solid ${theme.Colors.grayLight}`,
                      borderRadius: '8px',
                      p: 1.5,
                      pt: 0.5,
                      gap: 1.5,
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      onClick={() => handleRemoveAdditionalDetails(index)}
                      sx={{
                        position: 'absolute',
                        top: -9,
                        right: -9,
                        width: 20,
                        height: 20,
                        background: theme.Colors.whitePrimary,
                        border: `1px solid ${theme.Colors.grayBorderLight}`,
                        borderRadius: '4px',
                      }}
                    >
                      <Clear
                        sx={{
                          fontSize: 13,
                          color: theme.Colors.blackLightLow,
                        }}
                      />
                    </IconButton>
                    <TextInput
                      inputLabel="Label Name"
                      value={detail?.label_name}
                      onChange={(e: any) =>
                        handleAdtnlDtlsChange(
                          'label_name',
                          e.target.value,
                          index
                        )
                      }
                      labelFlexSize={4.3}
                      {...commonTextInputProps}
                      required={false}
                    />
                    <TextInput
                      inputLabel="Actual Weight"
                      value={detail?.actual_weight}
                      onChange={(e: any) => {
                        if (!allowDecimalOnly(e.target.value)) return;
                        handleAdtnlDtlsChange(
                          'actual_weight',
                          e.target.value,
                          index
                        );
                      }}
                      labelFlexSize={4.3}
                      {...commonTextInputProps}
                      required={false}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <TextInputAdornment text="g" position="end" />
                          ),
                        },
                      }}
                    />
                    <Grid container width={'100%'} mt={'8px'}>
                      <Grid size={4.3}>
                        <MUHTypography
                          text={'Weight & Value'}
                          family={theme.fontFamily.roboto}
                        />
                      </Grid>
                      <Grid container gap={1.5} size={'grow'}>
                        <Grid size={4.2}>
                          <TextInput
                            value={detail?.weight}
                            onChange={(e: any) => {
                              if (!allowDecimalOnly(e.target.value)) return;
                              handleAdtnlDtlsChange(
                                'weight',
                                e.target.value,
                                index
                              );
                            }}
                            {...commonTextInputProps}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <TextInputAdornment
                                    text="g"
                                    width={'67px'}
                                    position="end"
                                  />
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={4.2}>
                          <TextInput
                            value={detail?.value}
                            onChange={(e: any) => {
                              if (!allowDecimalOnly(e.target.value)) return;
                              handleAdtnlDtlsChange(
                                'value',
                                e.target.value,
                                index
                              );
                            }}
                            {...commonTextInputProps}
                            fieldSetStyle={{ pl: '0px' }}
                            padding={0.01}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <TextInputAdornment
                                    text="₹"
                                    width={'50px'}
                                    position="start"
                                    textStyle={{ mt: 0.5 }}
                                  />
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={'grow'}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={normalizeVisibilityValue(
                                  detail?.is_visible ?? detail?.visibility,
                                  true
                                )}
                                onChange={(e: any) =>
                                  handleAdtnlDtlsChange(
                                    'is_visible',
                                    e.target.checked,
                                    index
                                  )
                                }
                                sx={{
                                  color: theme.Colors.primary,
                                  '&.Mui-checked': {
                                    color: theme.Colors.primary,
                                  },
                                }}
                              />
                            }
                            label={
                              <MUHTypography
                                text={'Visibility'}
                                family={theme.fontFamily.roboto}
                                weight={500}
                              />
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}

                <Box display={'flex'} justifyContent={'flex-end'}>
                  <ButtonComponent
                    startIcon={<Add />}
                    buttonText={'Add'}
                    buttonFontSize={14}
                    bgColor={theme.Colors.primary}
                    buttonTextColor={theme.Colors.whitePrimary}
                    buttonFontWeight={500}
                    btnBorderRadius={2}
                    btnHeight={30}
                    padding={1.4}
                    btnWidth={75}
                    buttonStyle={{ fontFamily: 'Roboto-Regular' }}
                    onClick={handleAddAdditionalDetails}
                  />
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : (
          <Grid
            container
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <MUHTypography
              text={'Additional Details'}
              size={15.5}
              weight={600}
              color={theme.Colors.primary}
              family={theme.fontFamily.roboto}
            />
            <Box display={'flex'} justifyContent={'flex-end'}>
              <ButtonComponent
                startIcon={<Add />}
                buttonText={'Add'}
                buttonFontSize={14}
                bgColor={theme.Colors.primary}
                buttonTextColor={theme.Colors.whitePrimary}
                buttonFontWeight={500}
                btnBorderRadius={2}
                btnHeight={30}
                padding={1.4}
                btnWidth={75}
                buttonStyle={{ fontFamily: 'Roboto-Regular' }}
                onClick={handleAddAdditionalDetails}
              />
            </Box>
          </Grid>
        )}
      </Grid>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          height: '50px',
          paddingInline: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <MUHTypography
            text={'Selling Price : '}
            family={theme.fontFamily.roboto}
            weight={600}
            color={theme.Colors.black}
          />
          <MUHTypography
            text={formattedSellingPrice}
            family={theme.fontFamily.roboto}
            weight={600}
            color={theme.Colors.primary}
          />
        </Box>
        <Typography
          sx={{
            color: theme.Colors.primary,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: theme.fontFamily.roboto,
            textDecoration: 'underline',
          }}
        >
          Price Breakup
        </Typography>
      </Box>
    </Grid>
  );
};

export default VariationFormSection;
