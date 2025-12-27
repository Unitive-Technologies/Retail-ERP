import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid2';
import MUHButtonComponent from '@components/MUHButtonComponent';
import { cartItems as dummyCart, defaultAddresses } from '@constants/DummyData';
import { SmallClose } from '@assets/Images';

const CartPage = () => {
  const theme = useTheme();
  const [cartItems, setCartItems] = useState(dummyCart);

  const handleIncrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const discount = 0;
  const deliveryFee = 0;
  const grandTotal = subTotal - discount + deliveryFee;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Section - My Cart */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{ borderRight: `1px solid ${theme.Colors.black}`, p: 2 }}
        >
          <Typography
            style={{
              fontWeight: 600,
              marginBottom: 2,
              borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
              width: 'fit-content',
              paddingBottom: 0.5,
              fontFamily: 'Roboto Slab',
              fontSize: '20px',
            }}
          >
            My Cart
          </Typography>

          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
              <Box
                key={cartItem.id}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #E1E1E1',
                  p: 2,
                  position: 'relative',
                  mt: 2,
                }}
              >
                {/* Remove */}
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    bgcolor: '#E6E6E6',
                  }}
                  onClick={() => handleRemove(cartItem.id)}
                >
                  <SmallClose />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    image={cartItem.image}
                    alt={cartItem.name}
                    sx={{
                      height: 120,
                      width: 130,
                      borderRadius: '4px',
                      objectFit: 'cover',
                      mr: 2,
                    }}
                  />

                  {/* Details */}
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: '18px',
                        fontFamily: 'Roboto Slab',
                        marginBottom: 1,
                      }}
                    >
                      {cartItem.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                        width: '100%',
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 400,
                          fontSize: '18px',
                          fontFamily: 'Roboto Slab',
                          color: '#5B2028',
                        }}
                      >
                        ₹{cartItem.price.toLocaleString()}
                      </Typography>

                      {/* Weight */}
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          fontSize: '14px',
                          color: theme.Colors.black,
                          fontFamily: 'Roboto Slab',
                          fontWeight: 400,
                          display: 'block',
                        }}
                      >
                        Weight: {cartItem.weight}
                      </Typography>
                    </Box>

                    {/* Qty controls */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        width: '80px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 400,
                          mr: 1,
                          fontSize: '14px',
                          color: theme.Colors.black,
                          fontFamily: 'Roboto Slab',
                        }}
                      >
                        Qty
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E1E1E1',

                          borderRadius: '8px',
                          padding: '6px',
                          backgroundColor: '#fff',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleDecrease(cartItem.id)}
                          sx={{
                            backgroundColor: theme.Colors.primaryDarkEnd,
                            borderRadius: '50%',
                            width: 15,
                            height: 15,
                            minWidth: 'unset',
                          }}
                        >
                          <RemoveIcon
                            sx={{ fontSize: '12px', color: theme.Colors.whitePrimary }}
                          />
                        </IconButton>
                        <Typography
                          sx={{
                            mx: 1,
                            fontSize: '14px',
                            fontWeight: 400,
                            fontFamily: 'Roboto Slab',
                            minWidth: '20px',
                            textAlign: 'center',
                          }}
                        >
                          {cartItem.qty}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleIncrease(cartItem.id)}
                          sx={{
                            backgroundColor: theme.Colors.primaryDarkEnd,
                            borderRadius: '50%',
                            width: 15,
                            height: 15,
                            minWidth: 'unset',
                            '&:hover': {
                              backgroundColor: '#D0D0D0',
                            },
                          }}
                        >
                          <AddIcon sx={{ fontSize: '12px', color: theme.Colors.whitePrimary }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>Your cart is empty.</Typography>
          )}
        </Grid>

        {/* Right Section - Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            style={{
              fontWeight: 500,
              color: theme.Colors.black,
              fontFamily: 'Roboto Slab',
              fontSize: '20px',
              marginBottom: 2,
            }}
          >
            Order Summary
          </Typography>

          <Box sx={{ pt: 2 }}>
            {/* Address */}
            <Box
              sx={{
                border: '1px solid #e1e1e1',
                borderRadius: '8px',
                p: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  style={{
                    fontWeight: 500,
                    color: theme.Colors.primaryDarkEnd,
                    fontSize: '16px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Delivery To
                </Typography>
                <MUHButtonComponent
                  buttonText="Change"
                  buttonStyle={{
                    borderRadius: '8px',
                    fontFamily: 'Roboto Slab',
                  }}
                  bgColor="transparent"
                  buttonTextColor="#64232f"
                  btnWidth="70px"
                  btnHeight={30}
                  buttonFontSize={14}
                  border="1px solid #64232f"
                  buttonFontWeight={400}
                  padding={0}
                  onClick={() => console.log('Change Address')}
                />
              </Box>
              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 400,
                  color: theme.Colors.black,
                  fontSize: '16px',
                  fontFamily: 'Roboto Slab',
                  lineHeight: 1.9,
                }}
              >
                {defaultAddresses[0].name}
                <br />
                {defaultAddresses[0].addressLine1}
                <br />
                {defaultAddresses[0].addressLine2}
                <br />
                {defaultAddresses[0].state} {defaultAddresses[0].pin}
              </Typography>
            </Box>

            {/* Summary */}
            <Box
              sx={{
                border: '1px solid #e1e1e1',
                padding: 2,
                borderRadius: '8px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <Typography
                  style={{
                    fontWeight: 400,
                    color: '#303030',
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Sub Total
                </Typography>
                <Typography
                  style={{
                    fontWeight: 400,
                    color: theme.Colors.black,
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  ₹{subTotal.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <Typography
                  style={{
                    fontWeight: 400,
                    color: '#303030',
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Discount
                </Typography>
                <Typography
                  style={{
                    fontWeight: 400,
                    color: theme.Colors.black,
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  ₹{discount}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <Typography
                  style={{
                    fontWeight: 400,
                    color: '#303030',
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Delivery Fee
                </Typography>
                <Typography
                  style={{
                    fontWeight: 400,
                    color: '#029A11',
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  FREE
                </Typography>
              </Box>
              {/* <Divider sx={{ my: 1 }} /> */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  color: '#5e0000',
                  mt: 1,
                }}
              >
                <Typography
                  style={{
                    fontWeight: 400,
                    color: theme.Colors.primaryDarkEnd,
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Grand Total
                </Typography>
                <Typography
                  style={{
                    fontWeight: 400,
                    color: theme.Colors.primaryDarkEnd,
                    fontSize: '18px',
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  ₹{grandTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Proceed to Payment */}
            <Box sx={{ mt: 2 }}>
              <MUHButtonComponent
                buttonText="Proceed to Payment"
                bgColor="#64232f"
                buttonTextColor={theme.Colors.whitePrimary}
                btnWidth="100%"
                buttonStyle={{
                  borderRadius: '8px',
                  fontFamily: 'Roboto Slab',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
                padding="10px 16px"
                onClick={() => console.log('Proceeding to payment')}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
