import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { HTTP_STATUSES } from '@constants/Constance';
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
};

const CategoryTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [material, setMaterial] = useState<any[]>([]);

  const fetchMaterialType = async () => {
    try {
      const response: any =
        await API_SERVICES.DropDownService.getAllMaterialType();

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const materialTypes = response?.data?.data?.materialTypes;
        console.log('API materialTypes response:', materialTypes);
        const filteredData =
          materialTypes?.map((item: any) => ({
            value: item.id,
            label: item.material_type,
          })) ?? [];
        setMaterial(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMaterialType();
  }, []);

  const selectedMaterialType = material?.find(
    (item) => item.value === edit.getValue('material_type')
  );

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={material}
          placeholder="Material Type"
          value={selectedMaterialType || null}
          onChange={(e, value) =>
            edit.update({ material_type: value?.value ?? 0 })
          }
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

export default CategoryTableFilter;
