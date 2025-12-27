import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  onMaterialTypeChange?: (option: any) => void;
  onSearchChange?: (text: string) => void;
};

const VendorTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onMaterialTypeChange,
  onSearchChange,
}: Props) => {
  const theme = useTheme();

  const dummyBranchList = [
    { label: 'Chennai', value: 1 },
    { label: 'Chennai', value: 2 },
    { label: 'Salem', value: 3 },
    { label: 'Chennai', value: 4 },
    { label: 'Super Admin', value: 5 },
  ];

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={dummyBranchList} // ✅ Using dummy data
          iconStyle={{ color: theme.Colors.blackLightLow }}
          placeholder="Branch"
          value={edit?.getValue('materialType')}
          onChange={(e, value) => {
            edit.update({ materialType: value });
            onMaterialTypeChange && onMaterialTypeChange(value);
          }}
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

export default VendorTableFilter;
