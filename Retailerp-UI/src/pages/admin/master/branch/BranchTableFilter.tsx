import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { BranchStatus, DistrictListBranch } from '@constants/DummyData';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  onStatusChange?: (option: any) => void;
  onSearchChange?: (text: string) => void;
};

const BranchTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onStatusChange,
  onSearchChange,
}: Props) => {
  const theme=useTheme();
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={BranchStatus}
          placeholder="Status"
           iconStyle={{
            color:theme.Colors.blackLightLow
          }}
          value={edit?.getValue('status')}
          onChange={(e, value) => {
            edit.update({ status: value });
            onStatusChange && onStatusChange(value);
          }}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={DistrictListBranch}
          iconStyle={{
            color:theme.Colors.blackLightLow
          }}
          placeholder="Location"
          value={edit?.getValue('location')}
          onChange={(e, value) => edit.update({ location: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <CommonTableFilter
        selectItems={selectItems}
        selectedValue={selectedValue}
        handleSelectValue={handleSelectValue}
        handleFilterClear={handleFilterClear}
        edit={edit}
        onSearchChange={onSearchChange}
      />
    </Grid>
  );
};

export default BranchTableFilter;
