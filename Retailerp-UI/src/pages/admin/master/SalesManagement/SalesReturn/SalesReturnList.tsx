import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';
import React from 'react';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';

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
const SalesReturnList = ({
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
          onChange={(e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid sx={{ padding: 0, display: 'flex', alignItems: 'center' }}>
        <MUHDatePickerComponent
          required
          widthPlus={140}
          height={28}
          placeholder="Date"
          value={edit.getValue('joining_date')}
          handleChange={(newDate: any) =>
            edit.update({ joining_date: newDate })
          }
          handleClear={() => edit.update({ joining_date: null })}
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

export default SalesReturnList;
