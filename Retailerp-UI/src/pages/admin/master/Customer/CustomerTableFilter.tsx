import { useEffect, useState } from 'react';
import AutoSearchSelectWithLabel from '@components/AutoSearchWithLabel';
import {
  CommonFilterAutoSearchProps,
  tableFilterContainerStyle,
} from '@components/CommonStyles';
import CommonTableFilter from '@components/CommonTableFilter';
import Grid from '@mui/material/Grid2';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';

type Props = {
  selectItems: any[];
  handleSelectValue: (val: any) => void;
  selectedValue: any[];
  handleFilterClear: () => void;
  edit: any;
  isOfferPlan?: boolean;
};

const ModeList = [
  {
    value: 'Online',
    label: 'Online',
  },
  {
    value: 'Offline',
    label: 'Offline',
  },
];

const CustomerTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [branchOptions, setBranchOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res: any = await DropDownServiceAll.getBranches();
        if (
          res?.status < HTTP_STATUSES.BAD_REQUEST &&
          Array.isArray(res?.data?.data?.branches)
        ) {
          const branches = res.data.data.branches.map((branch: any) => ({
            label: branch.branch_name,
            value: branch.branch_name,
          }));
          setBranchOptions(branches);
        } else {
          setBranchOptions([]);
        }
      } catch (err: any) {
        toast.error('Failed to load branches');
        setBranchOptions([]);
      }
    };

    fetchBranches();
  }, []);

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={branchOptions}
          placeholder="Branch"
          value={edit?.getValue('branch')}
          onChange={(_e, value) => edit.update({ branch: value })}
          {...CommonFilterAutoSearchProps}
        />
      </Grid>
      <Grid size={1.3}>
        <AutoSearchSelectWithLabel
          options={ModeList}
          placeholder="Mode"
          value={edit?.getValue('mode')}
          onChange={(_e, value) => edit.update({ mode: value })}
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

export default CustomerTableFilter;
