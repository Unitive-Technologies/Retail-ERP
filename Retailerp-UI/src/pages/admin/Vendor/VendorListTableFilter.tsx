import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { API_SERVICES } from '@services/index';
import { useEffect, useState } from 'react';

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

const VendorListTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onMaterialTypeChange,
  onSearchChange,
}: Props) => {
  const theme = useTheme();
  const [materialType, setMaterialType] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response: any = await API_SERVICES.MaterialTypeService.getAll();
        const list = response?.data?.data?.materialTypes || [];
        const mapped = list.map((item: any) => ({
          label: item.material_type ?? '',
          value: item.id ?? item.material_type ?? '',
        }));
        setMaterialType(mapped);
      } catch (e) {
        setMaterialType([]);
      }
    };
    fetchOptions();
  }, []);
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={materialType}
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
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

export default VendorListTableFilter;
