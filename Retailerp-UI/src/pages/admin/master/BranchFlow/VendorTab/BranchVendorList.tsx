import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';
import React from 'react';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';

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
    label: 'ShineCraft Silver',
  },
  {
    value: 2,
    label: 'HKM Branch',
  },
];

const BranchVendorList = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);

  const handleClearAll = () => {
    setDateRange(null);
    handleFilterClear();
  };

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={BranchList}
          placeholder="Branch"
          value={edit?.getValue('branch')}
          onChange={(_e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={2.5}>
        <MUHDateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          isError={false}
          disabled={false}
        />
      </Grid>
      <CommonTableFilter
        selectItems={selectItems}
        selectedValue={selectedValue}
        handleSelectValue={handleSelectValue}
        handleFilterClear={handleClearAll}
        edit={edit}
      />
    </Grid>
  );
};

export default BranchVendorList;
