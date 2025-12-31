import Grid from '@mui/material/Grid2';
import FormSectionHeader from '@pages/admin/common/FormSectionHeader';
import { sectionContainerStyle } from '@components/CommonStyles';
import { useTheme } from '@mui/material';
import MUHTypography from '@components/MUHTypography';
import { ButtonComponent, DialogComp } from '@components/index';
import StatusCard from '@components/StatusCard';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { ProductService } from '@services/ProductService';
import { HTTP_STATUSES } from '@constants/Constance';
import ViewProductSummary from './ViewProductSummary';
import PageHeader from '@components/PageHeader';
import { AddedSumIcon, RemainingIcon, TotalSumIcon } from '@assets/Images/AdminImages';

type Props = {
  edit: any;
  purchaseRecord?: Record<string, any> | null;
};

type Totals = {
  weight: number;
  quantity: number;
};

const parseNumber = (value: any, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const formatNumber = (value: number, fractionDigits = 2) => {
  const normalized = Number.isFinite(value) ? value : 0;
  return normalized.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatQuantity = (value: number) => {
  const normalized = Number.isFinite(value) ? value : 0;
  return normalized.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

//Old logic
// const formatNumber = (value: number, fractionDigits = 2) =>
//   Math.max(value, 0).toLocaleString('en-IN', {
//     minimumFractionDigits: fractionDigits,
//     maximumFractionDigits: fractionDigits,
//   });

// const formatQuantity = (value: number) =>
//   Math.max(value, 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   });

const aggregateItemDetails = (details: any[] = []): Totals =>
  details.reduce(
    (acc, detail) => ({
      weight:
        acc.weight +
        parseNumber(detail?.gross_weight) * parseNumber(detail?.quantity),
      quantity: acc.quantity + parseNumber(detail?.quantity),
    }),
    { weight: 0, quantity: 0 }
  );

const SummaryDetailsSection = ({ edit, purchaseRecord }: Props) => {
  const theme = useTheme();
  const [existingTotals, setExistingTotals] = useState<Totals>({
    weight: 0,
    quantity: 0,
  });
  const [viewDialog, setViewDialog] = useState({ open: false });
  const lastRefIdRef = useRef<any>(null);
  const initialItemTotalsRef = useRef<Totals | null>(null);
  const sku_id = edit.getValue('sku_id');
  const itemDetails = edit.getValue('item_details') || [];
  console.log(purchaseRecord, 'purchaseRecord----');
  useEffect(() => {
    const currentRefId =
      purchaseRecord?.ref_no_id ??
      purchaseRecord?.id ??
      purchaseRecord?.ref_noId ??
      null;

    const allItemDetailsTotals = aggregateItemDetails(itemDetails);
    if (
      initialItemTotalsRef.current === null ||
      lastRefIdRef.current !== currentRefId
    ) {
      initialItemTotalsRef.current = allItemDetailsTotals;
      lastRefIdRef.current = currentRefId;
    }
  }, [itemDetails, purchaseRecord?.id, purchaseRecord?.ref_no_id]);
  const grnNo = edit.getValue('grn_id')?.label;
  // console.log(grnNo, 'grinn---')
  useEffect(() => {
    let isMounted = true;
    const fetchExistingProducts = async () => {
      const refId =
        purchaseRecord?.ref_no_id ??
        purchaseRecord?.id ??
        purchaseRecord?.refNoId ??
        null;

      if (!refId) {
        if (isMounted) {
          setExistingTotals({ weight: 0, quantity: 0 });
        }
        return;
      }

      try {
        const response: any = await ProductService.getAll({ ref_no_id: refId });

        if (response?.data?.statusCode === HTTP_STATUSES.OK) {
          const products = response?.data?.data?.products || [];
          const totals = products.reduce(
            (acc: Totals, product: any) => {
              const details =
                product?.itemDetails || product?.item_details || [];
              const aggregated = aggregateItemDetails(details);
              return {
                weight: acc.weight + aggregated.weight,
                quantity: acc.quantity + aggregated.quantity,
              };
            },
            { weight: 0, quantity: 0 }
          );
          if (isMounted) {
            setExistingTotals(totals);
          }
        } else {
          if (isMounted) {
            setExistingTotals({ weight: 0, quantity: 0 });
          }
        }
      } catch (error) {
        console.error('Failed to fetch products for summary', error);
        if (isMounted) {
          setExistingTotals({ weight: 0, quantity: 0 });
        }
      }
    };

    fetchExistingProducts();

    return () => {
      isMounted = false;
    };
  }, [purchaseRecord?.id, purchaseRecord?.ref_no_id, sku_id]);

  const currentTotals = aggregateItemDetails(itemDetails);
  const baseTotals = initialItemTotalsRef.current || { weight: 0, quantity: 0 };
  const deltaTotals = {
    weight: currentTotals.weight - baseTotals.weight,
    quantity: currentTotals.quantity - baseTotals.quantity,
  };

  const totalProductsAdded = {
    weight: existingTotals.weight + deltaTotals.weight,
    quantity: existingTotals.quantity + deltaTotals.quantity,
  };

  const grnWeight = parseNumber(
    // purchaseRecord?.gross_wt_in_g ?? purchaseRecord?.gross_weight
    purchaseRecord?.net_wt_in_g ?? purchaseRecord?.net_weight
  );
  const grnQuantity = parseNumber(
    purchaseRecord?.quantity ?? purchaseRecord?.total_qty
  );

  const remainingTotals = {
    weight: grnWeight - totalProductsAdded.weight,
    quantity: grnQuantity - totalProductsAdded.quantity,
  };

  useEffect(() => {
    const currentWeight = Number(edit.getValue('remaining_weight'));
    const currentQuantity = Number(edit.getValue('remaining_quantity'));
    const payload: Record<string, number> = {};

    if (
      !Number.isFinite(currentWeight) ||
      currentWeight !== remainingTotals.weight
    ) {
      payload.remaining_weight = remainingTotals.weight;
    }

    if (
      !Number.isFinite(currentQuantity) ||
      currentQuantity !== remainingTotals.quantity
    ) {
      payload.remaining_quantity = remainingTotals.quantity;
    }

    if (Object.keys(payload).length) {
      edit.update(payload);
    }
  }, [edit, remainingTotals.weight, remainingTotals.quantity]);

  const rows = [
    {
      label: 'Total GRN Value',
      weight: grnWeight,
      quantity: grnQuantity,
    },
    {
      label: 'Total Products Added',
      weight: totalProductsAdded.weight,
      quantity: totalProductsAdded.quantity,
    },
    {
      label: 'Remaining Weight',
      weight: remainingTotals.weight,
      quantity: remainingTotals.quantity,
    },
  ];

  const handleViewSummary = () => {
    setViewDialog({ open: true });
  };

  const refId =
    purchaseRecord?.ref_no_id ??
    purchaseRecord?.id ??
    purchaseRecord?.refNoId ??
    null;

  const card = [
    {
      img: TotalSumIcon,
      img2: TotalSumIcon,
      title: 'Total Value',
      value: grnWeight.toFixed(2),
      qty: grnQuantity,
    },
    {
      img: AddedSumIcon,
      img2: AddedSumIcon,
      title: 'Total Products Added',
      value: totalProductsAdded.weight.toFixed(2),
      qty: totalProductsAdded.quantity,
    },
    {
      img: RemainingIcon,
      img2: RemainingIcon,
      title: 'Remaining Weight',
      value: remainingTotals.weight.toFixed(2),
      qty: remainingTotals.quantity,
    },
  ];

  return (
    <Grid>
      <FormSectionHeader title="Summary Details" />
      <Grid container gap={2} sx={sectionContainerStyle}>
        <Grid container width={'100%'} py={2} gap={2}>
          {rows.map((item) => (
            <Grid
              key={item.label}
              container
              width={'100%'}
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <MUHTypography
                text={item.label}
                size={15.5}
                weight={600}
                family={theme.fontFamily.roboto}
              />
              <Grid display="flex" alignItems="center" gap={1}>
                <MUHTypography
                  text={`${formatNumber(item.weight)} g`}
                  size={15.5}
                  weight={600}
                  color={theme.Colors.primary}
                  family={theme.fontFamily.roboto}
                />
                <MUHTypography
                  text={`${formatQuantity(item.quantity)} Qty`}
                  size={15.5}
                  weight={600}
                  color={theme.Colors.primary}
                  family={theme.fontFamily.roboto}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Grid width={'100%'} sx={{ zIndex: 1 }}>
          <ButtonComponent
            buttonText="View Summary"
            btnHeight={35}
            buttonFontSize={14}
            buttonFontWeight={500}
            bgColor={theme.Colors.primary}
            btnBorderRadius={2}
            onClick={handleViewSummary}
          />
        </Grid>
      </Grid>

      {viewDialog.open ? (
        <DialogComp
          open={viewDialog.open}
          dialogWidth="100%"
          dialogHeight="100vh"
          maxWidth={'lg'}
          contentPadding={0}
          borderRadius={2}
          dialogPadding={'20px'}
          showTitle={false}
          dialogTitleStyle={{ fontSize: '22px' }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <PageHeader
              title={'Summary Details - ' + `${grnNo || ''}`}
              showCreateBtn={false}
              showlistBtn={true}
              listBtnName='Create Product'
              showDownloadBtn={true}
              handleCloseClick={() => setViewDialog({ open: false })}
            />
            <Box mt={2}></Box>
            <StatusCard data={card} />
            {refId && (
              <ViewProductSummary refNoId={refId} showPageHeader={false} />
            )}
          </Box>
        </DialogComp>
      ) : null}
    </Grid>
  );
};

export default SummaryDetailsSection;
