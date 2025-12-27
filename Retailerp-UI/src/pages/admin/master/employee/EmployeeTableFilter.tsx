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
  branchOptions: DropdownOption[];
  departmentOptions: DropdownOption[];
  designationOptions: DropdownOption[];
};

const EmployeeTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  branchOptions,
  departmentOptions,
  designationOptions,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={branchOptions}
          placeholder="Branch"
          value={edit?.getValue('branch')}
          onChange={(_e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={departmentOptions}
          placeholder="Department"
          value={edit?.getValue('department')}
          onChange={(_e, value) => edit.update({ department: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={designationOptions}
          placeholder="Designation"
          value={edit?.getValue('designation')}
          onChange={(_e, value) => edit.update({ designation: value })}
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

export default EmployeeTableFilter;
