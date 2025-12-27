import React from 'react';
import Grid from '@mui/material/Grid2';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

const RevenueListFilter = ({
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
      <Grid size={1.5}>
        <AutoSearchSelectWithLabel
          options={[]}
          placeholder="Today"
          value={edit?.getValue('today')}
          onChange={(e, value) => edit.update({ today: value })}
          {...CommonFilterAutoSearchProps}
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
        handleFilterClear={handleClearAll}
        edit={edit}
      />
    </Grid>
  );
};

export default RevenueListFilter;
