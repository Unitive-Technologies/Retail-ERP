import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { HTTP_STATUSES } from '@constants/Constance';
import Grid from '@mui/material/Grid2';
import { API_SERVICES } from '@services/index';
import { useEffect, useState, useRef } from 'react';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

const SubCategoryTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [material, setMaterial] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const prevMaterialTypeRef = useRef<any>(null);

  const fetchMaterialType = async () => {
    try {
      const response: any =
        await API_SERVICES.DropDownService.getAllMaterialType();

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const materialTypes = response?.data?.data?.materialTypes;
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

  const fetchCategoryType = async (materialTypeId?: any) => {
    try {
      const response = await API_SERVICES.DropDownService.getAllCategoryType(
        materialTypeId ? { material_type_id: materialTypeId } : undefined
      );
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const categoryTypes = response?.data?.data?.categories;
        const filteredData =
          categoryTypes?.map((item: any) => ({
            value: item.id,
            label: item.category_name,
          })) ?? [];
        setCategory(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMaterialType();

    const initialMaterialTypeId = edit.getValue('material_type');
    prevMaterialTypeRef.current = initialMaterialTypeId;

    if (initialMaterialTypeId) {
      fetchCategoryType(initialMaterialTypeId);
    }
  }, []);

  useEffect(() => {
    const materialTypeId = edit.getValue('material_type');
    const prevMaterialType = prevMaterialTypeRef.current;

    fetchCategoryType(materialTypeId);

    if (prevMaterialType !== null && prevMaterialType !== materialTypeId) {
      edit.update({ category: '' });
    }

    prevMaterialTypeRef.current = materialTypeId;
  }, [edit.edits]);
  const selectedMaterialType = material?.find(
    (item) => item.value == edit.getValue('material_type')
  );
  const selectedCategoryType = category?.find(
    (item) => item.value == edit.getValue('category')
  );

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={material}
          placeholder="Material Type"
          value={selectedMaterialType || null}
          onChange={(_e, value) => edit.update({ material_type: value?.value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={category}
          placeholder="Category"
          value={selectedCategoryType || null}
          onChange={(_e, value) => edit.update({ category: value?.value })}
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

export default SubCategoryTableFilter;
