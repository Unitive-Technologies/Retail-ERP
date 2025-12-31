import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';

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
  const [materialTypeOptions, setMaterialTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      try {
        const response: any = await API_SERVICES.MaterialTypeService.getAll();
        if (
          response?.status < HTTP_STATUSES.BAD_REQUEST &&
          response?.data?.data?.materialTypes
        ) {
          const options = response.data.data.materialTypes.map((m: any) => ({
            value: m.id,
            label: m.material_type,
          }));
          setMaterialTypeOptions(options);
        }
      } catch (error) {
        console.error('Error fetching material types:', error);
        setMaterialTypeOptions([]);
      }
    };

    fetchMaterialTypes();
  }, []);

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={materialTypeOptions}
          iconStyle={{ color: theme.Colors.blackLightLow }}
          placeholder="Material Type"
          value={edit?.getValue('materialType')}
          onChange={(_e, value) => {
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
