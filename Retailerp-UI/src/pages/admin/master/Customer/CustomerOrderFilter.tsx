import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';
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
    label: 'Coimbatore',
  },
  {
    value: 2,
    label: 'Avadi',
  },
];

export const OrderTypeList = [
  {
    value: 1,
    label: 'Online',
  },
  {
    value: 2,
    label: 'Offline',
  },
];

const CustomerOrderFilter = ({
  selectItems = [],
  handleSelectValue,
  selectedValue = [],
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
          onChange={(_e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={OrderTypeList}
          placeholder="Order Type"
          value={edit?.getValue('orderType')}
          onChange={(_e, value) => edit.update({ orderType: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.5}>
        <MUHDatePickerComponent
          required
          height={28}
          placeholder="Date"
          value={edit.getValue('joining_date') || null}
          handleChange={(newDate: any) =>
            edit.update({ joining_date: newDate })
          }
          handleClear={() => edit.update({ joining_date: null })}
        />
      </Grid>
      {selectItems.length > 0 && (
        <CommonTableFilter
          selectItems={selectItems}
          selectedValue={selectedValue}
          handleSelectValue={handleSelectValue}
          handleFilterClear={handleFilterClear}
          edit={edit}
        />
      )}
    </Grid>
  );
};

export default CustomerOrderFilter;
