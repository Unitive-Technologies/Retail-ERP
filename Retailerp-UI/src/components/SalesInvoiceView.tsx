import { Box, Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/system';
import React from 'react';
import {
  columnCellStyle,
  tableColumnStyle,
  tableRowStyle,
} from '@components/CommonStyles';
import {
  InvoiceCloseIcon,
  LandingAppbarLogo,
  LargeProjectName,
} from '@assets/Images';
import SimpleQRCode from '@components/SimpleQRCode';

interface CompanyData {
  address1: string;
  address2: string;
  city: string;
  state: string;
  mobile: string;
  gstin: string;
}

interface CustomerData {
  name: string;
  address1: string;
  city: string;
  mobile: string;
}

interface InvoiceDetails {
  date: string;
  invoiceNo: string;
  branch: string;
}

interface InvoiceItem {
  id: string;
  hsnCode: string;
  productDescription: string;
  quantity: number;
  grsWeight: string;
  netWeight: string;
  wastage?: string;
  rate: string;
  amount: string;
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
  totalQuantity: number;
  totalGrsWeight: string;
  totalNetWeight: string;
  totalWastage?: string;
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
  hsnCode?: string;
  productDescription?: string;
  quantity?: string;
  grsWeight?: string;
  netWeight?: string;
  wastage?: string;
  rate?: string;
  amount?: string;
}

interface SalesInvoiceViewProps {
  companyData: CompanyData;
  customerData: CustomerData;
  invoiceDetails: InvoiceDetails;
  invoiceItems: InvoiceItem[];
  summary: Summary;
  paymentDetails: PaymentDetails;
  tableHeaders?: TableHeaders;
  heading?: string;
  subtitle?: string;
  onClose?: () => void;
  showQRCode?: boolean;
}

const SalesInvoiceView: React.FC<SalesInvoiceViewProps> = ({
  companyData,
  customerData,
  invoiceDetails,
  invoiceItems,
  summary,
  paymentDetails,
  tableHeaders = {
    sno: 'S.No',
    hsnCode: 'HSN Code',
    productDescription: 'Product Description',
    quantity: 'Quantity',
    grsWeight: 'Grs Weight',
    netWeight: 'Net Weight',
    rate: 'Rate',
    amount: 'Amount',
  },
  heading,
  subtitle = 'Tax Invoice',
  onClose,
  showQRCode = true,
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Company Header */}
      <Box
        sx={{
          position: 'relative',
          mt: 3,
          px: 3,
          pt: 2,
          pb: 3,
          backgroundColor: '#FFFFFF',
          borderRadius: 1,
        }}
      >
        {onClose && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1000,
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            <InvoiceCloseIcon />
          </Box>
        )}

        {heading && (
          <Typography
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '12px',
              fontFamily: theme.fontFamily.roboto,
              paddingRight: onClose ? '5px' : '0',
            }}
          >
            {heading}
          </Typography>
        )}
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
              {subtitle}
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

        {/* Invoice Details Section */}
        <Box
          sx={{
            width: '100%',
            p: 2,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #C3C3C3',
          }}
        >
          <Grid container display="flex" justifyContent="space-between">
            {/* Left Section - Invoice Details */}
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
                Invoice No{' '}
                <span
                  style={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  : {invoiceDetails.invoiceNo}
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
                Date{' '}
                <span
                  style={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  : {invoiceDetails.date}
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
                Branch{' '}
                <span
                  style={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  : {invoiceDetails.branch}
                </span>
              </Typography>
            </Grid>

            {/* Center Section - QR Code */}
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {showQRCode && paymentDetails.qrCodeData && (
                <SimpleQRCode
                  value={paymentDetails.qrCodeData}
                  size={120}
                  showActions={false}
                />
              )}
            </Grid>

            {/* Right Section - Customer Details */}
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
                  {customerData.name}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {customerData.address1}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  {customerData.city}
                </Typography>
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                  }}
                >
                  Mobile No - {customerData.mobile}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Table view Content*/}
        <Grid width={'100%'} paddingTop={2}>
          {/* Table Header */}
          <Grid
            container
            sx={{
              ...tableColumnStyle,
              backgroundColor: '#F8F9FA',
              borderRight: `1px solid ${theme.Colors?.grayWhiteDim || '#E0E0E0'}`,
            }}
          >
            <Grid sx={columnCellStyle} size={0.8}>
              {tableHeaders.sno}
            </Grid>
            <Grid sx={columnCellStyle} size={1.2}>
              {tableHeaders.hsnCode}
            </Grid>
            <Grid sx={columnCellStyle} size={2.5}>
              {tableHeaders.productDescription}
            </Grid>
            <Grid sx={columnCellStyle} size={1}>
              {tableHeaders.quantity}
            </Grid>
            <Grid sx={columnCellStyle} size={1.2}>
              {tableHeaders.grsWeight}
            </Grid>
            <Grid sx={columnCellStyle} size={1.2}>
              {tableHeaders.netWeight}
            </Grid>
            {tableHeaders.wastage && (
              <Grid sx={columnCellStyle} size={1.2}>
                {tableHeaders.wastage}
              </Grid>
            )}
            <Grid sx={columnCellStyle} size={1.1}>
              {tableHeaders.rate}
            </Grid>
            <Grid sx={{ ...columnCellStyle, border: 'none' }} size={1}>
              {tableHeaders.amount}
            </Grid>
          </Grid>

          {/* Table Rows */}
          {invoiceItems.map((row: InvoiceItem, index: number) => (
            <Grid container sx={tableRowStyle} key={row.id}>
              <Grid size={0.8} sx={{ ...columnCellStyle, fontWeight: 500 }}>
                {index + 1}
              </Grid>
              <Grid
                size={1.2}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.hsnCode}
              </Grid>
              <Grid
                size={2.5}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.productDescription}
              </Grid>
              <Grid
                size={1}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.quantity}
              </Grid>
              <Grid
                size={1.2}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.grsWeight} g
              </Grid>
              <Grid
                size={1.2}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.netWeight} g
              </Grid>
              {tableHeaders.wastage && (
                <Grid
                  size={1.2}
                  sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
                >
                  {row.wastage ? `${row.wastage} g` : '-'}
                </Grid>
              )}
              <Grid
                size={1.1}
                sx={{ ...columnCellStyle, fontWeight: 500, fontSize: '14px' }}
              >
                {row.rate}
              </Grid>
              <Grid
                size={1}
                sx={{
                  ...columnCellStyle,
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                {row.amount}
              </Grid>
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
            }}
          >
            <Grid
              size={0.8}
              sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
            >
              {/* Empty */}
            </Grid>
            <Grid
              size={1.2}
              sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
            >
              {/* Empty */}
            </Grid>
            <Grid
              size={2.5}
              sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
            >
              Total
            </Grid>
            <Grid
              size={1}
              sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
            >
              {summary.totalQuantity}
            </Grid>
            <Grid
              size={1.2}
              sx={{ ...columnCellStyle, borderRight: 'none', fontWeight: 600 }}
            >
              {summary.totalGrsWeight} g
            </Grid>
            <Grid
              size={1.2}
              sx={{ ...columnCellStyle, fontWeight: 600, borderRight: 'none' }}
            >
              {summary.totalNetWeight} g
            </Grid>
            {tableHeaders.wastage && (
              <Grid
                size={1.2}
                sx={{
                  ...columnCellStyle,
                  fontWeight: 600,
                  borderRight: 'none',
                }}
              >
                {summary.totalWastage ? `${summary.totalWastage} g` : '-'}
              </Grid>
            )}
            <Grid
              size={1.1}
              sx={{ ...columnCellStyle, fontWeight: 600, borderRight: 'none' }}
            >
              {/* Empty */}
            </Grid>
            <Grid
              size={1}
              sx={{
                ...columnCellStyle,
                border: 'none',
                fontWeight: 600,
                borderRight: 'none',
              }}
            >
              {summary.subTotal}
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Section - Payment Details, In Words and Summary */}
        <Box sx={{ paddingTop: 2, mb: 2 }}>
          <Grid
            container
            spacing={3}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {/* Left Side - Payment Details and In Words */}
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Payment Details */}
              <Box
                sx={{
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: theme.MetricsSizes.small_xxx,
                    fontWeight: theme.fontWeight.mediumBold,
                    color: theme.Colors.black,
                    fontFamily: theme.fontFamily.roboto,
                    marginBottom: 1,
                    borderBottom: '1px solid #000',
                    display: 'inline-block',
                    pb: 0.5,
                  }}
                >
                  PAYMENT DETAILS
                </Typography>
                <Box
                  sx={{
                    mt: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 200 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography
                        sx={{
                          color: '#7b1b2c',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        Card
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }}>
                        {paymentDetails.cardAmount}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography
                        sx={{
                          color: '#7b1b2c',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        Cash
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }}>
                        {paymentDetails.cashAmount}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography
                        sx={{
                          color: '#7b1b2c',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        UPI
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }}>
                        {paymentDetails.upiAmount}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      minWidth: 220,
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#7b1b2c',
                        fontWeight: 500,
                        fontSize: '14px',
                      }}
                    >
                      Transaction No :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: theme.fontWeight.medium,
                        mt: 0.5,
                      }}
                    >
                      {paymentDetails.transactionNumber}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* In Words */}
              <Box
                sx={{
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  p: 2,
                  height: '90px',
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
                    Discount
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Typography
                      style={{
                        fontSize: theme.MetricsSizes.small,
                        fontWeight: theme.fontWeight.mediumBold,
                        color: theme.Colors.black,
                        fontFamily: theme.fontFamily.roboto,
                      }}
                    >
                      {summary.discountPercentage}
                    </Typography>
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

export default SalesInvoiceView;
