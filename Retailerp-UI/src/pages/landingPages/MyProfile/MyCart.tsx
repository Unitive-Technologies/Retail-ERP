import { useState, useEffect } from 'react';
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
import { SmallClose } from '@assets/Images';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import { OrderService } from '@services/OrderService';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { ProductService } from '@services/ProductService';
import { formatAmountCurrency } from '@constants/AmountFormats';
import { WishlistOrCartItem } from 'response';

const CartPage = () => {
  const theme = useTheme();
  const [cartItems, setCartItems] = useState<WishlistOrCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response: any = await OnlineOrdersService.getWishlistOrCart({
          type: 2, // 2 for cart
        });

        if (response?.data?.data?.items) {
          console.log(response.data.data.items);

          setCartItems(response.data.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response: any = await OrderService.getCustomerAddress();

        if (response?.data?.data?.addresses) {
          const addressesWithNames = await Promise.all(
            response.data.data.addresses.map(async (address: any) => {
              try {
                // Fetch state name
                const stateResponse: any =
                  await DropDownServiceAll.getAllStates();
                const stateData = stateResponse?.data?.data?.states;
                const matchedState = stateData?.find(
                  (state: any) => state.id === address.state_id
                );
                const stateName =
                  matchedState?.state_name || `State ${address.state_id}`;

                // Fetch district name
                const districtResponse: any =
                  await DropDownServiceAll.getAllDistricts();
                const districtData = districtResponse?.data?.data?.districts;
                let districtName = address.district_id; // Declare outside if block

                if (districtData && districtData.length > 0) {
                  // Try both string and number comparison
                  const matchedDistrict = districtData?.find(
                    (district: any) =>
                      district.id === address.district_id ||
                      district.id === Number(address.district_id) ||
                      String(district.id) === String(address.district_id)
                  );
                  districtName =
                    matchedDistrict?.district_name || address.district_id;
                } else {
                  console.log('No district data found');
                  console.log('Using fallback district name:', districtName);
                }

                return {
                  ...address,
                  state_name: stateName,
                  district_name: districtName,
                };
              } catch (error) {
                console.error('Error fetching state/district:', error);
                return address;
              }
            })
          );
          setAddresses(addressesWithNames);
        } else {
          console.log('No addresses found');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchCart();
    fetchAddresses();
  }, []);

  const handleIncrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const handleRemove = async (id: number) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    if (!itemToRemove) {
      console.error('Item not found for removal');
      return;
    }

    try {
      await OnlineOrdersService.updateAddToCart(
        itemToRemove.product_id,
        0,
        false,
        itemToRemove.product_item_id,
        'Item removed from cart successfully'
      );

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const subTotal = cartItems.reduce(
    (sum, item) =>
      sum + (parseFloat(item.estimated_price) || 0) * (item.quantity || 1),
    0
  );
  const discount = 0;
  const deliveryFee = 0;
  const grandTotal = subTotal - discount + deliveryFee;

  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }

    try {
      // Fetch product details for each cart item
      const orderItems = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productResponse: any = await ProductService.getProductById(
              Number(item.product_id)
            );

            if (!productResponse?.data?.data?.product) {
              return null;
            }

            const product = productResponse.data.data.product;
            const itemDetails = productResponse.data.data.item_details;
            const selectedItemDetail = itemDetails?.find(
              (detail: any) => detail.id === item.product_item_id
            );

            if (!selectedItemDetail || selectedItemDetail.quantity <= 0) {
              return null; // Filter out out of stock items
            }

            return {
              product_id: item.product_id,
              product_item_id: item.product_item_id,
              quantity: item.quantity || 1,
              image_url: item.thumbnail_image || product.image_urls?.[0] || '',
              product_name: product.product_name || '',
              sku_id: item.sku_id || product.sku_id || '',
              purity: product.purity || '99.900',
              gross_weight: product.gross_weight || 0,
              net_weight: item.net_weight || product.net_weight || 0,
              stone_weight: product.stone_weight || 0,
              rate:
                Number(item.estimated_price) ||
                Number(product.selling_price) ||
                0,
              making_charge: product.making_charge || 0,
              wastage: product.wastage || 0,
              measurement_details: product.measurement_details || [],
              selling_price:
                Number(item.estimated_price) ||
                Number(product.selling_price) ||
                0,
            };
          } catch (error) {
            console.error(
              'Error fetching product details for item:',
              item.product_id,
              error
            );
            return null;
          }
        })
      );

      // Filter out null items (failed to fetch or out of stock)
      const validOrderItems = orderItems.filter((item) => item !== null);

      if (validOrderItems.length === 0) {
        alert(
          'Some items in your cart are out of stock. Please remove them or select different items.'
        );
        return;
      }

      // Check if any items were filtered out due to being out of stock
      if (validOrderItems.length < cartItems.length) {
        const outOfStockCount = cartItems.length - validOrderItems.length;
        alert(
          `${outOfStockCount} item(s) in your cart are out of stock and have been removed from this order.`
        );
      }

      // Create order payload
      const orderPayload = {
        customer_id: 1,
        discount_amount: 0,
        order_date: new Date().toISOString().split('T')[0],
        items: validOrderItems,
      };

      // Call createOrder API
      const response: any = await OrderService.createOrder(orderPayload);
      console.log('Create order response:', response);

      if (response?.data?.statusCode === 201 || response?.data?.success) {
        alert('Order created successfully! Proceeding to payment...');

        // Remove ordered items from cart
        try {
          await Promise.all(
            validOrderItems.map(async (item: any) => {
              await OnlineOrdersService.updateAddToCart(
                item.product_id,
                0,
                false,
                item.product_item_id
              );
            })
          );

          const orderedItemIds = validOrderItems.map(
            (item: any) => `${item.product_id}-${item.product_item_id}`
          );
          setCartItems((prev) =>
            prev.filter(
              (cartItem) =>
                !orderedItemIds.includes(
                  `${cartItem.product_id}-${cartItem.product_item_id}`
                )
            )
          );
        } catch (cartError) {
          console.error(
            'Error removing items from cart after order:',
            cartError
          );
        }

        // TODO: Navigate to payment page or handle payment flow
        // navigate('/payment', { state: { orderId: response.data.data.order_id } });
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    }
  };

  const defaultAddress = addresses.find(
    (address: any) => address.is_default === true
  );

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

          {!loading && cartItems.length === 0 ? (
            <Typography
              sx={{
                textAlign: 'center',
                mt: 4,
                color: 'text.secondary',
                fontFamily: 'Roboto Slab',
              }}
            >
              Your cart is empty
            </Typography>
          ) : (
            cartItems.map((cartItem) => (
              <Box
                key={`${cartItem.product_id}-${cartItem.product_item_id}`}
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
                    image={cartItem.thumbnail_image}
                    alt={cartItem.product_name}
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
                      {cartItem.product_name}
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
                        {formatAmountCurrency(cartItem.estimated_price)}
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
                        Weight: {cartItem.net_weight}
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
                            sx={{
                              fontSize: '12px',
                              color: theme.Colors.whitePrimary,
                            }}
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
                          {cartItem.quantity || 1}
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
                          <AddIcon
                            sx={{
                              fontSize: '12px',
                              color: theme.Colors.whitePrimary,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            ))
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
                {defaultAddress ? (
                  <>
                    {defaultAddress.name}
                    <br />
                    {defaultAddress.address_line}
                    <br />
                    {defaultAddress.district_name}
                    <br />
                    {defaultAddress.state_name} {defaultAddress.pin_code}
                  </>
                ) : (
                  <Typography
                    sx={{
                      textAlign: 'center',
                      mt: 4,
                      color: 'text.secondary',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    No addresses found
                  </Typography>
                )}
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
                onClick={handleProceedToPayment}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
