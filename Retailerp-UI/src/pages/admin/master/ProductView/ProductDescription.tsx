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
import {
  description,
  jewelleryCare,
  priceBreakup,
  productSpecifications,
  totalAmt,
} from '@constants/index';

type Props = {
  productDetail: any;
}

const ProductDescription = ({ productDetail }: Props) => {
  const theme = useTheme();
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
            {productDetail?.description}
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
              {productDetail?.product_details?.map((item: any, index: number) => (
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
                      whiteSpace: 'pre',
                    }}
                  >
                      {item.value}
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
              {priceBreakup.map((item, index) => (
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
                <TableCell>{totalAmt}</TableCell>
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

export default ProductDescription;
