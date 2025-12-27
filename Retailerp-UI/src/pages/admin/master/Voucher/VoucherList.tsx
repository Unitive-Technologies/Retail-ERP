import { tableFilterContainerStyle } from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';
import React from 'react';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

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
const VoucherList = ({
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
      <Grid size={2.3}>
        <MUHDatePickerComponent
          required
          height={28}
          placeholder="Date "
          value={edit.getValue('date')}
          handleChange={(newDate: any) => edit.update({ date: newDate })}
          handleClear={() => edit.update({ date: null })}
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

export default VoucherList;
