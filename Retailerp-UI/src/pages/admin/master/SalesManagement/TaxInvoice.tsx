import { Box } from '@mui/material';
import SalesInvoiceView from '@components/SalesInvoiceView';
import FormAction from '@components/ProjectCommon/FormAction';

const TaxInvoice = () => {

  const companyData = {
    address1: '74/1, W Poonurangam Rd',
    address2: 'R S Puram',
    city: 'Coimbatore',
    state: 'Tamil Nadu - 641002',
    mobile: '96545 569368',
    gstin: '33SSSCE563AIH',
  };

  const customerData = {
    name: 'Mr./Ms. Ashok Kumar',
    address1: '123/1, West street, KM Nagar',
    city: 'Salem - 625869',
    mobile: '89687 89657',
  };

  const invoiceDetails = {
    date: '19/05/2025',
    invoiceNo: 'INV 01/24-25',
    branch: 'Salem Branch',
  };

  const invoiceItems = [
    {
      id: '1',
      hsnCode: '71131910',
      productDescription: 'Silver Ring',
      quantity: 1,
      grsWeight: '10.25',
      netWeight: '10.25',
      rate: '110.00',
      amount: '₹10,000',
    },
    {
      id: '2',
      hsnCode: '71131910',
      productDescription: 'Silver Chain',
      quantity: 1,
      grsWeight: '11.89',
      netWeight: '11.89',
      rate: '110.00',
      amount: '₹11,000',
    },
  ];

  const summary = {
    inWords: 'Twenty One Thousand Four Hundred Sixty Five Only.',
    subTotal: '₹21,000.00',
    sgstPercentage: '1.5%',
    sgstAmount: '₹290.00',
    cgstPercentage: '1.5%',
    cgstAmount: '₹290.00',
    discountPercentage: '2%',
    discountAmount: '₹115.00',
    totalAmount: '₹21,465.00',
    totalQuantity: 2,
    totalGrsWeight: '22.35',
    totalNetWeight: '22.35',
  };

  const paymentDetails = {
    cardAmount: '₹10,000.00',
    cashAmount: '₹11,000.00',
    upiAmount: '₹0',
    transactionNumber: 'UID52552221200FD22225',
    qrCodeData: `Invoice: ${invoiceDetails.invoiceNo}, Amount: ${summary.totalAmount}`,
  };

  const tableHeaders = {
    sno: 'S.No',
    hsnCode: 'HSN Code',
    productDescription: 'Product Description',
    quantity: 'Quantity',
    grsWeight: 'Grs Weight',
    netWeight: 'Net Weight',
    rate: 'Rate',
    amount: 'Amount',
  };

  const handleClose = () => {};

  const handleBack = () => {};

  const handleCancel = () => {};

  return (
    <Box>
      <SalesInvoiceView
        heading="SALES INVOICE"
        subtitle="Tax Invoice"
        companyData={companyData}
        customerData={customerData}
        invoiceDetails={invoiceDetails}
        invoiceItems={invoiceItems}
        summary={summary}
        paymentDetails={paymentDetails}
        tableHeaders={tableHeaders}
        onClose={handleClose}
      />

      <FormAction
        handleCreate={handleBack}
        firstBtntxt="Back"
        handleCancel={handleCancel}
      />
    </Box>
  );
};

export default TaxInvoice;
