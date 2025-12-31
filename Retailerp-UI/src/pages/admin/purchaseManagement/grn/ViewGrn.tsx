import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { Loader } from '@components/index';
import PageHeader from '@components/PageHeader';
import PurchaseCommonView from '@components/PurchaseCommonView';
import { GrnService } from '@services/GrnService';
import { HTTP_STATUSES } from '@constants/Constance';
import { Typography } from '@mui/material';

type TableKey =
  | 'sno'
  | 'refNo'
  | 'materialType'
  | 'purity'
  | 'materialPrice'
  | 'category'
  | 'subCategory'
  | 'type'
  | 'quantity'
  | 'grossWeight'
  | 'stoneWeight'
  | 'others'
  | 'othersWeight'
  | 'othersValue'
  | 'netWeight'
  | 'purchaseRate'
  | 'stoneRate'
  | 'makingCharge'
  | 'ratePerGram'
  | 'amount';

const tableHeaders: Record<TableKey, string> = {
  sno: 'S.No',
  refNo: 'Ref No.',
  materialType: 'Material Type',
  purity: 'Purity',
  materialPrice: 'Material Price/g',
  category: 'Category',
  subCategory: 'Sub Category',
  type: 'Type',
  quantity: 'Quantity',
  grossWeight: 'Gross Wt in g',
  stoneWeight: 'Stone Wt in g',
  others: 'Others',
  othersWeight: 'Others Wt in g',
  othersValue: 'Others Value',
  netWeight: 'Net Wt in g',
  purchaseRate: 'Purchase Rate',
  stoneRate: 'Stone Rate',
  makingCharge: 'Making Charge',
  ratePerGram: 'Rate Per g',
  amount: 'Total Amount',
};

const headerOrder: TableKey[] = [
  'sno',
  'refNo',
  'materialType',
  'purity',
  'materialPrice',
  'category',
  'subCategory',
  'type',
  'quantity',
  'grossWeight',
  'stoneWeight',
  'others',
  'othersWeight',
  'othersValue',
  'netWeight',
  'purchaseRate',
  'stoneRate',
  'makingCharge',
  'ratePerGram',
  'amount',
];

const columnSizes: Partial<Record<TableKey, number>> = {
  sno: 0.5,
  refNo: 0.9,
  materialType: 1.1,
  purity: 0.8,
  materialPrice: 1,
  category: 1.1,
  subCategory: 1.1,
  type: 0.8,
  quantity: 0.8,
  grossWeight: 1,
  stoneWeight: 1,
  others: 0.9,
  othersWeight: 1,
  othersValue: 1,
  netWeight: 1,
  purchaseRate: 1.2,
  stoneRate: 1.2,
  makingCharge: 1.1,
  ratePerGram: 1.1,
  amount: 1.1,
};

const formatCurrency = (value?: string | number | null): string => {
  const num = parseFloat(value as string) || 0;
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatAmount = (value: number | string) => {
  if (value === null || value === undefined || value === '') return '₹0.00';

  const str = String(value);

  const [intPart, decPart = ''] = str.split('.');

  const formattedInt = Number(intPart).toLocaleString('en-IN');
  const trimmedDec = decPart.replace(/0+$/, '');
  const finalDec = trimmedDec.padEnd(2, '0');

  return `₹${formattedInt}.${finalDec}`;
};


const formatNumber = (value?: string | number | null): string => {
  const num = parseFloat(value as string) || 0;
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(3);
};

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Only';

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += `${ones[Math.floor(n / 100)]} Hundred `;
      n %= 100;
    }
    if (n >= 20) {
      result += `${tens[Math.floor(n / 10)]} `;
      n %= 10;
    } else if (n >= 10) {
      result += `${teens[n - 10]} `;
      return result;
    }
    if (n > 0) {
      result += `${ones[n]} `;
    }
    return result;
  };

  let result = '';
  const crores = Math.floor(num / 10000000);
  if (crores) {
    result += `${convertHundreds(crores)}Crore `;
    num %= 10000000;
  }
  const lakhs = Math.floor(num / 100000);
  if (lakhs) {
    result += `${convertHundreds(lakhs)}Lakh `;
    num %= 100000;
  }
  const thousands = Math.floor(num / 1000);
  if (thousands) {
    result += `${convertHundreds(thousands)}Thousand `;
    num %= 1000;
  }
  if (num > 0) {
    result += convertHundreds(num);
  }
  return `${result.trim()} Only`;
};

type ViewGrnProps = {
  rowId?: number | string | null;
  showPageHeader?: boolean;
};

const ViewGrn: React.FC<ViewGrnProps> = ({
  rowId: propRowId,
  showPageHeader = true,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryRowId = params.get('rowId');
  const effectiveRowId = propRowId ?? queryRowId;

  const [isLoading, setIsLoading] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const computedSummary = useMemo(() => {
    if (!viewData) return null;
    const { header, items } = viewData;

    const subtotal = parseFloat(header.subtotal_amount || '0') || 0;
    const sgstPercent = parseFloat(header.sgst_percent || '0') || 0;
    const cgstPercent = parseFloat(header.cgst_percent || '0') || 0;
    const discountPercent = parseFloat(header.discount_percent || '0') || 0;
    const totalAmount = parseFloat(header.total_amount || subtotal.toString());

    const totals = items.reduce(
      (acc: any, item: any) => {
        acc.quantity += parseFloat(item.quantity || '0') || 0;
        acc.grossWt += parseFloat(item.gross_wt_in_g || '0') || 0;
        acc.stoneWt += parseFloat(item.stone_wt_in_g || '0') || 0;
        acc.othersWt += parseFloat(item.others_wt_in_g || '0') || 0;
        acc.netWt += parseFloat(item.net_wt_in_g || '0') || 0;
        acc.othersValue += parseFloat(item.others_value || '0') || 0;
        return acc;
      },
      {
        quantity: 0,
        grossWt: 0,
        stoneWt: 0,
        othersWt: 0,
        othersValue: 0,
        netWt: 0,
      }
    );

    return {
      inWords: numberToWords(Math.round(totalAmount)),
      subTotal: formatCurrency(subtotal),
      sgstPercentage: `${sgstPercent}%`,
      sgstAmount: formatCurrency((subtotal * sgstPercent) / 100),
      cgstPercentage: `${cgstPercent}%`,
      cgstAmount: formatCurrency((subtotal * cgstPercent) / 100),
      discountPercentage: `${discountPercent}%`,
      discountAmount: formatCurrency(discountPercent),
      totalAmount: formatCurrency(totalAmount),
      totalOrderedWeight: formatNumber(totals.grossWt),
      totalReceivedWeight: formatNumber(totals.netWt),
      totalQuantity: formatNumber(totals.quantity),
      totalGrossWeight: formatNumber(totals.grossWt),
      totalStoneWeight: formatNumber(totals.stoneWt),
      totalOthersWeight: formatNumber(totals.othersWt),
      totalOthersValue: formatCurrency(totals.othersValue),
      totalNetWeight: formatNumber(totals.netWt),
    };
  }, [viewData]);

  useEffect(() => {
    if (!effectiveRowId) {
      setError('Invalid GRN reference');
      toast.error('Invalid GRN reference');
      return;
    }

    const fetchViewData = async () => {
      try {
        setIsLoading(true);
        const response: any = await GrnService.view(effectiveRowId);
        if (response?.data?.statusCode === HTTP_STATUSES.OK) {
          setViewData(response.data.data);
          setError(null);
        } else {
          throw new Error(response?.data?.message || 'Failed to load GRN');
        }
      } catch (err: any) {
        console.error('Error fetching GRN view data:', err);
        setError(err?.message || 'Failed to load GRN');
        toast.error(err?.message || 'Failed to load GRN');
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewData();
  }, [effectiveRowId]);

  if (isLoading) {
    return <Loader />;
  }

  const header = viewData?.header;
  const items = viewData?.items || [];

  const grnItems = items.map((item: any, index: number) => ({
    id: String(item.id || index),
    refNo: item.ref_no || '',
    material_type: item.material_type_name || '',
    category: item.category_name || '',
    sub_category: item.subcategory_name || '',
    purity: item.purity ? `${item.purity}%` : '',
    material_price: formatAmount(item.material_price_per_g),
    type: item.type || '',
    quantity: formatNumber(item.quantity),
    gross_weight: formatNumber(item.gross_wt_in_g),
    stone_weight: formatNumber(item.stone_wt_in_g),
    others: item.others || '',
    others_weight: formatNumber(item.others_wt_in_g),
    others_value: formatCurrency(item.others_value),
    net_weight: formatNumber(item.net_wt_in_g),
    purchase_rate:formatAmount(item.purchase_rate), 
    stone_rate: formatCurrency(item.stone_rate),
    making_charge: formatAmount(item.making_charge),
    rate_per_gram: formatCurrency(item.rate_per_g),
    amount: formatCurrency(item.total_amount),
  }));

  const companyData = {
    address1: '74/1, W Poonurangam Rd',
    address2: 'R S Puram',
    city: 'Coimbatore',
    state: 'Tamil Nadu - 641002',
    mobile: '96545 569368',
    gstin: '33SSSCE563AIH',
  };

  const supplierData = {
    name: header?.vendor_name || '',
    address1: header?.vendor_address || '',
    address2: `${header?.vendor_district || ''}${
      header?.vendor_state ? `, ${header.vendor_state}` : ''
    }`,
    city: header?.vendor_country || '',
    mobile: header?.vendor_mobile || '',
    gst: header?.vendor_gst_no || '',
  };

  const grnDetails = {
    date: header?.grn_date ? dayjs(header.grn_date).format('DD/MM/YYYY') : '',
    grnNo: header?.grn_no || '',
    refNo: header?.reference_id || '',
  };

  return (
    <>
      {showPageHeader && (
        <PageHeader
          title="View GRN"
          titleStyle={{ borderBottom: '2px solid #471923', color: '#000' }}
          showDownloadBtn={true}
          showCreateBtn={false}
        />
      )}
      {error ? (
        <Typography sx={{ mt: 4, fontSize: 16, fontWeight: 500 }}>
          {error}
        </Typography>
      ) : (
        computedSummary && (
          <PurchaseCommonView
            title="CHANEIRA JEWELS"
            Subtitle="Goods Received Notes"
            dateLabel="Date"
            grnNoLabel="GRN No"
            refNoLabel="Ref No"
            showRefNo={true}
            showRemarks={true}
            tableHeaders={tableHeaders}
            headerOrder={headerOrder}
            columnSizes={columnSizes}
            showPaymentDetails={false}
            companyData={companyData}
            state={viewData?.header.vendor_state}
            supplierData={supplierData}
            grnDetails={grnDetails}
            grnItems={grnItems}
            summary={computedSummary}
            remarks={header?.remarks || '--'}
          />
        )
      )}
    </>
  );
};

export default ViewGrn;
