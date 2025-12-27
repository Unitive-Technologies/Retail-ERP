import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { DropDownServiceAll } from '@services/DropDownServiceAll';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  isViewSummary?: boolean;
};

const ProductTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  isViewSummary = false,
  edit,
}: Props) => {
  const [dropdownData, setDropdownData] = useState({
    materialTypes: [] as any[],
    categories: [] as any[],
    subcategories: [] as any[],
  });

  const mapToOption = (arr: any[], labelKey: string, valueKey: string) =>
    arr?.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    })) || [];

  const fetchMaterialTypes = async () => {
    try {
      const materialTypesRes: any = await DropDownServiceAll.getMaterialTypes();
      const materialTypes = mapToOption(
        materialTypesRes?.data?.data?.materialTypes || [],
        'material_type',
        'id'
      );
      setDropdownData((prev) => ({
        ...prev,
        materialTypes,
      }));
    } catch (err) {
      console.error('Error fetching material types', err);
    }
  };

  useEffect(() => {
    fetchMaterialTypes();
  }, []);

  const handleMaterialTypeChange = async (e: any, value: any) => {
    edit.update({
      material_type_id: value,
      category_id: '',
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getCategories({
        material_type_id: value.value,
      });
      const categories = mapToOption(
        res?.data?.data?.categories || [],
        'category_name',
        'id'
      );

      setDropdownData((prev: any) => ({
        ...prev,
        categories,
        subcategories: [],
      }));
    } else {
      // const res: any = await DropDownServiceAll.getCategories();
      // const categories = mapToOption(
      //   res?.data?.data?.categories || [],
      //   'category_name',
      //   'id'
      // );
      setDropdownData((prev: any) => ({
        ...prev,
        categories: [],
        subcategories: [],
      }));
    }
  };

  const handleCategoryChange = async (e: any, value: any) => {
    edit.update({
      category_id: value,
      subcategory_id: '',
    });

    if (value?.value) {
      const res: any = await DropDownServiceAll.getSubcategories({
        category_id: value.value,
      });
      const subcategories = mapToOption(
        res?.data?.data?.subcategories || [],
        'subcategory_name',
        'id'
      );

      setDropdownData((prev: any) => ({
        ...prev,
        subcategories,
      }));
    } else {
      // const res: any = await DropDownServiceAll.getSubcategories();
      // const subcategories = mapToOption(
      //   res?.data?.data?.subcategories || [],
      //   'subcategory_name',
      //   'id'
      // );
      setDropdownData((prev: any) => ({
        ...prev,
        subcategories: [],
      }));
    }
  };

  return (
    <Grid container sx={tableFilterContainerStyle}>
      {!isViewSummary ? (
        <>
          <Grid size={1.6}>
            <AutoSearchSelectWithLabel
              options={dropdownData.materialTypes}
              placeholder="Material Type"
              value={edit?.getValue('material_type_id')}
              onChange={handleMaterialTypeChange}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.6}>
            <AutoSearchSelectWithLabel
              options={dropdownData.categories}
              placeholder="Category"
              value={edit?.getValue('category_id')}
              onChange={handleCategoryChange}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.6}>
            <AutoSearchSelectWithLabel
              options={dropdownData.subcategories}
              placeholder="Sub Category"
              value={edit?.getValue('subcategory_id')}
              onChange={(e, value) => edit.update({ subcategory_id: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
        </>
      ) : null}
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

export default ProductTableFilter;
