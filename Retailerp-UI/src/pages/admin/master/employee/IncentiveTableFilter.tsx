import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';

type DropdownOption = {
  label: string;
  value: string | number;
};

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  departmentOptions: DropdownOption[];
  roleOptions: DropdownOption[];
  isOfferPlan?: boolean;
};

const IncentiveTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  departmentOptions,
  roleOptions,
}: Props) => {

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={departmentOptions}
          placeholder="Department"
          value={edit?.getValue('department')}
          onChange={(_e, value) => {
            edit.update({ department: value, role: null });
          }}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={roleOptions}
          placeholder="Role"
          value={edit?.getValue('role')}
          onChange={(_e, value) => edit.update({ role: value })}
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
