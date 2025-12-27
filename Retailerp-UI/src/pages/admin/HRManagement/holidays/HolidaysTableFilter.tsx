import { tableFilterContainerStyle } from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import MUHDatePickerComponent from '@components/MUHDatePickerComponent';

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

const HolidaysTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,

  onSearchChange,
}: Props) => {
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
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
        onSearchChange={onSearchChange}
      />
    </Grid>
  );
};

export default HolidaysTableFilter;
