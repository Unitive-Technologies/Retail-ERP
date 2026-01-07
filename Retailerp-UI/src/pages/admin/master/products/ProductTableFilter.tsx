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
    branch: [] as any[],
    grns: [] as any[],
  });

  // Ref No dummy data
  const dummyRefNoData = [
    { value: 'GRN035/01', label: 'GRN035/01' },
    { value: 'GRN035/02', label: 'GRN035/02' },
    { value: 'GRN036/01', label: 'GRN036/01' },
  ];
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

  // useEffect(() => {
  //   fetchMaterialTypes();
  // }, []);

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
  const fetchBranches = async () => {
    try {
      const res: any = await DropDownServiceAll.getBranches();

      const branch = mapToOption(
        res?.data?.data?.branches || [],
        'branch_name',
        'id'
      );

      setDropdownData((prev) => ({
        ...prev,
        branch,
      }));
    } catch (err) {
      console.error('Error fetching branches', err);
    }
  };
  const fetchGrns = async () => {
    try {
      const res: any = await DropDownServiceAll.getGrns();

      const grns = mapToOption(res?.data?.data?.grns || [], 'grn_no', 'id');

      setDropdownData((prev) => ({
        ...prev,
        grns,
      }));
    } catch (err) {
      console.error('Error fetching GRNs', err);
    }
  };

  useEffect(() => {
    fetchMaterialTypes();
    fetchBranches();
    fetchGrns();
  }, []);

  return (
    <Grid container sx={tableFilterContainerStyle}>
      {!isViewSummary ? (
        <>
          <Grid size={1.4}>
            <AutoSearchSelectWithLabel
              options={dropdownData.materialTypes}
              placeholder="Material Type"
              value={edit?.getValue('material_type_id')}
              onChange={handleMaterialTypeChange}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.3}>
            <AutoSearchSelectWithLabel
              options={dropdownData.categories}
              placeholder="Category"
              value={edit?.getValue('category_id')}
              onChange={handleCategoryChange}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.4}>
            <AutoSearchSelectWithLabel
              options={dropdownData.subcategories}
              placeholder="Sub Category"
              value={edit?.getValue('subcategory_id')}
              onChange={(e, value) => edit.update({ subcategory_id: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.4}>
            <AutoSearchSelectWithLabel
              options={dropdownData.branch}
              placeholder="Branch"
              value={edit?.getValue('branch_id')}
              onChange={(_e, value) => edit.update({ branch_id: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>
          <Grid size={1.4}>
            <AutoSearchSelectWithLabel
              options={dropdownData.grns}
              placeholder="GRN No."
              value={edit?.getValue('grn_no')}
              onChange={(_e, value) => edit.update({ grn_no: value })}
              {...CommonFilterAutoSearchProps}
            />
          </Grid>

          <Grid size={1.4}>
            <AutoSearchSelectWithLabel
              options={dummyRefNoData}
              placeholder="Ref No."
              value={edit?.getValue('ref_no')}
              onChange={(e, value) => edit.update({ ref_no: value })}
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
