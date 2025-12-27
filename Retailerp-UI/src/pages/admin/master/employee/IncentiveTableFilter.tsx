import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

export const StatusList = [
  {
    value: 1,
    label: 'Active',
  },
  {
    value: 2,
    label: 'Deactive',
  },
];

export const LocationList = [
  {
    value: 1,
    label: 'Salem',
  },
  {
    value: 2,
    label: 'Madurai',
  },
];

const IncentiveTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={LocationList}
          placeholder="Department"
          value={edit?.getValue('department')}
          onChange={(e, value) => edit.update({ department: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={LocationList}
          placeholder="Designation"
          value={edit?.getValue('designation')}
          onChange={(e, value) => edit.update({ designation: value })}
          {...CommonFilterAutoSearchProps}
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

export default IncentiveTableFilter;
