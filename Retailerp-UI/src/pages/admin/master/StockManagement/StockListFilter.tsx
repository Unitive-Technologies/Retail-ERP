import {
  CommonFilterSelectBoxProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';

import CommonTableFilter from '@components/CommonTableFilter';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  showCategoryFilters?: boolean;
  placeholderText?: string;
};

// ---------------- Dummy Data Lists ----------------

export const CategoryList = [
  { value: 1, label: 'Earrings' },
  { value: 2, label: 'Idols' },
  { value: 3, label: 'Rings' },
];

// Rename to avoid conflict with imported SubCategoryList
export const SubCategoryListDummy = [
  { value: 1, label: 'Studs' },
  { value: 2, label: 'Single line' },
  { value: 3, label: 'Plain Rings' },
];

export const purityList = [{ value: 1, label: '99.9%' }];

export const weightList = [
  { value: 1, label: '20g' },
  { value: 2, label: '10g' },
];

const StockListFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  showCategoryFilters = true,
  placeholderText,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      {showCategoryFilters && (
        <>
          {/* Category */}
          <Grid size={1.3}>
            <MUHSelectBoxComponent
              value={edit?.getValue('category')}
              onChange={(e: any) => edit?.update({ category: e.target.value })}
              placeholderText="Category"
              selectItems={CategoryList}
              {...CommonFilterSelectBoxProps}
            />
          </Grid>

          {/* Sub Category */}
          <Grid size={1.3}>
            <MUHSelectBoxComponent
              value={edit?.getValue('subcategory')}
              onChange={(e: any) =>
                edit?.update({ subcategory: e.target.value })
              }
              placeholderText="Sub Category"
              selectItems={SubCategoryListDummy}
              {...CommonFilterSelectBoxProps}
            />
          </Grid>

          {/* Purity */}
          <Grid size={1.3}>
            <MUHSelectBoxComponent
              value={edit?.getValue('purity')}
              onChange={(e: any) => edit?.update({ purity: e.target.value })}
              placeholderText="Purity"
              selectItems={purityList}
              {...CommonFilterSelectBoxProps}
            />
          </Grid>

          {/* Weight */}
          <Grid size={1.3}>
            <MUHSelectBoxComponent
              value={edit?.getValue('weight')}
              onChange={(e: any) => edit?.update({ weight: e.target.value })}
              placeholderText="Weight"
              selectItems={weightList}
              {...CommonFilterSelectBoxProps}
            />
          </Grid>
        </>
      )}

      {/* Common Table Filter */}
      <CommonTableFilter
        selectItems={selectItems}
        selectedValue={selectedValue}
        handleSelectValue={handleSelectValue}
        handleFilterClear={handleFilterClear}
        edit={edit}
        placeholderText={placeholderText}
      />
    </Grid>
  );
};

export default StockListFilter;
