import { Box } from '@mui/material';
import ReceiptView from '@components/ReceiptViewComponent';

const companyData = {
  address1: '74/1, W Poonurangam Rd',
  address2: 'R S Puram',
  city: 'Coimbatore',
  state: 'Tamil Nadu - 641002',
  mobile: '9876543210',
  gstin: '33ABCDE1234F1Z5',
};

const grnDetails = {
  date: '10-Nov-2025',
  grnNo: 'GRN/011/24-25',
  receiptNo: 'RCPT/2025/001',
  billType: 'Cash',
  paymentMode: 'UPI',
  bankName: 'HDFC Bank',
  chequeNo: '-',
  accountName: 'Chaneira Jewels',
  amount: '₹15,000',
  amountInWords: 'Fifteen Thousand Rupees Only',
  remarks: 'Payment received successfully.',
};

const ReceiptPage = () => {
  return (
    <Box sx={{ p: 4, background: '#f5f5f5' }}>
      <ReceiptView
        title=" VIEW RECEIPT"
        Subtitle=" Receipt"
        companyData={companyData}
        grnDetails={grnDetails}
        remarks={''}
      />
    </Box>
  );
};

export default ReceiptPage;
