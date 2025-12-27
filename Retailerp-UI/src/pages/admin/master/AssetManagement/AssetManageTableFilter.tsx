import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

export const BranchList = [
  {
    value: 1,
    label: 'Silver Craft Jewels',
  },
  {
    value: 2,
    label: 'HKM Branch',
  },
];

export const StatusList = [
  {
    value: 1,
    label: 'Update pending',
  },
  {
    value: 2,
    label: 'Under Maintenance',
  },
  {
    value: 3,
    label: 'In Use',
  },
  {
    value: 4,
    label: 'Retired',
  },
];
export const AssetCategory = [
  {
    value: 1,
    label: 'Machinery',
  },
  {
    value: 2,
    label: 'Tools& Instruments',
  },
  {
    value: 1,
    label: 'Display & Fixtures',
  },
];

const AssetManageTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={BranchList}
          placeholder="Branch"
          value={edit?.getValue('branch')}
          onChange={(e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={StatusList}
          placeholder="Status"
          value={edit?.getValue('mode')}
          onChange={(e, value) => edit.update({ mode: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.5}>
        <AutoSearchSelectWithLabel
          options={AssetCategory}
          placeholder="Asset Category"
          value={edit?.getValue('mode')}
          onChange={(e, value) => edit.update({ mode: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <CommonTableFilter
        selectItems={selectItems}
        selectedValue={selectedValue}
        handleSelectValue={handleSelectValue}
        handleFilterClear={handleFilterClear}
        edit={edit}
      />
    </Grid>
  );
};

export default AssetManageTableFilter;
