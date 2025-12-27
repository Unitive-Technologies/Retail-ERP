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
};

export const VendorList = [
  {
    value: 1,
    label: 'Golden Hub Pvt., Ltd.,',
  },
  {
    value: 2,
    label: 'Shiva Silver Suppliers',
  },
  {
    value: 3,
    label: 'Jai Shree Jewels',
  },
  {
    value: 4,
    label: 'Kalash Gold & Silver Mart',
  },
  {
    value: 5,
    label: 'Sai Precious Metals',
  },
];
export const StatusList = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Yet To Update' },
  { value: 3, label: 'Updated' },
];

const GrnListTable = ({
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
          value={edit?.getValue('Vendor')}
          onChange={(e: any) => edit?.update({ Vendor: e.target.value })}
          placeholderText="Vendor"
          selectItems={VendorList}
          {...CommonFilterSelectBoxProps}
        />
      </Grid>
      <Grid size={1.3}>
        <MUHSelectBoxComponent
          value={edit?.getValue('Status')}
          onChange={(e: any) => edit?.update({ Status: e.target.value })}
          placeholderText="Status"
          selectItems={StatusList}
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
