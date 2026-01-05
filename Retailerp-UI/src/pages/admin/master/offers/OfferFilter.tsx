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

const OfferFilter = ({
  selectItems,
  handleSelectValue,
  selectedValue,
  handleFilterClear,
  edit,
  onStatusChange,
  onSearchChange,
}: Props) => {
  const theme = useTheme();
  const [offerPlanOptions, setOfferPlanOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchOfferPlans = async () => {
      try {
        const res: any = await DropDownServiceAll.getOfferPlans();
        const offerPlansData =
          res?.data?.data?.offerPlans || res?.data?.offerPlans || [];

        if (Array.isArray(offerPlansData) && offerPlansData.length > 0) {
          const options = offerPlansData.map((plan: any) => ({
            label: plan.plan_name,
            value: plan.id,
          }));
          setOfferPlanOptions(options);
        } else {
          setOfferPlanOptions([]);
        }
      } catch (error: any) {
        setOfferPlanOptions([]);
        toast.error('Failed to load offer plans');
      }
    };

    fetchOfferPlans();
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
          options={offerPlanOptions}
          iconStyle={{
            color: theme.Colors.blackLightLow,
          }}
          placeholder="Offer Plan"
          value={edit?.getValue('offer_plan')}
          onChange={(_e, value) => {
            edit.update({ offer_plan: value });
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

export default OfferFilter;
