import { Box, useTheme } from '@mui/material';
import SalesInvoiceView from '@components/SalesInvoiceView';
import FormAction from '@components/ProjectCommon/FormAction';

const SalesReturnBill = () => {
  const theme = useTheme();

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
    invoiceNo: 'SR 01/24-25',
    date: '19/05/2025',
    branch: 'Anna Nagar',
  };

  const invoiceItems = [
    {
      id: '1',
      hsnCode: '71131910',
      productDescription: 'Silver Ring',

      grsWeight: '10.25',
      netWeight: '10.25',
      wastage: '2.25',
      quantity: 1,
      rate: '₹10,000',
      amount: '₹10,000',
    },
    {
      id: '2',
      hsnCode: '71131910',
      productDescription: 'Silver Chain',

      grsWeight: '11.89',
      netWeight: '11.89',
      wastage: '4.52',
      quantity: 1,
      rate: '₹11,000',
      amount: '₹11,000',
    },
  ];

  const summary = {
    inWords: 'Twenty One Thousand Four Hundred Sixty Five Only',
    subTotal: '₹21,000.00',
    sgstPercentage: '1.5 %',
    sgstAmount: '₹290.00',
    cgstPercentage: '1.5 %',
    cgstAmount: '₹290.00',
    discountPercentage: '2 %',
    discountAmount: '₹115.00',
    totalAmount: '₹21,465.00',
    totalQuantity: 2,
    totalGrsWeight: '22.35',
    totalNetWeight: '22.35',
    totalWastage: '6.77',
  };

  const paymentDetails = {
    cardAmount: '₹10,000.00',
    cashAmount: '₹11,000.00',
    upiAmount: '₹0',
    transactionNumber: 'UID525522212DDFD22225',
  };
  const handleBack = () => {};
  const handleCancel = () => {};
  const handleClose = () => {};
  return (
    <Box>
      <SalesInvoiceView
        heading="SALES RETURN PRODUCT"
        subtitle="Sales Return"
        companyData={companyData}
        customerData={customerData}
        invoiceDetails={invoiceDetails}
        invoiceItems={invoiceItems}
        summary={summary}
        onClose={handleClose}
        paymentDetails={paymentDetails}
        tableHeaders={{
          sno: 'S.No',
          hsnCode: 'HSN Code',
          productDescription: 'Product Description',
          grsWeight: 'Grs Weight',
          netWeight: 'Net Weight',
          wastage: 'Wastage',
          quantity: 'Quantity',
          rate: 'Rate',
          amount: 'Amount',
        }}
        showQRCode={false}
      />

      <FormAction
        handleCreate={handleBack}
        firstBtntxt="Back"
        handleCancel={handleCancel}
      />
    </Box>
  );
};

export default SalesReturnBill;
