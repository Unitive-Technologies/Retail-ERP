import { Box, Typography, useTheme, TextareaAutosize } from '@mui/material';
import { Grid } from '@mui/system';
import React from 'react';

import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
} from '@components/CommonStyles';
import { LandingAppbarLogo, LargeProjectName } from '@assets/Images';
import SimpleQRCode from '@components/SimpleQRCode';

// Interface definitions
interface CompanyData {
  address1: string;
  address2: string;
  city: string;
  state: string;
  mobile: string;
  gstin: string;
}

interface SupplierData {
  name: string;
  address1: string;
  address2: string;
  city: string;
  mobile: string;
  gst: string;
}

interface GrnDetails {
  date: string;
  grnNo: string;
  refNo?: string;
}

interface GrnItem {
  id: string;
  material_type: string;
  category: string;
  sub_category: string;
  description: string;
  purity: string;
  ordered_weight: string;
  received_weight: string;
  rate: string;
  amount: string;
  refNo?: string;
  material_price?: string;
  type?: string;
  quantity?: string;
  gross_weight?: string;
  stone_weight?: string;
  others?: string;
  others_weight?: string;
  others_value?: string;
  net_weight?: string;
  purchase_rate?: string;
  stone_rate?: string;
  making_charge?: string;
  rate_per_gram?: string;
}

interface Summary {
  inWords: string;
  subTotal: string;
  sgstPercentage: string;
  sgstAmount: string;
  cgstPercentage: string;
  cgstAmount: string;
  discountPercentage: string;
  discountAmount: string;
  totalAmount: string;
  totalReceivedWeight: string;
  totalOrderedWeight: string;
  totalQuantity?: string;
  totalGrossWeight?: string;
  totalStoneWeight?: string;
  totalOthersWeight?: string;
  totalOthersValue?: string;
  totalNetWeight?: string;
}

interface PaymentDetails {
  cardAmount: string;
  cashAmount: string;
  upiAmount: string;
  transactionNumber: string;
  qrCodeData?: string;
}

interface TableHeaders {
  sno?: string;
  refNo?: string;
  materialType?: string;
  materialPrice?: string;
  category?: string;
  subCategory?: string;
  type?: string;
  description?: string;
  purity?: string;
  orderedWeight?: string;
  receivedWeight?: string;
  quantity?: string;
  grossWeight?: string;
  stoneWeight?: string;
  others?: string;
  othersWeight?: string;
  othersValue?: string;
  netWeight?: string;
  rate?: string;
  purchaseRate?: string;
  stoneRate?: string;
  makingCharge?: string;
  ratePerGram?: string;
  amount?: string;
}

type TableHeaderKey = keyof TableHeaders;

const DEFAULT_HEADER_ORDER: TableHeaderKey[] = [
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

const DEFAULT_COLUMN_SIZES: Record<TableHeaderKey, number> = {
  sno: 0.6,
  refNo: 1,
  materialType: 1.2,
  materialPrice: 1.2,
  category: 1.2,
  subCategory: 1.2,
  type: 0.9,
  description: 1.5,
  purity: 0.9,
  orderedWeight: 1.1,
  receivedWeight: 1.1,
  quantity: 0.9,
  grossWeight: 1.1,
  stoneWeight: 1.1,
  others: 0.9,
  othersWeight: 1,
  othersValue: 1,
  netWeight: 1,
  rate: 1,
  purchaseRate: 1.2,
  stoneRate: 1.2,
  makingCharge: 1.1,
  ratePerGram: 1.1,
  amount: 1.1,
};

interface PurchaseCommonViewProps {
  title?: string;
  companyData: CompanyData;
  supplierData: SupplierData;
  grnDetails: GrnDetails;
  grnItems: GrnItem[];
  summary: Summary;
  paymentDetails?: PaymentDetails;
  remarks: string;
  Subtitle?: string;
  dateLabel?: string;
  grnNoLabel?: string;
  refNoLabel?: string;
  showRefNo?: boolean;
  tableHeaders?: TableHeaders;
  showRemarks?: boolean;
  showPaymentDetails?: boolean;
  cardAmount?: number;
  cashAmount?: number;
  upiAmount?: number;
  transactionNo?: string;
  showAddress2?: boolean;
  columnSizes?: Partial<Record<TableHeaderKey, number>>;
  headerOrder?: TableHeaderKey[];
  showQRCode?: boolean;
  qrCodeValue?: string;
  state?: string;
}

const PurchaseCommonView: React.FC<PurchaseCommonViewProps> = ({
  title,
  companyData,
  supplierData,
  grnDetails,
  grnItems,
  summary,
  remarks,
  Subtitle,
  dateLabel = 'Date',
  grnNoLabel = 'GRN No',
  refNoLabel = 'Ref No',
  showRefNo = true,
  showAddress2 = true,
  tableHeaders = {
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
  },
  showRemarks = true,
  showPaymentDetails = false,
  cardAmount = 0,
  cashAmount = 0,
  upiAmount = 0,
  transactionNo = '',
  columnSizes,
  headerOrder = DEFAULT_HEADER_ORDER,
  showQRCode = false,
  qrCodeValue = '',
  state = '',
}) => {
  const theme = useTheme();
  const mergedColumnSizes = React.useMemo(
    () => ({ ...DEFAULT_COLUMN_SIZES, ...columnSizes }),
    [columnSizes]
  );
  const baseColumnWidth = 110;
  const getColumnWidth = (key: TableHeaderKey) =>
    (mergedColumnSizes[key] ?? 1) * baseColumnWidth;

  const renderRowCellContent = (
    key: TableHeaderKey,
    row: GrnItem,
    index: number
  ) => {
    switch (key) {
      case 'sno':
        return index + 1;
      case 'refNo':
        return row.refNo;
      case 'materialType':
        return row.material_type;
      case 'materialPrice':
        return row.material_price;
      case 'category':
        return row.category;
      case 'subCategory':
        return row.sub_category;
      case 'type':
        return row.type;
      case 'description':
        return row.description;
      case 'purity':
        return row.purity;
      case 'orderedWeight':
        return row.ordered_weight;
      case 'receivedWeight':
        return row.received_weight;
      case 'quantity':
        return row.quantity;
      case 'grossWeight':
        return row.gross_weight;
      case 'stoneWeight':
        return row.stone_weight;
      case 'others':
        return row.others;
      case 'othersWeight':
        return row.others_weight;
      case 'othersValue':
        return row.others_value;
      case 'netWeight':
        return row.net_weight;
      case 'rate':
        return row.rate;
      case 'purchaseRate':
        return row.purchase_rate;
      case 'stoneRate':
        return row.stone_rate;
      case 'makingCharge':
        return row.making_charge;
      case 'ratePerGram':
        return row.rate_per_gram;
      case 'amount':
        return row.amount;
      default:
        return null;
    }
  };

  const renderTotalCellContent = (key: TableHeaderKey, index: number) => {
    // Show "Total" in the first column (sno)
    if (key === 'sno' && index === 0) {
      return 'Total';
    }

    // For invoice layout: show empty for refNo and description columns when they are in first 3 positions
    if (index <= 2) {
      if (key === 'refNo' || key === 'description' || key === 'materialType' || key === 'type') {
        return '';
      }
    }

    switch (key) {
      case 'quantity':
        return summary.totalQuantity;
      case 'grossWeight':
        return summary.totalGrossWeight;
      case 'stoneWeight':
        return summary.totalStoneWeight;
      case 'othersWeight':
        return summary.totalOthersWeight;
      case 'othersValue':
        return summary.totalOthersValue;
      case 'netWeight':
        return summary.totalNetWeight;
      case 'orderedWeight':
        return summary.totalOrderedWeight;
      case 'receivedWeight':
        return summary.totalReceivedWeight;
      case 'amount':
        return summary.subTotal;
      default:
        // For other columns in the first 3 positions that aren't handled above, return empty
        if (index <= 2) {
          return '';
        }
        return null;
    }
  };

  return (
    <>
      {/* Company Header */}
      {/* <Typography
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#000000',
          borderBottom: '2px solid #471923',
          width: 'fit-content',
        }}
      >
        {title}
      </Typography> */}
      <Box
        sx={{
          mt: 3,

          spacing: 2,
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '16px 24px',
            borderBottom: '1px solid #C3C3C3',
            position: 'relative',
          }}
        >
          {/* Left: Logo */}
          <Box>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                height: '150px',
                width: '324px',
                borderRadius: '4px',
                background: `linear-gradient(135deg, rgba(71,25,35,1) 0%, rgba(127,50,66,1) 100%)`,
                px: 2,
                cursor: 'pointer',
              }}
            >
              <img
                src={LandingAppbarLogo}
                style={{ width: '91px', height: '95px' }}
              />
              <img src={LargeProjectName} />
            </Grid>
          </Box>

          {/* Center: Title (bottom aligned) */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '8px',
              textAlign: 'center',
            }}
          >
            <Typography
              style={{
                fontSize: theme.MetricsSizes.medium_x,
                fontWeight: theme.fontWeight.mediumBold,
                color: theme.Colors.black,
                fontFamily: theme.fontFamily.roboto,
              }}
            >
              {Subtitle}
            </Typography>
          </Box>

          {/* Right: Address */}
          <Box sx={{ textAlign: 'right', fontSize: '13px', lineHeight: 1.6 }}>
            <Typography
              style={{
                fontSize: theme.MetricsSizes.small_xxx,
                fontFamily: theme.fontFamily.roboto,
                color: theme.Colors.black,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              {companyData.address1}
              <br />
              {companyData.address2}
              <br />
              {companyData.city}
              <br />
              {companyData.state}
              <br />
              Mobile No - {companyData.mobile}
              <br />
              GSTIN - {companyData.gstin}
            </Typography>
          </Box>
        </Box>

        {/* GRN Details Section */}
        <Box
          sx={{
            width: '100%',
            p: 2,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #C3C3C3',
          }}
        >
          <Grid container display="flex" justifyContent="space-between">
            {/* Left Section */}
            <Grid>
              <Typography
                style={{
                  color: theme.Colors.primary,
                  fontFamily: theme.fontFamily.roboto,
                  fontWeight: theme.fontWeight.mediumBold,
                  fontSize: theme.MetricsSizes.small_xxx,
                  marginTop: '15px',
                }}
              >
                {dateLabel}{' '}
                <span
                  style={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  : {grnDetails.date}
                </span>
              </Typography>

              <Typography
                style={{
                  color: theme.Colors.primary,
                  fontFamily: theme.fontFamily.roboto,
                  fontWeight: theme.fontWeight.mediumBold,
                  fontSize: theme.MetricsSizes.small_xxx,
                  marginTop: '15px',
                }}
              >
                {grnNoLabel}{' '}
                <span
                  style={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  : {grnDetails.grnNo}
                </span>
              </Typography>

              {showRefNo && (
                <Typography
                  style={{
                    color: theme.Colors.primary,
                    fontFamily: theme.fontFamily.roboto,
                    fontWeight: theme.fontWeight.mediumBold,
                    fontSize: theme.MetricsSizes.small_xxx,
                    marginTop: '15px',
                  }}
                >
                  {refNoLabel}{' '}
                  <span
                    style={{
                      color: theme.Colors.black,
                      fontWeight: theme.fontWeight.mediumBold,
                      fontSize: theme.MetricsSizes.small_xxx,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    : {grnDetails.refNo}
                  </span>
                </Typography>
              )}
            </Grid>

            {/* Right Section - Supplier Details */}
            <Grid>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.mediumBold,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {supplierData.name}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {supplierData.address1}
                </Typography>
                {showAddress2 && (
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.regular,
                      fontWeight: theme.fontWeight.regular,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {supplierData.address2}
                  </Typography>
                )}
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {supplierData.city}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {supplierData.mobile}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {supplierData.gst}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Table view Content*/}
        <Box
          sx={{
            width: '100%',
            paddingTop: 2,
            paddingX: 2,
            paddingBottom: 2,
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'block',
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.Colors.grayWhiteDim} transparent`,
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.Colors.grayWhiteDim,
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: theme.Colors.dustyGray || '#999',
              },
            },
          }}
        >
          <Box sx={{ width: 'max-content' }}>
            {/* Table Header */}
            <Grid
              container
              sx={{
                ...tableColumnStyle,
                whiteSpace: 'nowrap',
                backgroundColor: '#F8F9FA',
                borderRight: `1px solid ${
                  theme.Colors?.grayWhiteDim || '#E0E0E0'
                }`,
                width: 'max-content',
                flexWrap: 'nowrap',
              }}
            >
              {headerOrder.map((key, keyIndex) => {
                const columnWidth = getColumnWidth(key);
                return (
                  <Grid
                    key={key}
                    sx={{
                      ...columnCellStyle,
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingY: 0.75,
                      minWidth: columnWidth,
                      maxWidth: columnWidth,
                      flex: `0 0 ${columnWidth}px`,
                      textAlign: 'center',
                      ...(key === 'amount' || keyIndex === headerOrder.length - 1
                        ? { border: 'none' }
                        : {}),
                    }}
                  >
                    {tableHeaders[key]}
                  </Grid>
                );
              })}
            </Grid>

            {/* Table Rows */}
            {grnItems.map((row: GrnItem, index: number) => (
              <Grid
                container
                sx={{ ...tableRowStyle, width: 'max-content', flexWrap: 'nowrap' }}
                key={row.id}
              >
                {headerOrder.map((key, keyIndex) => {
                  const columnWidth = getColumnWidth(key);
                  return (
                    <Grid
                      key={`${row.id}-${key}`}
                      sx={{
                        ...columnCellStyle,
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingY: 0.75,
                        fontWeight: 500,
                        fontSize: key === 'sno' ? undefined : '14px',
                        minWidth: columnWidth,
                        maxWidth: columnWidth,
                        flex: `0 0 ${columnWidth}px`,
                        textAlign: 'center',
                        ...(key === 'amount' ||
                        keyIndex === headerOrder.length - 1
                          ? { border: 'none' }
                          : {}),
                      }}
                    >
                      {renderRowCellContent(key, row, index)}
                    </Grid>
                  );
                })}
              </Grid>
            ))}

            {/* Total Row */}
            <Grid
              container
              sx={{
                ...tableRowStyle,
                backgroundColor: '#F5F5F5',
                fontWeight: 600,
                borderBottom: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderLeft: `1px solid ${theme.Colors.grayWhiteDim}`,
                borderRight: `1px solid ${theme.Colors.grayWhiteDim}`,
                border: '0px 0px 8px 8px',
                width: 'max-content',
                flexWrap: 'nowrap',
              }}
            >
              {headerOrder.map((key, keyIndex) => {
                const columnWidth = getColumnWidth(key);
                const totalContent = renderTotalCellContent(key, keyIndex);

                return (
                  <Grid
                    key={`total-${key}`}
                    sx={{
                      ...columnCellStyle,
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingY: 0.75,
                      borderRight: 'none',
                      fontWeight: 600,
                      minWidth: columnWidth,
                      maxWidth: columnWidth,
                      flex: `0 0 ${columnWidth}px`,
                      textAlign: 'center',
                      ...(key === 'amount' || keyIndex === headerOrder.length - 1
                        ? { border: 'none' }
                        : {}),
                    }}
                  >
                    {totalContent}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>

        {/* Bottom Section - Remarks and Summary */}
        <Box sx={{ paddingTop: 2, mb: 2 }}>
          <Grid
            container
            spacing={3}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {/* Left Side - In Words and Remarks */}
            <Grid size={{ xs: 12, md: 7 }}>
              {/* In Words */}
              <Box
                sx={{
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  p: 2,
                  height: '90px',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: theme.MetricsSizes.small_xxx,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                    marginBottom: 1,
                  }}
                >
                  In Words
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.MetricsSizes.regular,
                    color: theme.Colors.black,
                    fontWeight: theme.fontWeight.mediumBold,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {summary.inWords}
                </Typography>
              </Box>

              {/* QR Code */}
              {showQRCode && qrCodeValue && (
                <Box sx={{ mt: 2 }}>
                  <SimpleQRCode
                    value={qrCodeValue}
                    size={120}
                    showActions={false}
                    style={{
                      border: 'none',
                    }}
                  />
                </Box>
              )}
              {/* Payment Details Section */}
              {showPaymentDetails && (
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2,
                    mt: 2,
                    fontSize: 14,
                    width: 'fit-content',
                    minWidth: 400,
                  }}
                >
                  {/* Header */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      borderBottom: '1px solid #000',
                      display: 'inline-block',
                    }}
                  >
                    PAYMENT DETAILS
                  </Typography>

                  {/* Payment Rows */}
                  <Grid container spacing={1}>
                    {/* Left Side - Payment Types */}
                    <Grid size={{ xs: 6, md: 6 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <Typography sx={{ color: '#7b1b2c', fontWeight: 500 }}>
                          Card
                        </Typography>
                        <Typography>
                          ₹
                          {cardAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <Typography sx={{ color: '#7b1b2c', fontWeight: 500 }}>
                          Cash
                        </Typography>
                        <Typography>
                          ₹
                          {cashAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography sx={{ color: '#7b1b2c', fontWeight: 500 }}>
                          UPI
                        </Typography>
                        <Typography>
                          ₹
                          {upiAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Right Side - Transaction No */}
                    <Grid
                      size={{ xs: 6, md: 6 }}
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography sx={{ color: '#7b1b2c', fontWeight: 500 }}>
                          Transaction No :
                        </Typography>
                        <Typography>{transactionNo}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Remarks */}
              {showRemarks && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: theme.MetricsSizes.regular,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                      marginTop: '3px',

                      borderBottom: '2px solid #471923',
                      width: 'fit-content',
                    }}
                  >
                    REMARKS
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #E4E4E4',
                      borderRadius: '4px',
                      height: '110px',
                      marginTop: '20px',
                    }}
                  >
                    <TextareaAutosize
                      value={remarks}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        padding: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'none',
                        borderRadius: '4px',
                      }}
                      readOnly
                    />
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Right Side - Amount Summary */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  backgroundColor: '#F8EBF0',
                  border: '1px solid #DCDCDC',
                  borderRadius: '4px',
                  p: 0,
                }}
              >
                {/* Sub Total */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #E0E0E0',
                  }}
                >
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small_xx,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    Sub Total
                  </Typography>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {summary.subTotal}
                  </Typography>
                </Box>
                {state === 'Tamil Nadu' ? (
                  <>
                    {/* SGST */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid #E0E0E0',
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: theme.MetricsSizes.small_xx,
                          fontWeight: theme.fontWeight.medium,
                          color: theme.Colors.black,
                          fontFamily: theme.fontFamily.roboto,
                        }}
                      >
                        SGST
                      </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography
                          style={{
                            fontSize: theme.MetricsSizes.small,
                            fontWeight: theme.fontWeight.mediumBold,
                            color: theme.Colors.black,
                            fontFamily: theme.fontFamily.roboto,
                          }}
                        >
                          {summary.sgstPercentage}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: theme.MetricsSizes.small,
                            fontWeight: theme.fontWeight.mediumBold,
                            color: theme.Colors.black,
                            fontFamily: theme.fontFamily.roboto,
                          }}
                        >
                          {summary.sgstAmount}
                        </Typography>
                      </Box>
                    </Box>

                    {/* CGST */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid #E0E0E0',
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: theme.MetricsSizes.small_xx,
                          fontWeight: theme.fontWeight.medium,
                          color: theme.Colors.black,
                          fontFamily: theme.fontFamily.roboto,
                        }}
                      >
                        CGST
                      </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography
                          style={{
                            fontSize: theme.MetricsSizes.small,
                            fontWeight: theme.fontWeight.mediumBold,
                            color: theme.Colors.black,
                            fontFamily: theme.fontFamily.roboto,
                          }}
                        >
                          {summary.cgstPercentage}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#000000',
                          }}
                        >
                          {summary.cgstAmount}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 3,
                      py: 2,
                      borderBottom: '1px solid #E0E0E0',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: theme.MetricsSizes.small_xx,
                        fontWeight: theme.fontWeight.medium,
                        color: theme.Colors.black,
                        fontFamily: theme.fontFamily.roboto,
                      }}
                    >
                      IGST
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Typography
                        style={{
                          fontSize: theme.MetricsSizes.small,
                          fontWeight: theme.fontWeight.mediumBold,
                          color: theme.Colors.black,
                          fontFamily: theme.fontFamily.roboto,
                        }}
                      >
                        {summary.sgstPercentage}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: theme.MetricsSizes.small,
                          fontWeight: theme.fontWeight.mediumBold,
                          color: theme.Colors.black,
                          fontFamily: theme.fontFamily.roboto,
                        }}
                      >
                        {summary.sgstAmount}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {/* Discount */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #E0E0E0',
                  }}
                >
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small_xx,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    Round Off
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    {/* <Typography
                      style={{
                        fontSize: theme.MetricsSizes.small,
                        fontWeight: theme.fontWeight.mediumBold,
                        color: theme.Colors.black,
                        fontFamily: theme.fontFamily.roboto,
                      }}
                    >
                      {summary.discountPercentage}
                    </Typography> */}
                    <Typography
                      style={{
                        fontSize: theme.MetricsSizes.small,
                        fontWeight: theme.fontWeight.mediumBold,
                        color: theme.Colors.black,
                        fontFamily: theme.fontFamily.roboto,
                      }}
                    >
                      {summary.discountAmount}
                    </Typography>
                  </Box>
                </Box>

                {/* Total Amount */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small_xx,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    style={{
                      fontSize: theme.MetricsSizes.small_xx,
                      fontWeight: theme.fontWeight.mediumBold,
                      color: theme.Colors.black,
                      fontFamily: theme.fontFamily.roboto,
                    }}
                  >
                    {summary.totalAmount}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PurchaseCommonView;
