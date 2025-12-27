import { tableFilterContainerStyle } from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDateRangePicker from '@components/MUHDateRangePicker/MUHDateRangePicker';
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

const AbandonedList = ({
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

export default AbandonedList;
