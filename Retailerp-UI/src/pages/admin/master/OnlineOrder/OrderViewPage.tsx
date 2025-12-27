import  { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Grid from '@mui/material/Grid2';
import { NewOrderIcon, OrderTrack2Icon, OrderTrackIcon } from '@assets/Images';
import { labelStyle } from '@components/CommonStyles';
import PageHeader from '@components/PageHeader';

const OrderViewPage = () => {
  const orderData = {
    orderNo: 'ORD 18Q24-25',
    date: '22/09/2025',
    status: 'New Order',
    customer: {
      name: 'Kishore Kumar',
      email: 'kishorekumar@gmail.com',
      phone: '9876543210',
      billing:
        '21A Anna Nagar, \n1st Cross Street,\nNear Reliance Mall\nChennai\n600040',
      shipping:
        '21/A,Anna Nagar\n 1 st Cross Street\nNear Reliance Mall\nChennai\n620001',
    },
    summary: {
      subtotal: 1800,
      sgst: 27,
      cgst: 27,
      discount: 0,
      total: 1854,
    },
    payment: {
      txnId: '#LM654123652365',
      mode: 'UPI',
      date: '19/09/2025',
      amount: 1854,
    },
    products: [
      {
        id: 1,
        name: 'Elegant Silver Stud',
        sku: 'SVID_SPLUSK-UP',
        qty: 1,
        rate: 600,
        amount: 600,
        branch: 'KPMS Branch',
        image:
          'https://images.unsplash.com/photo-1612225869486-1a9a8a44c4f9?auto=format&fit=crop&w=400&q=80', // Pendant necklace
      },
      {
        id: 2,
        name: 'Silver Envelope',
        sku: 'WED_WEA_HYA_WAY',
        qty: 1,
        rate: 950,
        amount: 950,
        branch: 'small Branch',
        image: 'https://via.placeholder.com/60',
      },
    ],
  };

  const statusSteps = [
    {
      label: 'Order Received (ODG 18Q24-25)',
      description: 'Order have been placed successfully',
      icon: <OrderTrackIcon />,
      completed: true,
      date: '19/09/2025 - Friday\n12:45 PM',
    },
    {
      label: 'Payment Completed Successfully',
      description: 'Amount Paid via Google Pay Ref No.: #BVLU255664645',
      icon: <OrderTrackIcon />,
      completed: true,
      date: '19/09/2025 - Friday\n12:45 PM',
    },
    {
      label: 'Invoice Generated Successfully',
      description: 'Invoice was sent to customer email ID',
      icon: <OrderTrackIcon />,
      completed: true,
      date: '19/09/2025 - Friday\n12:46 PM',
    },
    {
      label: 'Item Shipped Successfully',
      description: '',
      icon: <OrderTrack2Icon />,
      completed: false,
      date: '',
    },
    {
      label: 'Item Delivered Successfully',
      description: '',
      icon: <OrderTrack2Icon />,
      completed: false,
      date: '',
    },
  ];
  const labelStyle = {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
    mb: 0.5,
  };
  const labelStyle2 = {
    fontSize: 16,
    fontWeight: 500,
    color: '#6D2E3D',
    mb: 0.5,
  };
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);

  const toggleProductExpand = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isProductExpanded = (productId: number) => {
    return expandedProducts.includes(productId);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Header */}
      <PageHeader
        title={'Order Details'}
        showDownloadBtn={false}
        showCreateBtn={false}
        showlistBtn={true}
         titleStyle={{ color: '#000000' }}
        // navigateUrl="/admin/master/employee"
      />
      {/* Left Section - Products */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: '#fff' }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontSize={16} fontWeight={600} color="#6D2E3D">
                {orderData.orderNo}
              </Typography>
              <Typography style={labelStyle}>{orderData.date}</Typography>
            </Box>
            <Box
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: '30px',
                backgroundColor: '#E9E9E9',
                color: '#000',
                fontWeight: 500,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <NewOrderIcon />
              {orderData.status}
            </Box>
          </Box>
        </Paper>
        {orderData.products.map((prod, index) => (
          <Paper
            key={prod.id}
            sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#fff' }}
          >
            {/* Product Details Table */}
            <Box sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                #{index + 1}
              </Typography>

              <Box
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {/* Table Header */}
                <Box
                  style={{
                    display: 'flex',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box style={{ flex: 3, padding: 8 }}>
                    <Typography fontSize={14} fontWeight={600}>
                      Product Description
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={600}>
                      Quantity
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={600}>
                      Rate
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={600}>
                      Amount
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={600}>
                      Branch
                    </Typography>
                  </Box>
                </Box>

                {/* Table Row */}
                <Box style={{ display: 'flex' }}>
                  <Box
                    style={{
                      flex: 3,
                      padding: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px dashed #2196f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        fontSize={16}
                        fontWeight={600}
                        color="#000000"
                      >
                        {prod.name}
                      </Typography>
                      <Typography
                        fontSize={12}
                        fontWeight={600}
                        color="#000000"
                      >
                        {prod.sku}
                      </Typography>
                    </Box>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography variant="body2">{prod.qty}</Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={400}>
                      ₹{prod.rate}.00
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={400}>
                      ₹{prod.amount}.00
                    </Typography>
                  </Box>
                  <Box style={{ flex: 1, padding: 8, textAlign: 'center' }}>
                    <Typography fontSize={14} fontWeight={400}>
                      {prod.branch}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Order Status Dropdown */}
            <Box>
              <Box
                display="flex"
                alignItems="center"
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  marginBottom: 8,
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight={500}
                  style={{ marginRight: 16 }}
                >
                  Order Status
                </Typography>
                {/* Right-aligned actions: pill + expand */}
                <Box
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {/* New Order pill */}
                  <Box
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 28,
                      padding: '4px 12px',
                      gap: 6,
                      borderRadius: 30,
                      backgroundColor: '#E9E9E9',
                      color: '#000',
                      fontWeight: 500,
                      fontSize: 13,
                      boxSizing: 'border-box',
                      border: 'none',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    <NewOrderIcon />
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      New Order
                    </span>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleProductExpand(prod.id)}
                  >
                    {isProductExpanded(prod.id) ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>

              {/* Order Status Timeline with Connector Design */}
              <Collapse in={isProductExpanded(prod.id)}>
                <Box style={{ marginTop: 16, paddingLeft: 8 }}>
                  {statusSteps.map((step, idx) => (
                    <Box
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: 20,
                        position: 'relative',
                      }}
                    >
                      {/* Connector */}
                      {idx !== statusSteps.length - 1 && (
                        <Box
                          style={{
                            position: 'absolute',
                            left: 13,
                            top: 34,
                            bottom: -44,
                            width: 5,
                            backgroundColor: step.completed
                              ? '#6D2E3D'
                              : '#e0e0e0',
                          }}
                        />
                      )}
                      {/* Icon */}
                      <Box
                        style={{
                          borderRadius: '50%',
                          backgroundColor: step.completed
                            ? '#6D2E3D'
                            : '#cccccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: step.completed ? '#fff' : '#cccccc',
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      >
                        {step.icon}
                      </Box>
                      {/* Content and Date */}
                      <Box
                        style={{
                          marginLeft: 16,
                          flex: 1,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box>
                          <Typography
                            fontSize={16}
                            fontWeight={400}
                            color={
                              step.completed ? 'text.primary' : 'text.secondary'
                            }
                          >
                            {step.label}
                          </Typography>
                          {step.description && (
                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color="text.secondary"
                              style={{ marginTop: 4 }}
                            >
                              {step.description}
                            </Typography>
                          )}
                        </Box>
                        {step.date && (
                          <Box style={{ textAlign: 'right', minWidth: 140 }}>
                            {step.date.split('\n').map((line, i) => (
                              <Typography
                                key={i}
                                variant="body2"
                                color="text.secondary"
                              >
                                {line}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </Paper>
        ))}
      </Grid>

      {/* Right Section - Customer Details, Order Summary, Payment Details */}
      <Grid size={{ xs: 12, md: 4 }}>
        {/* Customer Details */}
        <Paper
          style={{
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
            backgroundColor: '#fff',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            fontSize={16}
            fontWeight={600}
            color="#000000"
            
            gutterBottom
          >
            Customer Details
          </Typography>
          <Divider sx={{ my: 1 }} />

          {/* Name */}
          <Box style={{ marginBottom: 16 }}>
            <Typography style={labelStyle}>Name</Typography>
            <Typography style={labelStyle2}>
              {orderData.customer.name}
            </Typography>
          </Box>

          {/* Mobile Number */}
          <Box style={{ marginBottom: 16 }}>
            <Typography style={labelStyle}>Mobile Number</Typography>
            <Typography style={labelStyle2}>
              {orderData.customer.phone}
            </Typography>
          </Box>

          {/* Email ID */}
          <Box style={{ marginBottom: 16 }}>
            <Typography style={labelStyle}>Email ID</Typography>
            <Typography style={labelStyle2}>
              {orderData.customer.email}
            </Typography>
          </Box>

          {/* Billing Address */}
          <Box style={{ marginBottom: 16 }}>
            <Typography style={labelStyle}>Billing Address</Typography>
            <Typography style={labelStyle2}>
              {orderData.customer.billing}
            </Typography>
          </Box>

          {/* Shipping Address */}
          <Box>
            <Typography style={labelStyle}>Shipping Address</Typography>
            <Typography style={labelStyle2}>
              {orderData.customer.shipping}
            </Typography>
          </Box>
        </Paper>

        {/* Order Summary */}
        <Paper
          style={{
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
            backgroundColor: '#fff',
          }}
        >
          <Typography fontSize={16} fontWeight={600} gutterBottom>
            Order Summary
          </Typography>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Typography style={labelStyle}>Sub Total</Typography>
            <Typography style={labelStyle2}>
              ₹{orderData.summary.subtotal}.00
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Typography style={labelStyle}>SGST (1.5%)</Typography>
            <Typography style={labelStyle2}>
              ₹{orderData.summary.sgst}.00
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Typography style={labelStyle}>CGST (1.5%)</Typography>
            <Typography style={labelStyle2}>
              ₹{orderData.summary.cgst}.00
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Typography style={labelStyle}>Discount</Typography>
            <Typography style={labelStyle2}>
              ₹{orderData.summary.discount}.00
            </Typography>
          </Box>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontSize={14} fontWeight={600}>Total Amount</Typography>
            <Typography fontSize={16} fontWeight={500}>
              ₹{orderData.summary.total}.00
            </Typography>
          </Box>

          <Button
            startIcon={<DownloadIcon />}
            fullWidth
            variant="outlined"
            style={{
              marginTop: 16,
              borderRadius: 12,
              borderColor: '#6D2E3D',
              color: '#6D2E3D',
              fontWeight: 500,
              fontSize: 16,
              textTransform: 'none',
              paddingTop: 12,
              paddingBottom: 12,
              borderWidth: 2,
              // '&:hover': {
              //   borderColor: '#6D2E3D',
              //   backgroundColor: '#f9f6f7',
              // },
            }}
          >
            Download Invoice
          </Button>
        </Paper>

        {/* Payment Details */}
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#fff' }}>
          <Typography style={labelStyle2} gutterBottom>
            Payment Details
          </Typography>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />

          <Box style={{ marginBottom: 16 }}>
            <Typography fontSize={14} fontWeight={400}>
              Transaction ID
            </Typography>
            <Typography style={labelStyle2}>
              {orderData.payment.txnId}
            </Typography>
          </Box>

          <Box style={{ marginBottom: 16 }}>
            <Typography fontSize={14} fontWeight={400}>
              Payment Mode
            </Typography>
            <Typography style={labelStyle2}>
              {orderData.payment.mode}
            </Typography>
          </Box>

          <Box style={{ marginBottom: 16 }}>
            <Typography fontSize={14} fontWeight={400}>
              Payment Date
            </Typography>
            <Typography style={labelStyle2}>
              {orderData.payment.date}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} fontWeight={400}>
              Amount Paid
            </Typography>
            <Typography style={labelStyle2}>
              ₹{orderData.payment.amount}.00
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderViewPage;
