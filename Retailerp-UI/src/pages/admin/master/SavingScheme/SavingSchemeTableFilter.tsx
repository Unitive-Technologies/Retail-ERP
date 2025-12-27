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
};

export const BranchList = [
  {
    value: 1,
    label: 'KHM Silver',
  },
  {
    value: 2,
    label: 'Velli Maligai',
  },
  {
    value: 3,
    label: 'Sri Velli Alangaram',
  },
  {
    value: 4,
    label: 'Aathira Silver Mart',
  },
  {
    value: 5,
    label: 'Annapoorani Velli Chemmal',
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
export const StatusList = [
  {
    value: 1,
    label: 'Completed',
  },
  {
    value: 2,
    label: 'On-Going',
  },
];

const SavingSchemeTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('Branch')}
          onChange={(e: any) => edit?.update({ Branch: e.target.value })}
          placeholderText="Branch"
          selectItems={BranchList}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('Mode')}
          onChange={(e: any) => edit?.update({ Mode: e.target.value })}
          placeholderText="Mode"
          selectItems={ModeList}
          {...CommonFilterSelectBoxProps}
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

export default SavingSchemeTableFilter;
