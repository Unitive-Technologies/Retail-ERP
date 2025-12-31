import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import { BranchStatus } from '@constants/DummyData';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import toast from 'react-hot-toast';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
  onStatusChange?: (option: any) => void;
  onSearchChange?: (text: string) => void;
};

const BranchTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onStatusChange,
  onSearchChange,
}: Props) => {
  const theme = useTheme();
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res: any = await DropDownServiceAll.getAllDistricts();
        const districts = res?.data?.data?.districts || [];
        if (Array.isArray(districts)) {
          const validDistricts = districts.filter((d: any) => {
            const name = (d.district_name || '').trim();
            const nameLower = name.toLowerCase();

            const isTestData =
              nameLower === 'test' ||
              nameLower === 'montaza' ||
              nameLower.startsWith('test_') ||
              nameLower.includes('_test') ||
              name.length < 2;

            return (
              name && !isTestData && d.id && d.district_name && name.length >= 2
            );
          });

          const options = validDistricts.map((d: any) => ({
            label: d.district_name,
            value: d.id,
          }));
          setDistrictOptions(options);
        } else {
          setDistrictOptions([]);
        }
      } catch (error: any) {
        console.error('Error fetching districts for Branch filter:', error);
        setDistrictOptions([]);
        toast.error('Failed to load locations');
      }
    };

    fetchDistricts();
  }, []);

  return (
    <Grid container sx={tableFilterContainerStyle} className="branch-filter">
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={BranchStatus}
          placeholder="Status"
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
          value={edit?.getValue('status')}
          onChange={(_e, value) => {
            edit.update({ status: value });
            onStatusChange && onStatusChange(value);
          }}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={districtOptions}
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
          placeholder="Location"
          value={edit?.getValue('location')}
          onChange={(_e, value) => edit.update({ location: value })}
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

export default BranchTableFilter;
