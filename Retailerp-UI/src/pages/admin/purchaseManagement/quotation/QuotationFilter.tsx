import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/system/Grid';
import { useState } from 'react';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
};

const QuotationFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [vendorList, setVendorList] = useState([]);
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={vendorList}
          placeholder="Vendor"
          value={edit?.getValue('vendor')}
          onChange={(e, value) => edit.update({ vendor: value })}
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
export default QuotationFilter;
