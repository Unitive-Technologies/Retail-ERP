import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { HTTP_STATUSES, SCHEME_TYPE } from '@constants/Constance';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { useEffect, useState } from 'react';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

const SchemeTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const theme = useTheme();

  const [material, setMaterial] = useState<any[]>([]);
  const [schemeTypes, setSchemeTypes] = useState<
    { label: string; value: number }[]
  >([]);

  const fetchMaterialType = async () => {
    try {
      const response: any = await DropDownServiceAll.getMaterialTypes();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.materialTypes ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        const options = Array.isArray(raw)
          ? raw.map((item: any) => ({
              value: Number(item?.id ?? item?.material_type_id ?? item?.value),
              label:
                item?.label ??
                item?.material_type ??
                item?.name ??
                String(item ?? ''),
            }))
          : [];
        setMaterial(options);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSchemeType = async () => {
    try {
      let response: any;
      if (edit.getValue('scheme_type_id')) {
        // No per-id API for scheme types in dropdown currently
      } else {
        response = await DropDownServiceAll.getSchemeType();
      }
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const raw =
          response?.data?.data?.schemeTypes ??
          response?.data?.data?.items ??
          response?.data?.data ??
          [];
        console.log('API schemeTypes response:', raw);
        const filteredData = Array.isArray(raw)
          ? raw.map((item: any) => {
              const label =
                item?.label ??
                item?.scheme_type_name ??
                item?.scheme_type ??
                item?.name ??
                String(item ?? '');
              const value = Number(
                item?.id ?? item?.scheme_type_id ?? item?.value
              );
              return { label, value };
            })
          : [];
        setSchemeTypes(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMaterialType();
    fetchSchemeType();
  }, []);

  const selectedMaterial = material?.find(
    (item) => Number(item.value) === Number(edit.getValue('material_type_id'))
  );
  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={material}
          placeholder="Material Type"
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
          value={selectedMaterial || null}
          onChange={(e, value) => {
            edit.update({ material_type_id: value });
          }}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={schemeTypes}
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
          placeholder="Scheme Type"
          value={edit.getValue('scheme_type_id')}
          onChange={(e: any) =>
            edit.update({ scheme_type_id: Number(e.target.value) })
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

export default SchemeTableFilter;
