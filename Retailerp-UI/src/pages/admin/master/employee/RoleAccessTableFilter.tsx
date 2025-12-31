import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';

type DropdownOption = { label: string; value: string | number };

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  departmentOptions: DropdownOption[];
  roleOptions: DropdownOption[];
};

const RoleAccessTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  departmentOptions,
  roleOptions,
}: Props) => {
  const departmentId = edit?.getValue('department_id');
  const departmentValue =
    departmentOptions.find(
      (opt) => String(opt.value) === String(departmentId)
    ) || null;

  const roleId = edit?.getValue('role');
  const roleValue =
    roleOptions.find((opt) => String(opt.value) === String(roleId)) || null;

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={departmentOptions}
          placeholder="Department"
          value={departmentValue}
          onChange={(_e, value) => {
            edit.update({ department_id: value ? value.value : '', role: null });
          }}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={roleOptions}
          placeholder="Role"
          value={roleValue}
          onChange={(_e, value) => edit.update({ role: value ? value.value : '' })}
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

export default RoleAccessTableFilter;

