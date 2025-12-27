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
};

const LedgerTableFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
}: Props) => {
  const [ledgerGroupData, setLedgerGroupData] = useState<any>([]);

  const fetchLedgerGrpData = async () => {
    try {
      const response: any =
        await API_SERVICES.DropDownService.getAllLedgerGrpType();
      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const ledgerGrpTypes = response?.data?.data?.ledgerGroups;
        const filteredData =
          ledgerGrpTypes?.map((item: any) => ({
            value: item.id,
            label: item.ledger_group_name,
          })) ?? [];
        setLedgerGroupData(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLedgerGrpData();
  }, []);

  return (
    <Grid container sx={tableFilterContainerStyle}>
      <Grid size={1.6}>
        <AutoSearchSelectWithLabel
          options={ledgerGroupData}
          placeholder="Ledger Group"
          value={edit?.getValue('ledger_group')}
          onChange={(e, value) =>
            edit.update({ ledger_group: value?.value ?? 0 })
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

export default LedgerTableFilter;
