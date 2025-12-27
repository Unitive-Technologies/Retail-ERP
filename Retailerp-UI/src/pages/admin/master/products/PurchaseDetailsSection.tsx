import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import MUHTypography from '@components/MUHTypography';

type Props = {
  purchaseRecord?: Record<string, any> | null;
};

const isEmptyValue = (value: any) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

const toNumber = (value: any) => {
  if (isEmptyValue(value)) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const formatNumberValue = (
  value: any,
  minimumFractionDigits = 2,
  maximumFractionDigits = minimumFractionDigits
) => {
  const num = toNumber(value);
  if (num === null) return '';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

const formatCurrencyValue = (value: any) => {
  const formatted = formatNumberValue(value, 2, 2);
  return formatted ? `₹${formatted}` : '';
};

const formatWeightValue = (value: any) => {
  const formatted = formatNumberValue(value, 3, 3);
  return formatted ? `${formatted} g` : '';
};

const formatQuantityValue = (value: any) => {
  const formatted = formatNumberValue(value, 0, 0);
  return formatted || '';
};

const formatTextValue = (value: any) => {
  return isEmptyValue(value) ? '' : String(value);
};

const getPurchaseDetails = (record: Record<string, any> | null | undefined) => {
  if (!record) return [];

  const details = [
    {
      label: 'Material Price /g',
      value: formatCurrencyValue(record.material_price_per_g),
    },
    { label: 'Quantity', value: formatQuantityValue(record.quantity) },
    { label: 'Gross Wt.', value: formatWeightValue(record.gross_wt_in_g) },
    { label: 'Stone Wt.', value: formatWeightValue(record.stone_wt_in_g) },
    { label: 'Net Wt.', value: formatWeightValue(record.net_wt_in_g) },
    { label: 'Purchase Rate', value: formatCurrencyValue(record.purchase_rate) },
    { label: 'Stone Rate', value: formatCurrencyValue(record.stone_rate) },
    { label: 'Making Charge', value: formatCurrencyValue(record.making_charge) },
    { label: 'Rate Per g', value: formatCurrencyValue(record.rate_per_g) },
  ];

  const othersLabel = formatTextValue(record.others);
  const othersWeight = formatWeightValue(record.others_wt_in_g);

  if (!isEmptyValue(othersLabel) || !isEmptyValue(othersWeight)) {
    details.splice(4, 0, {
      label: othersLabel || 'Others',
      value: othersWeight || formatCurrencyValue(record.others_value),
    });
  }

  return details.filter((detail) => !isEmptyValue(detail.value));
};

const PurchaseDetailsSection = ({ purchaseRecord }: Props) => {
  const theme = useTheme();

  const purchaseDetails = getPurchaseDetails(purchaseRecord);
  const hasPurchaseDetails = purchaseDetails.length > 0;

  return (
    <Grid>
      <FormSectionHeader title="Purchase Details" />
      <Grid container direction="column" gap={1.5} sx={sectionContainerStyle} py={2}>
        {hasPurchaseDetails ? (
          purchaseDetails.map((item) => (
            <Grid
              key={item.label}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <MUHTypography
                text={item.label}
                size={15}
                weight={600}
                family={theme.fontFamily.roboto}
              />
              <MUHTypography
                text={item.value}
                size={15}
                weight={600}
                color={theme.Colors.primary}
                family={theme.fontFamily.roboto}
              />
            </Grid>
          ))
        ) : (
          <MUHTypography
            text="No purchase details available"
            size={15}
            weight={500}
            family={theme.fontFamily.roboto}
            color={theme.Colors.blackLightLow}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PurchaseDetailsSection;


