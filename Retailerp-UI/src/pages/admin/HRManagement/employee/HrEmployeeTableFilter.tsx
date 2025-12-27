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
};

export const branchList = [
  { value: 1, label: 'Salem' },
  { value: 2, label: 'Madurai' },
];

export const departmentList = [
  { value: 1, label: 'HR' },
  { value: 2, label: 'Finance' },
];

export const designationList = [
  { value: 1, label: 'Manager' },
  { value: 2, label: 'Developer' },
];


const HrEmployeeTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={branchList}
          placeholder="Branch"
          value={edit?.getValue('branch')}
          onChange={(e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={departmentList}
          placeholder="Department"
          value={edit?.getValue('department')}
          onChange={(e, value) => edit.update({ department: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={designationList}
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

export default HrEmployeeTableFilter;
