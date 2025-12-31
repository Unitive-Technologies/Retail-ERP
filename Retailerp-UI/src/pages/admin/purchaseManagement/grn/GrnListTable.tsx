import {
  CommonFilterSelectBoxProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';

import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  vendorOptions: { value: number | string; label: string }[];
  statusOptions: { value: string | number; label: string }[];
};

const GrnListTable = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  vendorOptions,
  statusOptions,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('Vendor')}
          onChange={(e: any) => edit?.update({ Vendor: e.target.value })}
          placeholderText="Vendor"
          selectItems={vendorOptions}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('Status')}
          onChange={(e: any) => edit?.update({ Status: e.target.value })}
          placeholderText="Status"
          selectItems={statusOptions}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
      <Grid size={1.5}>
        <MUHDatePickerComponent
          required
          widthPlus={160}
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
        handleFilterClear={handleFilterClear}
        edit={edit}
      />
    </Grid>
  );
};

export default GrnListTable;
