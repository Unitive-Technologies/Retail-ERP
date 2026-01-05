import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PurchaseCommonView from '@components/PurchaseCommonView';
import {
  DialogCloseIcon,
  DialogPrintIcon,
  DialogDownloadIcon,
} from '@assets/Images';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';
import { Loader } from '@components/index';

const ViewInvoice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceNo = searchParams.get('invoice_no');

  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const numberToWords = (num: number): string => {
    const integerPart = Math.floor(Math.abs(num));

    if (integerPart === 0) return 'Zero Only';

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
      n = Math.floor(n);
      let result = '';

      if (n >= 100) {
        const hundreds = Math.floor(n / 100);
        result += ones[hundreds] + ' Hundred ';
        n %= 100;
      }

      if (n >= 20) {
        const tensPlace = Math.floor(n / 10);
        result += tens[tensPlace] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }

      if (n > 0) {
        result += ones[n] + ' ';
      }

      return result;
    };

    let result = '';
    let remaining = integerPart;

    const crores = Math.floor(remaining / 10000000);
    if (crores > 0) {
      result += convertHundreds(crores) + 'Crore ';
      remaining %= 10000000;
    }

    const lakhs = Math.floor(remaining / 100000);
    if (lakhs > 0) {
      result += convertHundreds(lakhs) + 'Lakh ';
      remaining %= 100000;
    }

    const thousandsNum = Math.floor(remaining / 1000);
    if (thousandsNum > 0) {
      result += convertHundreds(thousandsNum) + 'Thousand ';
      remaining %= 1000;
    }

    if (remaining > 0) {
      result += convertHundreds(remaining);
    }

    return result.trim() + ' Only';
  };

  const fetchInvoiceData = async () => {
    if (!invoiceNo) {
      toast.error('Invoice number is required');
      navigate(-1);
      return;
    }

    try {
      setLoading(true);
      const response: any =
        await API_SERVICES.InvoiceService.getSalesInvoiceBills({
          invoice_no: invoiceNo,
        });

      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const invoices = response.data.data.invoices || [];
        const invoice =
          invoices.find((inv: any) => inv.invoice_no === invoiceNo) ||
          invoices[0];

        if (invoice && invoice.invoice_no) {
          setInvoiceData(invoice);
        } else {
          toast.error('Invoice not found');
          navigate(-1);
        }
      } else {
        toast.error('Failed to load invoice');
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch invoice data');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceNo]);

  if (loading) {
    return <Loader />;
  }

  if (!invoiceData) {
    return null;
  }

  const companyData = {
    address1: invoiceData.branch_address || '',
    address2: '',
    city: invoiceData.branch_district_name || '',
    state: `${invoiceData.branch_state_name || ''} - ${invoiceData.branch_pincode || ''}`,
    mobile: invoiceData.branch_mobile_number || '',
    gstin: invoiceData.branch_gst_no || '',
  };

  const supplierData = {
    name: `Mr./Ms. ${invoiceData.customer_name || ''}`,
    address1: invoiceData.customer_address || '',
    address2: '',
    city: `${invoiceData.customer_district_name || ''} - ${invoiceData.customer_pincode || ''}`,
    mobile: invoiceData.customer_mobile_number || '',
    gst: invoiceData.customer_pan_no || '',
  };

  const isSameState =
    invoiceData.customer_state_name === invoiceData.branch_state_name;

  const customerState = isSameState ? 'Tamil Nadu' : 'Different State';

  const grnDetails = {
    date: invoiceData.invoice_time
      ? `${formatDate(invoiceData.invoice_date)} ${invoiceData.invoice_time}`
      : formatDate(invoiceData.invoice_date),
    grnNo: invoiceData.invoice_no || '',
    refNo: invoiceData.branch_name || '',
  };

  const grnItems = (invoiceData.invoice_items || []).map(
    (item: any, index: number) => ({
      id: String(item.id || index + 1),
      material_type: '',
      category: '',
      sub_category: '',
      description: item.product_name_snapshot || '',
      purity: '',
      ordered_weight: '',
      received_weight: '',
      refNo: item.hsn_code || '',
      quantity: String(item.quantity || ''),
      gross_weight: item.gross_weight ? String(item.gross_weight) : '',
      net_weight: item.net_weight ? String(item.net_weight) : '',
      rate: item.rate ? formatCurrency(item.rate) : '',
      amount: item.amount ? formatCurrency(item.amount) : '',
    })
  );

  const subtotalAmount = parseFloat(invoiceData.subtotal_amount || '0');
  const discountAmount = parseFloat(invoiceData.discount_amount || '0');

  const cgstAmountFromAPI = parseFloat(invoiceData.cgst_amount || '0');
  const sgstAmountFromAPI = parseFloat(invoiceData.sgst_amount || '0');

  const igstAmount = isSameState ? 0 : cgstAmountFromAPI + sgstAmountFromAPI;
  const cgstPercentNum = parseFloat(invoiceData.cgst_percent || '0');
  const sgstPercentNum = parseFloat(invoiceData.sgst_percent || '0');
  const calculatedIgstPercent = cgstPercentNum + sgstPercentNum;
  const igstPercent = isSameState
    ? '0'
    : calculatedIgstPercent > 0
      ? String(calculatedIgstPercent)
      : '3';

  const totalAmount = parseFloat(invoiceData.total_amount || '0');

  const cgstAmount = cgstAmountFromAPI;
  const sgstAmount = sgstAmountFromAPI;

  const formatPercentage = (
    percent: string | number | null | undefined
  ): string => {
    if (!percent) return '0%';
    const num = typeof percent === 'string' ? parseFloat(percent) : percent;
    if (isNaN(num)) return '0%';
    return `${parseFloat(num.toFixed(1))}%`;
  };

  const summary = {
    inWords: invoiceData.amount_in_words || numberToWords(totalAmount),
    subTotal: formatCurrency(subtotalAmount),
    sgstPercentage: isSameState
      ? formatPercentage(invoiceData.sgst_percent)
      : formatPercentage(igstPercent),
    sgstAmount: isSameState
      ? formatCurrency(sgstAmount)
      : formatCurrency(igstAmount),
    cgstPercentage: formatPercentage(invoiceData.cgst_percent),
    cgstAmount: formatCurrency(cgstAmount),
    discountPercentage: (() => {
      if (invoiceData.discount_percent) {
        return formatPercentage(invoiceData.discount_percent);
      }
      if (
        invoiceData.discount_type === 'Percentage' &&
        invoiceData.discount_amount &&
        subtotalAmount > 0
      ) {
        const calculatedPercent = (discountAmount / subtotalAmount) * 100;
        return formatPercentage(calculatedPercent);
      }
      if (
        invoiceData.discount_type === 'Fixed' &&
        invoiceData.discount_amount &&
        subtotalAmount > 0
      ) {
        const calculatedPercent = (discountAmount / subtotalAmount) * 100;
        return formatPercentage(calculatedPercent);
      }
      return '0%';
    })(),
    discountAmount: formatCurrency(discountAmount),
    totalAmount: formatCurrency(totalAmount),
    totalReceivedWeight: '',
    totalOrderedWeight: '',
    totalQuantity: String(
      invoiceData.total_quantity || invoiceData.total_items_quantity || '0'
    ),
    totalGrossWeight: '',
    totalNetWeight: '',
  };

  const remarks = '';

  const paymentDetailsArray = invoiceData.payment_details || [];

  let cardAmount = 0;
  let cashAmount = 0;
  let upiAmount = 0;
  const transactionIds: string[] = [];

  paymentDetailsArray.forEach((payment: any) => {
    const amount = parseFloat(payment.amount_received || '0');
    const paymentMode = (payment.payment_mode || '').toLowerCase();

    if (paymentMode === 'card') {
      cardAmount += amount;
    } else if (paymentMode === 'cash') {
      cashAmount += amount;
    } else if (paymentMode === 'upi') {
      upiAmount += amount;
    }

    const transactionId = payment.transaction_id || payment.transactionId;
    if (
      transactionId !== null &&
      transactionId !== undefined &&
      String(transactionId).trim() !== ''
    ) {
      transactionIds.push(String(transactionId).trim());
    }
  });

  const transactionNo =
    transactionIds.length > 0 ? transactionIds.join(', ') : '';

  const hasPaymentData = true;

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
          // backgroundColor: '#471923',
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
          style={{
            color: '#000000',
            fontSize: '18px',
            fontWeight: 600,
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
            <DialogDownloadIcon />
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
            <DialogPrintIcon />
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
            <DialogCloseIcon />
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
        showPaymentDetails={hasPaymentData}
        cardAmount={cardAmount}
        cashAmount={cashAmount}
        upiAmount={upiAmount}
        transactionNo={transactionNo}
        state={customerState}
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
        headerOrder={[
          'sno',
          'refNo',
          'description',
          'quantity',
          'grossWeight',
          'netWeight',
          'rate',
          'amount',
        ]}
        columnSizes={{
          sno: 0.89,
          refNo: 1.2,
          description: 1.8,
          quantity: 1.2,
          grossWeight: 1.2,
          netWeight: 1.2,
          rate: 1.5,
          amount: 1.5,
        }}
        showQRCode={true}
        qrCodeValue={`Invoice: ${grnDetails.grnNo}\nAmount: ${summary.totalAmount}\nDate: ${grnDetails.date}`}
      />
    </Box>
  );
};

export default ViewInvoice;
