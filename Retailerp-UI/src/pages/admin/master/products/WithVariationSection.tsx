import { Box, IconButton, InputAdornment, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Clear } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '@components/MUHTextInput';
import MUHTypography from '@components/MUHTypography';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import { ButtonComponent } from '@components/index';
import {
  commonSelectBoxProps,
  commonTextInputProps,
} from '@components/CommonStyles';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import {
  cloneVariationsState,
  createEmptyVariationRow,
  getDefaultVariationsState,
  VariationsState,
  VariationSelectionRow,
  VariationValueSelection,
} from './utils/variationUtils';
import { MeasurementDeleteIcon } from '@assets/Images/AdminImages';

type Option = {
  label: string;
  value: string | number;
};

type CombinationFormState = {
  selectedValues: Record<string, string | number>;
  copies: string;
  editingId: string | null;
};

type Props = {
  edit: any;
};

const copyRegex = /^\d*$/;

const getCombinationLabel = (variation: Record<string, string>) =>
  Object.values(variation || {})
    .filter(Boolean)
    .join(' / ');

const normalizeKey = (value: string | number | null | undefined) =>
  value === null || value === undefined ? '' : String(value);

const getCombinationKey = (variation: Record<string, string>) => {
  const normalized: Record<string, string> = {};
  Object.keys(variation || {})
    .sort()
    .forEach((key) => {
      normalized[key] = variation[key];
    });
  return JSON.stringify(normalized);
};

const createEmptyItemDetail = (
  variation: Record<string, string>,
  skuId: string
) => ({
  sku_id: skuId,
  variation,
  combination: getCombinationLabel(variation),
  gross_weight: '',
  net_weight: '',
  actual_stone_weight: '',
  stone_weight: '',
  stone_value: '',
  stone_visibility: true,
  quantity: '',
  making_charge_type: 'Percentage',
  making_charge: '',
  wastage_type: 'Percentage',
  wastage: '',
  website_price_type: 'Amount',
  website_price: '',
  rate_per_gram: '',
  base_price: '',
  tag_url: '',
  measurement_details: [
    {
      label_name: '',
      value: '',
      measurement_type: '',
    },
  ],
  additional_details: [],
});

const getVariationMapFromSelections = (
  selections: Record<string, VariationValueSelection>,
  selectionOrder: VariationSelectionRow[]
) => {
  const map: Record<string, string> = {};
  const consumed = new Set<string>();

  selectionOrder.forEach((row) => {
    const variantId = normalizeKey(row.variantType?.value);
    if (!variantId) return;
    const selection = selections?.[variantId];
    if (!selection) return;
    map[selection.variantLabel] = selection.valueLabel;
    consumed.add(variantId);
  });

  Object.entries(selections || {}).forEach(([variantId, selection]) => {
    if (consumed.has(variantId)) return;
    map[selection.variantLabel] = selection.valueLabel;
  });

  return map;
};

const removeItemsByKey = (items: any[], key: string) =>
  (items || []).filter(
    (item) => getCombinationKey(item?.variation || {}) !== key
  );

const updateItemsForVariantRemoval = (
  items: any[],
  oldKey: string,
  newMap: Record<string, string>
) =>
  (items || []).map((item) => {
    if (getCombinationKey(item?.variation || {}) !== oldKey) return item;
    return {
      ...item,
      variation: { ...newMap },
      combination: getCombinationLabel(newMap),
    };
  });

const extractSkuIndex = (sku?: string | null) => {
  if (!sku) return null;
  const parts = sku.split('_');
  const suffix = parts[parts.length - 1];
  const value = Number(suffix);
  return Number.isFinite(value) ? value : null;
};

const getNextSkuId = (baseSku: string, items: any[]) => {
  const maxIndex = (items || []).reduce((acc, item) => {
    const idx = extractSkuIndex(item?.sku_id);
    if (idx !== null && idx > acc) {
      return idx;
    }
    return acc;
  }, 0);
  const nextIndex = maxIndex + 1;
  const padLength = Math.max(2, String(nextIndex).length);
  return `${baseSku}_${String(nextIndex).padStart(padLength, '0')}`;
};

const WithVariationSection = ({ edit }: Props) => {
  const theme = useTheme();
  const [variantTypeOptions, setVariantTypeOptions] = useState<Option[]>([]);
  const [variantValueMap, setVariantValueMap] = useState<
    Record<string, Option[]>
  >({});
  const [combinationForm, setCombinationForm] = useState<CombinationFormState>({
    selectedValues: {},
    copies: '',
    editingId: null,
  });

  const variationState: VariationsState =
    edit.getValue('variations') || getDefaultVariationsState();

  useEffect(() => {
    if (!edit.getValue('variations')) {
      edit.update({ variations: getDefaultVariationsState() });
    }
  }, [edit]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res: any = await DropDownServiceAll.getAllVarients();
        if (
          res?.data?.statusCode === 200 &&
          res?.data?.data?.variants?.length
        ) {
          const variants = res.data.data.variants;
          const typeOptions = variants.map((variant: any) => ({
            label: variant['Variant Type'],
            value: variant['id'],
          }));
          const valueOptions: Record<string, Option[]> = {};
          variants.forEach((variant: any) => {
            valueOptions[normalizeKey(variant['id'])] = (
              variant.Values || []
            ).map((val: any) => ({
              label: val.value,
              value: val.id,
            }));
          });
          setVariantTypeOptions(typeOptions);
          setVariantValueMap(valueOptions);
        }
      } catch (error) {
        console.error('Error fetching variants', error);
        toast.error('Failed to load variant types');
      }
    };

    fetchVariants();
  }, []);

  const resetCombinationForm = () =>
    setCombinationForm({ selectedValues: {}, copies: '', editingId: null });

  const handleAddVariation = () => {
    const lastRow =
      variationState.selections[variationState.selections.length - 1];

    if (lastRow && (!lastRow.variantType || !lastRow.variantValueIds?.length)) {
      toast.error('Please select variant type and values before adding new.');
      return;
    }

    const nextState = cloneVariationsState(variationState);
    nextState.selections.push(createEmptyVariationRow());
    edit.update({ variations: nextState });
  };

  const detachVariantFromState = (
    state: VariationsState,
    variantId: string | number,
    variantLabel?: string,
    currentItems: any[] = []
  ) => {
    let updatedItems = [...(currentItems || [])];
    const updatedCombos: typeof state.combinations = [];

    state.combinations.forEach((combo) => {
      const key = normalizeKey(variantId);
      if (!combo.selections?.[key]) {
        updatedCombos.push(combo);
        return;
      }

      const oldMap = getVariationMapFromSelections(
        combo.selections,
        variationState.selections
      );
      const oldKey = getCombinationKey(oldMap);
      const newSelections = { ...combo.selections };
      delete newSelections[key];

      if (!Object.keys(newSelections).length) {
        updatedItems = removeItemsByKey(updatedItems, oldKey);
        return;
      }

      const newMap = getVariationMapFromSelections(
        newSelections,
        state.selections
      );
      updatedItems = updateItemsForVariantRemoval(updatedItems, oldKey, newMap);
      updatedCombos.push({
        ...combo,
        selections: newSelections,
      });
    });

    state.combinations = updatedCombos;

    if (variantLabel) {
      updatedItems = updatedItems.map((item) => {
        if (!item?.variation || !(variantLabel in item.variation)) {
          return item;
        }
        const updatedVariation = { ...item.variation };
        delete updatedVariation[variantLabel];
        return {
          ...item,
          variation: updatedVariation,
          combination: getCombinationLabel(updatedVariation),
        };
      });
    }

    return { state, updatedItems };
  };

  const handleVariantTypeChange = (rowId: string, option: Option | null) => {
    const nextState = cloneVariationsState(variationState);
    const rowIndex = nextState.selections.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    if (
      option &&
      nextState.selections.some(
        (row, index) =>
          index !== rowIndex && row.variantType?.value === option.value
      )
    ) {
      toast.error('Variant type already selected.');
      return;
    }

    const currentItems = edit.getValue('item_details') || [];
    let updatedItems = [...currentItems];
    const currentRow = nextState.selections[rowIndex];

    if (currentRow.variantType?.value) {
      const result = detachVariantFromState(
        nextState,
        currentRow.variantType.value,
        currentRow.variantType.label,
        updatedItems
      );
      updatedItems = result.updatedItems;
    }

    nextState.selections[rowIndex] = {
      ...currentRow,
      variantType: option,
      variantValueIds: [],
    };

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });
    resetCombinationForm();
  };

  const handleVariantValueChange = (rowId: string, values: any) => {
    const nextState = cloneVariationsState(variationState);
    const rowIndex = nextState.selections.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    const row = nextState.selections[rowIndex];
    const normalizedValues = Array.isArray(values) ? values : [];
    const nextValueSet = new Set(
      normalizedValues.map((val) => normalizeKey(val))
    );
    const variantId = row.variantType?.value;

    let updatedItems = [...(edit.getValue('item_details') || [])];

    if (variantId) {
      const key = normalizeKey(variantId);
      const keptCombinations: typeof nextState.combinations = [];

      nextState.combinations.forEach((combo) => {
        const selection = combo.selections?.[key];
        if (!selection) {
          keptCombinations.push(combo);
          return;
        }

        if (nextValueSet.has(normalizeKey(selection.valueId))) {
          keptCombinations.push(combo);
          return;
        }

        const map = getVariationMapFromSelections(
          combo.selections,
          variationState.selections
        );
        updatedItems = removeItemsByKey(updatedItems, getCombinationKey(map));
      });

      nextState.combinations = keptCombinations;
    }

    nextState.selections[rowIndex] = {
      ...row,
      variantValueIds: normalizedValues,
    };

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });
    resetCombinationForm();
  };

  const handleRemoveVariation = (rowId: string) => {
    const nextState = cloneVariationsState(variationState);
    const rowIndex = nextState.selections.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    let updatedItems = [...(edit.getValue('item_details') || [])];
    const row = nextState.selections[rowIndex];

    if (row.variantType?.value) {
      const result = detachVariantFromState(
        nextState,
        row.variantType.value,
        row.variantType.label,
        updatedItems
      );
      updatedItems = result.updatedItems;
    }

    nextState.selections.splice(rowIndex, 1);

    if (!nextState.selections.length) {
      nextState.selections = [createEmptyVariationRow()];
      nextState.combinations = [];
      updatedItems = [];
    }

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });
    resetCombinationForm();
  };

  const combinationReadyRows = useMemo(
    () =>
      variationState.selections.filter(
        (row) => row.variantType && row.variantValueIds.length
      ),
    [variationState.selections]
  );

  const getValueOptions = (row: VariationSelectionRow) => {
    if (!row.variantType) return [];
    const key = normalizeKey(row.variantType.value);
    const options = variantValueMap[key] || [];
    if (options.length) return options;
    return row.variantValueIds.map((value) => ({
      label: String(value),
      value,
    }));
  };

  const handleCombinationValueChange = (
    variantId: string | number,
    value: string | number
  ) => {
    setCombinationForm((prev) => ({
      ...prev,
      selectedValues: {
        ...prev.selectedValues,
        [normalizeKey(variantId)]: value,
      },
    }));
  };

  const handleCopiesChange = (value: string) => {
    if (!copyRegex.test(value)) return;
    setCombinationForm((prev) => ({ ...prev, copies: value }));
  };

  const buildSelectionRecord = () => {
    const record: Record<string, VariationValueSelection> = {};

    for (const row of combinationReadyRows) {
      const variantType = row.variantType;
      const variantId = variantType?.value;
      if (!variantId || !variantType) continue;
      const key = normalizeKey(variantId);
      const selectedValue = combinationForm.selectedValues[key];
      if (
        selectedValue === undefined ||
        selectedValue === null ||
        selectedValue === ''
      ) {
        return null;
      }

      const options = variantValueMap[key] || [];
      const match =
        options.find((option) => option.value === selectedValue) || null;
      record[key] = {
        variantId,
        variantLabel: variantType.label,
        valueId: selectedValue,
        valueLabel: match?.label || String(selectedValue),
      };
    }

    return record;
  };

  const createCombination = (
    selections: Record<string, VariationValueSelection>,
    copies: number
  ) => {
    const nextState = cloneVariationsState(variationState);
    const currentItems = edit.getValue('item_details') || [];
    const baseSku = edit.getValue('sku_id') || 'SKU';

    const variationMap = getVariationMapFromSelections(
      selections,
      nextState.selections
    );

    const updatedItems = [...currentItems];
    for (let i = 0; i < copies; i += 1) {
      const sku = getNextSkuId(baseSku, updatedItems);
      updatedItems.push(createEmptyItemDetail(variationMap, sku));
    }

    nextState.combinations.push({
      id: `${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
      selections,
      copies,
    });

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });
  };

  const updateCombination = (
    combinationId: string,
    selections: Record<string, VariationValueSelection>,
    copies: number
  ) => {
    const nextState = cloneVariationsState(variationState);
    const comboIndex = nextState.combinations.findIndex(
      (combo) => combo.id === combinationId
    );
    if (comboIndex === -1) return;

    const baseSku = edit.getValue('sku_id') || 'SKU';
    let updatedItems = [...(edit.getValue('item_details') || [])];
    const existingCombo = nextState.combinations[comboIndex];

    const oldMap = getVariationMapFromSelections(
      existingCombo.selections,
      variationState.selections
    );
    const newMap = getVariationMapFromSelections(
      selections,
      nextState.selections
    );

    const oldKey = getCombinationKey(oldMap);
    const matchedIndexes: number[] = [];

    updatedItems.forEach((item, index) => {
      if (getCombinationKey(item?.variation || {}) === oldKey) {
        matchedIndexes.push(index);
      }
    });

    const existingCount = matchedIndexes.length;
    const minCount = Math.min(existingCount, copies);

    for (let i = 0; i < minCount; i += 1) {
      const idx = matchedIndexes[i];
      updatedItems[idx] = {
        ...updatedItems[idx],
        variation: { ...newMap },
        combination: getCombinationLabel(newMap),
      };
    }

    if (existingCount > copies) {
      const removeCount = existingCount - copies;
      for (let i = 0; i < removeCount; i += 1) {
        const removeIndex = matchedIndexes[existingCount - 1 - i];
        updatedItems.splice(removeIndex, 1);
      }
    } else if (copies > existingCount) {
      const addCount = copies - existingCount;
      for (let i = 0; i < addCount; i += 1) {
        const sku = getNextSkuId(baseSku, updatedItems);
        updatedItems.push(createEmptyItemDetail(newMap, sku));
      }
    }

    nextState.combinations[comboIndex] = {
      ...existingCombo,
      selections,
      copies,
    };

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });
  };

  const handleApplyCombination = () => {
    if (!combinationReadyRows.length) {
      toast.error('Add at least one variation with values.');
      return;
    }

    const selections = buildSelectionRecord();
    if (!selections) {
      toast.error('Select a value for each variation.');
      return;
    }

    const copies = Number(combinationForm.copies);
    if (!copies || copies < 1) {
      toast.error('Enter a valid number of copies.');
      return;
    }

    const existing = variationState.combinations.find(
      (combo) =>
        getCombinationKey(
          getVariationMapFromSelections(
            combo.selections,
            variationState.selections
          )
        ) ===
        getCombinationKey(
          getVariationMapFromSelections(selections, variationState.selections)
        )
    );

    if (combinationForm.editingId) {
      updateCombination(combinationForm.editingId, selections, copies);
    } else if (existing) {
      updateCombination(existing.id, selections, copies);
    } else {
      createCombination(selections, copies);
    }

    resetCombinationForm();
  };

  const handleCombinationChipClick = (comboId: string) => {
    const combo = variationState.combinations.find(
      (item) => item.id === comboId
    );
    if (!combo) return;

    const selectedValues: Record<string, string | number> = {};
    Object.entries(combo.selections || {}).forEach(([variantId, selection]) => {
      selectedValues[variantId] = selection.valueId;
    });

    setCombinationForm({
      selectedValues,
      copies: String(combo.copies),
      editingId: combo.id,
    });
  };

  const handleDeleteCombination = (comboId: string) => {
    const nextState = cloneVariationsState(variationState);
    const comboIndex = nextState.combinations.findIndex(
      (combo) => combo.id === comboId
    );
    if (comboIndex === -1) return;

    const combo = nextState.combinations[comboIndex];
    const map = getVariationMapFromSelections(
      combo.selections,
      variationState.selections
    );
    const updatedItems = removeItemsByKey(
      edit.getValue('item_details') || [],
      getCombinationKey(map)
    );

    nextState.combinations.splice(comboIndex, 1);

    edit.update({
      variations: nextState,
      item_details: updatedItems,
    });

    if (combinationForm.editingId === comboId) {
      resetCombinationForm();
    }
  };

  const combinationChips = useMemo(
    () =>
      variationState.combinations.map((combo) => {
        const map = getVariationMapFromSelections(
          combo.selections,
          variationState.selections
        );
        return {
          id: combo.id,
          label: getCombinationLabel(map) || 'Combination',
          copies: combo.copies,
        };
      }),
    [variationState.combinations, variationState.selections]
  );

  return (
    <Grid container flexDirection="column" gap={2} width="100%">
      <Box
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          padding: 2,
          position: 'relative',
        }}
      >
        <Grid container flexDirection="column">
          {variationState.selections.map((row: any, idx: number) => (
            <Grid container pb={1} alignItems="center" key={row.id}>
              <Grid size={3.6}>
                {idx === 0 ? (
                  <MUHTypography
                    text="Select Variations"
                    size={14}
                    color={theme.Colors.black}
                    family={theme.fontFamily.roboto}
                  />
                ) : null}
              </Grid>
              <Grid size={3.8} pr={0.5}>
                <AutoSearchSelectWithLabel
                  options={variantTypeOptions}
                  value={row.variantType}
                  onChange={(_e: any, value: Option | null) =>
                    handleVariantTypeChange(row.id, value)
                  }
                  placeholder="Select Type"
                  placeholdrStyle={{ color: theme.Colors.grayDim }}
                />
              </Grid>
              <Grid size={3.8}>
                <MUHSelectBoxComponent
                  placeholderText={
                    row.variantType
                      ? `Select ${row.variantType.label} values`
                      : 'Select values'
                  }
                  selectItems={getValueOptions(row)}
                  value={row.variantValueIds}
                  onChange={(event: any) =>
                    handleVariantValueChange(row.id, event.target.value)
                  }
                  {...commonSelectBoxProps}
                  multiple
                  isCheckbox={true}
                />
              </Grid>
              <Grid size={'grow'} pt={1} pl={1}>
                <img
                  onClick={() => handleRemoveVariation(row.id)}
                  src={MeasurementDeleteIcon}
                  style={{ cursor: 'pointer' }}
                />
              </Grid>
            </Grid>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={0.5}>
            <ButtonComponent
              startIcon={<Add />}
              buttonText="Add"
              buttonFontSize={14}
              bgColor={theme.Colors.primary}
              buttonTextColor={theme.Colors.whitePrimary}
              buttonFontWeight={500}
              btnBorderRadius={2}
              btnHeight={34}
              padding={1.4}
              btnWidth={100}
              buttonStyle={{ fontFamily: 'Roboto-Regular' }}
              onClick={handleAddVariation}
            />
          </Box>
        </Grid>
      </Box>

      <Box
        sx={{
          border: `1px solid ${theme.Colors.grayLight}`,
          borderRadius: '8px',
          padding: 2,
          position: 'relative',
        }}
      >
        {combinationReadyRows.length ? (
          <Grid container gap={0.5} alignItems="flex-end">
            <Grid size={3.5}>
              <MUHTypography
                text="Combinations"
                size={14}
                color={theme.Colors.black}
                family={theme.fontFamily.roboto}
                sx={{ mb: 1.5 }}
              />
            </Grid>

            {combinationReadyRows.map((row) => {
              const variantId = row.variantType?.value;
              const key = normalizeKey(variantId);
              const options = row.variantValueIds.map((value) => {
                const mapped =
                  (variantValueMap[key] || []).find(
                    (opt) => opt.value === value
                  ) || null;
                return mapped || { label: String(value), value };
              });

              return (
                <Grid
                  size={combinationReadyRows.length > 1 ? 2.7 : 3.9}
                  key={row.id}
                >
                  <MUHSelectBoxComponent
                    placeholderText={
                      row.variantType?.label
                        ? `Select ${row.variantType.label}`
                        : 'Select'
                    }
                    value={combinationForm.selectedValues[key] || ''}
                    onChange={(event: any) =>
                      handleCombinationValueChange(
                        variantId as string | number,
                        event.target.value
                      )
                    }
                    selectItems={options}
                    {...commonSelectBoxProps}
                  />
                </Grid>
              );
            })}
            <Grid size={combinationReadyRows.length <= 2 ? 'grow' : 3.8}>
              <TextInput
                {...commonTextInputProps}
                placeholderText="No. of Copies"
                placeholderColor={theme.Colors.grayDim}
                placeholderFontSize={14}
                value={combinationForm.copies}
                onChange={(event: any) =>
                  handleCopiesChange(event.target.value)
                }
                required={false}
                labelFlexSize={0}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleApplyCombination}
                          sx={{
                            background: theme.Colors.primaryLight,
                            borderRadius: '8px',
                            '&:hover': {
                              background: theme.Colors.primaryLight,
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Add sx={{ color: theme.Colors.primary }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        ) : 
        (
          <MUHTypography
            text="Add at least one variation with values to configure combinations."
            size={13.5}
            weight={500}
            color={theme.Colors.grayDim}
            family={theme.fontFamily.roboto}
            sx={{ mt: 1 }}
          />
        )
        }
      </Box>

      {combinationChips.length ? (
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {combinationChips.map((chip) => {
            const isActive = combinationForm.editingId === chip.id;
            return (
              <Box
                key={chip.id}
                onClick={() => handleCombinationChipClick(chip.id)}
                sx={{
                  border: `1px solid ${
                    isActive
                      ? theme.Colors.primary
                      : theme.Colors.grayBorderLight
                  }`,
                  background: theme.Colors.whitePrimary,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    padding: '0px 12px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MUHTypography
                    text={chip.label}
                    size={14}
                    weight={400}
                    color={theme.Colors.black}
                    family={theme.fontFamily.roboto}
                  />
                </Box>
                <Box
                  sx={{
                    width: '1px',
                    height: '30px',
                    background: theme.Colors.grayBorderLight,
                  }}
                />
                <Box
                  sx={{
                    padding: '0px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minWidth: '40px',
                    justifyContent: 'center',
                  }}
                >
                  <MUHTypography
                    text={String(chip.copies)}
                    size={14}
                    color={theme.Colors.black}
                    family={theme.fontFamily.roboto}
                  />
                </Box>
                <Box
                  sx={{
                    width: '1px',
                    height: '30px',
                    background: theme.Colors.grayBorderLight,
                  }}
                />
                <Box
                  sx={{
                    padding: '0px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minWidth: '30px',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteCombination(chip.id);
                    }}
                    sx={{
                      padding: '1px',
                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
                  >
                    <Clear
                      sx={{ fontSize: 16, color: theme.Colors.blackLightLow }}
                    />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Grid>
  );
};

export default WithVariationSection;
