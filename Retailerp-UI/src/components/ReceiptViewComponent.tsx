import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { LandingAppbarLogo, LargeProjectName } from '@assets/Images';
import PageHeader from './PageHeader';

// Interface definitions
interface CompanyData {
  address1: string;
  address2: string;
  city: string;
  state: string;
  mobile: string;
  gstin: string;
}

interface GrnDetails {
  date: string;
  grnNo: string;
  refNo?: string;
  receiptNo?: string;
  billType?: string;
  paymentMode?: string;
  bankName?: string;
  chequeNo?: string;
  accountName?: string;
  amount?: string;
  amountInWords?: string;
  remarks?: string;
}

interface ReceiptViewProps {
  title?: string;
  companyData: CompanyData;
  grnDetails: GrnDetails;
  remarks: string;
  Subtitle?: string;
  dateLabel?: string;
  grnNoLabel?: string;
  refNoLabel?: string;
  showRefNo?: boolean;
  showPaymentDetails?: boolean;
  cardAmount?: number;
  cashAmount?: number;
  upiAmount?: number;
  transactionNo?: string;
  showAddress2?: boolean;
}

const Detail = ({
  label,
  value,
  align = 'left',
}: {
  label: string;
  value: string | number | undefined;
  isBold?: boolean;
  align?: 'left' | 'right';
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      mb: 1.5,
      minHeight: 40,
    }}
  >
    <Typography
      style={{
        minWidth: 200,
        color: '#6D2E3D',
        fontWeight: 600,
        fontSize: 16,
        textAlign: align,
      }}
    >
      {label}
    </Typography>
    <Typography
      style={{
        marginLeft: align === 'right' ? 1 : 2,
        fontWeight: 600,
        fontSize: 16,
        color: '#000000',
        textAlign: align,
      }}
    >
      : {value || '-'}
    </Typography>
  </Box>
);

const ReceiptView: React.FC<ReceiptViewProps> = ({
  title,
  companyData,
  grnDetails,
  Subtitle,
}) => {
  const theme = useTheme();

  // Defensive fallback for missing grnDetails fields
  const safeGrnDetails = {
    date: grnDetails?.date || '',
    grnNo: grnDetails?.grnNo || '',
    refNo: grnDetails?.refNo || '',
    receiptNo: grnDetails?.receiptNo || '',
    billType: grnDetails?.billType || '',
    paymentMode: grnDetails?.paymentMode || '',
    bankName: grnDetails?.bankName || '',
    chequeNo: grnDetails?.chequeNo || '',
    accountName: grnDetails?.accountName || '',
    amount: grnDetails?.amount || '',
    amountInWords: grnDetails?.amountInWords || '',
    remarks: grnDetails?.remarks || '',
  };

  function getTitle() {
    return title || 'Receipt';
  }

  return (
    <>
      {/* Company Header */}
      <PageHeader
        title={getTitle()}
        navigateUrl="/admin/master/branch"
        showCreateBtn={false}
        showlistBtn={true}
        showDownloadBtn={true}
        titleStyle={{
          color: theme.Colors.black,
          fontWeight: 600,
          fontSize: 18,
          textTransform: 'uppercase',
        }}
      />
      <Box
        sx={{
          mt: 3,
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
              GSTIN-{companyData.gstin}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            border: '1px solid #badae0',
            px: 2,
            py: 2,
            borderRadius: '8px',
            mb: 2,
          }}
        >
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Detail label="Date" value={safeGrnDetails.date} />
              <Detail label="Bill Type" value={safeGrnDetails.billType} />
              <Detail label="Bank Name" value={safeGrnDetails.bankName} />
              <Detail label="Account Name" value={safeGrnDetails.accountName} />
              <Detail
                label="Amount In Words"
                value={safeGrnDetails.amountInWords}
              />
              <Detail label="Remarks" value={safeGrnDetails.remarks} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Detail label="Receipt No" value={safeGrnDetails.receiptNo} />
              <Detail label="Payment Mode" value={safeGrnDetails.paymentMode} />
              <Detail label="Cheque NO" value={safeGrnDetails.chequeNo} />
              <Detail label="Amount" value={safeGrnDetails.amount} isBold />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            width: '400px',
            height: '140px',
            borderRadius: '6px',
            border: '1.38px solid #209CEE',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            ml: 'auto',
            mt: 4,
            mr: 4,
            background: '#fff',
            opacity: 1,
            pb: 3,
            pr: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
            }}
          >
            Authorized Signature
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ReceiptView;
