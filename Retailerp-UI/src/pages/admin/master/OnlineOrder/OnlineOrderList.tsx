import {
  CommonFilterSelectBoxProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';

import Grid from '@mui/material/Grid2';
import React from 'react';

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
    label: 'KKM Silver',
  },
  {
    value: 2,
    label: 'Velli Maligai',
  },
];
export const PaymentList = [
  {
    value: 1,
    label: 'Online',
  },
  {
    value: 2,
    label: 'Offline',
  },
];
export const TodayList = [
  {
    value: 1,
    label: 'Today',
  },
  {
    value: 2,
    label: 'Yesterday',
  },
];

const OnlineOrderList = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [dateRange, setDateRange] = React.useState<
    [Date | null, Date | null] | null
  >(null);

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('today')}
          onChange={(e: any) => edit?.update({ today: e.target.value })}
          placeholderText="Today"
          selectItems={TodayList}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
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
          value={edit?.getValue('payment_Status')}
          onChange={(e: any) =>
            edit?.update({ payment_Status: e.target.value })
          }
          placeholderText="Payment Status"
          selectItems={PaymentList}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
      <Grid sx={{ padding: 0, display: 'flex', alignItems: 'center' }}>
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
        handleFilterClear={handleFilterClear}
        edit={edit}
      />
    </Grid>
  );
};

export default OnlineOrderList;
