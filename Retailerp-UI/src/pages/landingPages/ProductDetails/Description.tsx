import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  ListItem,
  List,
  ListItemText,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatCurrency, jewelleryCare } from '@constants/index';
import { ProductItemDetails } from 'response';

interface DescriptionProps {
  productItemsDetails: ProductItemDetails;
  purity: string;
  materialType: string;
  description: string;
}

const Description = ({
  productItemsDetails,
  purity,
  materialType,
  description,
}: DescriptionProps) => {
  const theme = useTheme();
  const productDetails = [
    { label: 'Purity', value: purity },
    { label: 'Grs Weight', value: productItemsDetails?.gross_weight || 0 },
    { label: 'Net Weight', value: productItemsDetails?.net_weight || 0 },
    { label: 'Stone Weight', value: productItemsDetails?.stone_weight || 0 },
    {
      label: 'Dimensions',
      value: productItemsDetails?.measurement_details || 0,
    },
  ];
  const priceBreakupData = [
    {
      description: materialType,
      rate: formatCurrency(productItemsDetails?.price_details?.material_rate_per_gram) || 0,
      amount: formatCurrency(productItemsDetails?.price_details?.material_contribution) || 0,
    },
    { description: 'Making Charge', rate:  formatCurrency(productItemsDetails?.making_charge), amount: formatCurrency(productItemsDetails?.price_details?.making_charge) },
    { description: 'Wastage', rate:  '-', amount: formatCurrency(productItemsDetails?.price_details?.wastage) },
    { description: 'Tax', rate: '-', amount: '-' },
  ];

  // Calculate total price by summing original numeric values before formatting
  const totalPrice = [
    productItemsDetails?.price_details?.material_contribution || 0,
    productItemsDetails?.price_details?.making_charge || 0,
    productItemsDetails?.price_details?.wastage || 0

  ].reduce((sum, amount) => sum + (typeof amount === 'string' ? parseFloat(amount) || 0 : amount), 0);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid #D2D2D2',
        overflow: 'hidden',
      }}
    >
      {/* Description */}
      <Accordion
        defaultExpanded
        sx={{
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          borderBottom: '1px solid #D2D2D2',
          borderRadius: 0,
          '&:first-of-type': {
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiTypography-root': {
              fontFamily: 'Roboto Slab',
              fontSize: theme.MetricsSizes.small_xxx,

              fontWeight: theme.fontWeight.regular,
              color: theme.Colors.black,
            },
            '&.Mui-expanded .MuiTypography-root': {
              fontWeight: theme.fontWeight.mediumBold,
            },
          }}
        >
          <Typography>Description</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Typography
            sx={{
              fontFamily: 'Roboto Slab',
              fontWeight: 400,
              fontSize: '14px',
              color: '#000',
            }}
          >
            {description}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Product Details */}
      <Accordion
        defaultExpanded
        sx={{
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          borderBottom: '1px solid #D2D2D2',
          borderRadius: 0,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiTypography-root': {
              fontFamily: 'Roboto Slab',
              fontSize: theme.MetricsSizes.small_xxx,

              fontWeight: theme.fontWeight.regular,
              color: theme.Colors.black,
            },
            '&.Mui-expanded .MuiTypography-root': {
              fontWeight: theme.fontWeight.mediumBold,
            },
          }}
        >
          <Typography>Product Details</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails sx={{ padding: 2 }}>
          <Table
            sx={{
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #E9E9E9',
              borderCollapse: 'separate',
              borderSpacing: 0,
              '& .MuiTableCell-root': {
                padding: '12px 16px',
                border: 'none',
              },
            }}
          >
            <TableBody>
              {productDetails.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.Colors.whitePure,
                    },
                    '&:not(:last-child) td': {
                      borderBottom: '1px solid #ddd !important',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: theme.Colors.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      width: '35%',
                      fontFamily: 'Roboto Slab',
                      borderRight: '1px solid #E9E9E9 !important',
                    }}
                  >
                    {item.label}
                  </TableCell>
                  {/* Right Column (Values) */}
                  <TableCell
                    sx={{
                      color: theme.Colors.black,
                      fontWeight: 400,
                      fontSize: '14px',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    {item.label === 'Dimensions' ? (
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        {item.value &&
                        Array.isArray(item.value) &&
                        item.value.length > 0 ? (
                          item.value.map((dimension, dimIndex) => (
                            <Typography key={dimIndex}>
                              {dimension.label_name}{' '}
                              {dimension.label_name ? ' : ' : '-'}
                              {dimension.value} {dimension.measurement_type}
                            </Typography>
                          ))
                        ) : (
                          <Typography>Dimensions not available</Typography>
                        )}
                      </Box>
                    ) : (
                      item.value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      {/* Price Breakup */}
      <Accordion
        defaultExpanded
        sx={{
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          borderBottom: '1px solid #D2D2D2',
          borderRadius: 0,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiTypography-root': {
              fontFamily: 'Roboto Slab',
              fontSize: theme.MetricsSizes.small_xxx,

              fontWeight: theme.fontWeight.regular,
              color: theme.Colors.black,
            },
            '&.Mui-expanded .MuiTypography-root': {
              fontWeight: theme.fontWeight.mediumBold,
            },
          }}
        >
          <Typography>Price Breakup</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails sx={{ p: 2 }}>
          <Table
            sx={{
              width: '100%',
              border: '1px solid #D2D2D2',
              borderCollapse: 'separate',
              borderSpacing: 0,
              '& .MuiTableCell-root': {
                padding: '12px 16px',
                border: 'none',
              },
            }}
          >
            <TableBody>
              {/* Header Row */}
              <TableRow
                sx={{
                  '& td': {
                    fontWeight: 500,
                    fontSize: '14px',
                    color: theme.Colors.primary,
                    fontFamily: 'Roboto Slab',
                    borderBottom: '1px solid #ddd !important',
                  },
                  '& td:not(:last-child)': {
                    borderRight: '1px solid #ddd !important',
                  },
                }}
              >
                <TableCell>Description</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>

              {/* Dynamic Rows */}
              {priceBreakupData.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '& td': {
                      fontWeight: 400,
                      fontSize: '14px',
                      color: theme.Colors.black,
                      fontFamily: 'Roboto Slab',
                      borderBottom: '1px solid #ddd !important',
                    },
                    '& td:not(:last-child)': {
                      borderRight: '1px solid #ddd !important',
                    },
                  }}
                >
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow
                sx={{
                  backgroundColor: '#fafafa',
                  '& td': {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    // borderTop: '2px solid #D2D2D2 !important',
                  },
                  '& td:not(:last-child)': {
                    borderRight: '1px solid #D2D2D2 !important',
                  },
                }}
              >
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>
                  {formatCurrency(totalPrice)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
      {/* Jewellery Care */}
      <Accordion
        defaultExpanded
        sx={{
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          borderRadius: 0,
          '&:last-of-type': {
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiTypography-root': {
              fontFamily: 'Roboto Slab',
              fontSize: theme.MetricsSizes.small_xxx,

              fontWeight: theme.fontWeight.regular,
              color: theme.Colors.black,
            },
            '&.Mui-expanded .MuiTypography-root': {
              fontWeight: theme.fontWeight.mediumBold,
            },
          }}
        >
          <Typography>Jewellery Care</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <List sx={{ listStyleType: 'disc', pl: 2 }}>
            {jewelleryCare.map((item, index) => (
              <ListItem key={index} sx={{ display: 'list-item', py: 0 }}>
                <ListItemText
                  sx={{
                    fontWeight: 400,
                    fontSize: '14px',
                    color: theme.Colors.black,
                    fontFamily: 'Roboto Slab',
                  }}
                  primary={item}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Description;
