export type VariationOption = {
  label: string;
  value: string | number;
};

export type VariationSelectionRow = {
  id: string;
  variantType: VariationOption | null;
  variantValueIds: Array<string | number>;
};

export type VariationValueSelection = {
  variantId: string | number | null;
  variantLabel: string;
  valueId: string | number;
  valueLabel: string;
};

export type CombinationEntry = {
  id: string;
  selections: Record<string, VariationValueSelection>;
  copies: number;
};

export type VariationsState = {
  selections: VariationSelectionRow[];
  combinations: CombinationEntry[];
};

const generateId = () =>
  `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

export const createEmptyVariationRow = (): VariationSelectionRow => ({
  id: generateId(),
  variantType: null,
  variantValueIds: [],
});

export const getDefaultVariationsState = (): VariationsState => ({
  selections: [createEmptyVariationRow()],
  combinations: [],
});

type LegacyVariationRow = {
  id?: string;
  variation?: string;
  values?: Array<string | number>;
  variant_id?: string | number;
};

const normalizeLegacyRows = (rows: LegacyVariationRow[]) => {
  if (!Array.isArray(rows) || !rows.length) {
    return [createEmptyVariationRow()];
  }

  const normalized = rows.map((row, index) => {
    if (!row) return createEmptyVariationRow();
    const label = row.variation || '';
    const value =
      row.variant_id ?? (label ? `${label}_${index}` : generateId());

    return {
      id: row.id || generateId(),
      variantType: label ? { label, value } : null,
      variantValueIds: Array.isArray(row.values) ? row.values : [],
    };
  });

  return normalized.length ? normalized : [createEmptyVariationRow()];
};

export const normalizeProductVariations = (
  rawValue: any
): VariationsState => {
  if (!rawValue) {
    return getDefaultVariationsState();
  }

  if (Array.isArray(rawValue)) {
    return {
      selections: normalizeLegacyRows(rawValue),
      combinations: [],
    };
  }

  const selections = Array.isArray(rawValue.selections)
    ? rawValue.selections.map((row: any) => ({
        id: row?.id || generateId(),
        variantType: row?.variantType || null,
        variantValueIds: Array.isArray(row?.variantValueIds)
          ? row.variantValueIds
          : [],
      }))
    : [createEmptyVariationRow()];

  return {
    selections: selections.length ? selections : [createEmptyVariationRow()],
    combinations: Array.isArray(rawValue.combinations)
      ? rawValue.combinations
      : [],
  };
};

export const cloneVariationsState = (
  state: VariationsState
): VariationsState => JSON.parse(JSON.stringify(state));

