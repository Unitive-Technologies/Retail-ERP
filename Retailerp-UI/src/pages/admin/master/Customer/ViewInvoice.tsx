import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PurchaseCommonView from '@components/PurchaseCommonView';
import { DownloadIconPdf, PrintOutIcon, InvoiceCloseIcon } from '@assets/Images';

const ViewInvoice = () => {
  const navigate = useNavigate();

  const companyData = {
    address1: '74/1, W Poonurangam Rd',
    address2: 'R S Puram',
    city: 'Coimbatore',
    state: 'Tamil Nadu - 641002',
    mobile: '96545 569368',
    gstin: '33SSSCE563AIH',
  };

  const supplierData = {
    name: 'Mr./Ms. Kishore Kumar',
    address1: '123/1, West street, KM Nagar',
    address2: '',
    city: 'Salem - 625869',
    mobile: '89687 89657',
    gst: '',
  };

  const grnDetails = {
    date: '19/05/2025',
    grnNo: 'INV 01/24-25',
    refNo: 'HKM Branch',
  };

  const grnItems = [
    {
      id: '1',
      material_type: '',
      category: '',
      sub_category: '',
      description: 'Silver Ring',
      purity: '',
      ordered_weight: '',
      received_weight: '',
      refNo: '71131910',
      quantity: '1',
      gross_weight: '10.25 g',
      net_weight: '10.25 g',
      rate: '110.00',
      amount: '₹10,000',
    },
    {
      id: '2',
      material_type: '',
      category: '',
      sub_category: '',
      description: 'Silver Chain',
      purity: '',
      ordered_weight: '',
      received_weight: '',
      refNo: '71131910',
      quantity: '1',
      gross_weight: '11.89 g',
      net_weight: '11.89 g',
      rate: '110.00',
      amount: '₹11,000',
    },
  ];

  const summary = {
    inWords: 'Twenty One Thousand Four Hundred Sixty Five Only',
    subTotal: '₹21,000.00',
    sgstPercentage: '1.5%',
    sgstAmount: '₹290.00',
    cgstPercentage: '1.5%',
    cgstAmount: '₹290.00',
    discountPercentage: '2%',
    discountAmount: '₹115.00',
    totalAmount: '₹21,465.00',
    totalReceivedWeight: '',
    totalOrderedWeight: '',
    totalQuantity: '2',
    totalGrossWeight: '22.35 g',
    totalNetWeight: '22.35 g',
  };

  const remarks = '';

  const handleDownload = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        padding: 3,
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#471923',
          height: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: 2,
          mb: 2,
          borderRadius: '4px 4px 0 0',
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          VIEW INVOICE
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleDownload}
            sx={{
              width: '28px',
              height: '28px',
              padding: 0,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <img src={DownloadIconPdf} width={20} height={20} alt="Download" />
          </IconButton>
          <IconButton
            onClick={handlePrint}
            sx={{
              width: '28px',
              height: '28px',
              padding: 0,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <img src={PrintOutIcon} width={18} height={18} alt="Print" />
          </IconButton>
          <IconButton
            onClick={handleClose}
            sx={{
              width: '28px',
              height: '28px',
              padding: 0,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <InvoiceCloseIcon style={{ width: 20, height: 20 }} />
          </IconButton>
        </Box>
      </Box>

      <PurchaseCommonView
        title="View Invoice"
        companyData={companyData}
        supplierData={supplierData}
        grnDetails={grnDetails}
        grnItems={grnItems}
        summary={summary}
        remarks={remarks}
        Subtitle="Tax Invoice"
        dateLabel="Date"
        grnNoLabel="Invoice No"
        refNoLabel="Branch"
        showRefNo={true}
        showPaymentDetails={true}
        cardAmount={10000}
        cashAmount={11000}
        upiAmount={0}
        transactionNo="UID525522212DDFD22225"
        showAddress2={false}
        showRemarks={false}
        tableHeaders={{
          sno: 'S.No',
          refNo: 'HSN Code',
          description: 'Product Name',
          quantity: 'Quantity',
          grossWeight: 'Grs Weight',
          netWeight: 'Net Weight',
          rate: 'Rate',
          amount: 'Amount',
        }}
        headerOrder={['sno', 'refNo', 'description', 'quantity', 'grossWeight', 'netWeight', 'rate', 'amount']}
        columnSizes={{
          sno: 0.5,
          refNo: 0.9,
          description: 1.2,
          quantity: 0.7,
          grossWeight: 0.9,
          netWeight: 0.9,
          rate: 0.8,
          amount: 1.0,
        }}
        showQRCode={true}
        qrCodeValue={`Invoice: ${grnDetails.grnNo}\nAmount: ${summary.totalAmount}\nDate: ${grnDetails.date}`}
      />
    </Box>
  );
};

export default ViewInvoice;
