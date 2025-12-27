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
};

export const BranchList = [
  {
    value: 1,
    label: 'HKM Branch',
  },
  {
    value: 2,
    label: 'Coimbatore Branch',
  },
  {
    value: 3,
    label: 'Chennai Branch',
  },
];

export const ModeList = [
  {
    value: 1,
    label: 'Online',
  },
  {
    value: 2,
    label: 'Offline',
  },
];

const SchemeDetailFilter = ({
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
          options={ModeList}
          placeholder="Mode"
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

export default SchemeDetailFilter;
