import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ButtonComponent,
  DialogComp,
  DualActionButton,
} from '@components/index';
import MUHLoader from '@components/MUHLoader';
import {
  CalendarIcon,
  PincodeArrowRightIcon,
  PincodeLoadingIcon,
  ShareIcon,
} from '@assets/Images';
import MUHTextInput from '@components/MUHTextInput';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

import Description from './Description';
import { isValidPinCode } from '@utils/form-util';
import { ProductService } from '@services/ProductService';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import { formatAmountCurrency, formatCurrency } from '@constants/AmountFormats';
import { ProductList } from 'response';
import { Favorite as FavoriteFilledIcon } from '@mui/icons-material';
import { FavoriteHeartIcon } from '@assets/Images';

interface StyledIconButtonProps {
  isFavorite: boolean;
}

const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 13px;
`;

const StyledImageNoRadius = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isFavorite',
})<StyledIconButtonProps>(({ theme, isFavorite }) => ({
  color: isFavorite ? '#e91e63' : '#666',
  width: 42,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'grid',
  cursor: 'pointer',
  border: '1px solid #632532',
  background: 'white',
  borderRadius: '8px',
}));

const ProductBuy: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('Wed, 16th June');
  const [product, setProduct] = useState<ProductList | null>(null);
  const [productItems, setProductItems] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Handle Add to Cart functionality
  const handleAddToCart = useCallback(async () => {
    if (!selectedItem) {
      console.error('No item selected');
      return;
    }
    console.log(selectedItem, product, 'fadfasdfdsa');

    try {
      await OnlineOrdersService.createWishlistOrAddCart({
        user_id: 0, // TODO: Get from auth context
        product_id: selectedItem.product_id || product?.id,
        product_item_id: selectedItem.id || 1,
        order_item_type: 2, // 2 for cart
        is_in_cart: true,
        is_wishlisted: selectedItem.is_wishlisted,
        quantity: 1,
        product_name: product?.product_name || '',
        sku_id: selectedItem.sku_id || product?.sku_id,
        thumbnail_image: product?.image_urls[0] || '',
        estimated_price: selectedItem.price_details?.selling_price || '0',
      });

      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  }, [selectedItem, product]);

  // Handle wishlist functionality
  const handleFavoriteClick = useCallback(async () => {
    if (!selectedItem) {
      console.error('No item selected');
      return;
    }

    try {
      const currentWishlistStatus = selectedItem?.is_wishlisted;

      let response: any;

      if (currentWishlistStatus) {
        response = await OnlineOrdersService.updateWishlistItem(
          selectedItem.product_id || 1,
          0,
          false,
          selectedItem.id
        );
      } else {
        response = await OnlineOrdersService.createWishlistOrAddCart({
          user_id: 0, // TODO: Get from auth context
          product_id: selectedItem.product_id || product?.id,
          product_item_id: selectedItem.id || 1,
          order_item_type: 1, // 1 for wishlist
          is_wishlisted: true,
          quantity: selectedItem.quantity || 1,
          product_name: product?.product_name || '',
          sku_id: selectedItem.sku_id || product?.sku_id,
          thumbnail_image: product?.image_urls[0] || '',
          estimated_price: selectedItem.price_details?.selling_price || '0',
        });
      }

      let itemData = null;
      let apiWishlistStatus = null;

      if (response?.data?.data?.item) {
        itemData = response.data.data.item;
        apiWishlistStatus = itemData.is_wishlisted;
      } else if (response?.data?.data) {
        apiWishlistStatus = response.data.data.is_wishlisted;
      }

      if (selectedItem && apiWishlistStatus !== null) {
        const updatedSelectedItem = {
          ...selectedItem,
          is_wishlisted: apiWishlistStatus,
          ...(itemData && {
            quantity: itemData.quantity,
            estimated_price: itemData.estimated_price,
          }),
        };

        setSelectedItem(updatedSelectedItem);
        setProductItems(
          (prevItems: any[]) =>
            prevItems?.map((item) =>
              item.id === selectedItem.id ? updatedSelectedItem : item
            ) || []
        );
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  }, [selectedItem, product]);

  const [openDialog, setOpenDialog] = useState(false);
  const [pincode, setPincode] = useState('606206');

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id');

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response: any = await ProductService.getProductById(
          Number(productId)
        );
        if (!response) {
          console.error('No response received from API');
          return;
        } else if (response.data.data) {
          setProduct(response.data.data.product);
          setProductItems(response.data.data.item_details);
        } else {
          console.error('No product found in response.data');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
    setOpenDialog(true);
  }, []);

  const onViewModeClick = () => {
    console.log('View mode child');
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  }, []);

  const onClickBuyNowButton = useCallback(() => {
    const selectedItem = productItems?.[0] || null;
    navigate('/home/checkout?id=' + productId, { state: { selectedItem } });
  }, [navigate, productId, productItems]);

  const renderDialogContent = () => (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: '13px',
            overflow: 'hidden',
            boxShadow: 2,
          }}
        >
          <StyledImage
            src={product?.image_urls?.[selectedImage]}
            alt={product?.product_name || 'Product'}
          />
        </Box>
      </Grid>

      <Grid
        container
        size={{ xs: 12, md: 6 }}
        // sx={{ gap: 2, overflow: 'scroll', height: '100vh' }}
        flexDirection={'row'}
      >
        {product && product.image_urls ? (
          product.image_urls.map((image: string | undefined, idx: number) => (
            <Box
              key={idx}
              sx={{
                cursor: 'pointer',
                borderRadius: '13px',
                border:
                  idx === selectedImage
                    ? '2px solid #6C2B3B'
                    : '1px solid #eee',
                boxShadow: idx === selectedImage ? 2 : 0,
                transition: 'border 0.2s',
                width: '45%',
                mx: 'auto',
                background: '#fff',
              }}
              onClick={() => handleImageClick(idx)}
            >
              <StyledImage
                src={image}
                alt={`${product?.product_name || 'Product'} ${idx + 1}`}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <Typography>No product images available</Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );

  // Process variation data at the top of the component
  const variationButtons =
    productItems
      ?.map((items: any) => {
        let variationData: { [key: string]: string } = {};
        try {
          if (items.variation) {
            variationData = JSON.parse(items.variation);
          }
        } catch (error) {
          console.error('Error parsing variation:', error);
        }

        return Object.entries(variationData).map(([, value]) => ({
          buttonText: (value as string).replace('"', ''),
          item: items,
          key: items.id,
        }));
      })
      .flat() || [];

  // Find the costliest item
  const costliestItem = productItems?.reduce((max: any, item: any) => {
    const maxPrice = max?.price_details?.selling_price || 0;
    const itemPrice = item?.price_details?.selling_price || 0;
    return itemPrice > maxPrice ? item : max;
  }, productItems?.[0] || null); // Start with first item instead of null

  // Set costliest item as default selected if no item is selected
  React.useEffect(() => {
    if (!selectedItem && productItems && productItems.length > 0) {
      const itemToSelect = costliestItem || productItems[0];
      setSelectedItem(itemToSelect);
    }
  }, [selectedItem, costliestItem, productItems]);

  type VariationButton = {
    buttonText: string;
    item: any;
    key: any;
  };

  return loading ? (
    <MUHLoader />
  ) : (
    <Grid container size={12} spacing={5} p={6}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            rowGap: 6,
            columnGap: 4,
            overflowY:
              product && product.image_urls && product.image_urls.length > 6
                ? 'auto'
                : 'visible',
            maxHeight: '1120px',
            p: 1,
            '&::-webkit-scrollbar': {
              width: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: '3px',
            },
          }}
        >
          {product && product.image_urls ? (
            product.image_urls.map(
              (image: string | undefined, index: number) => (
                <Box
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '13px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <StyledImageNoRadius
                    src={image}
                    alt={`${product?.product_name || 'Product'} ${index + 1}`}
                  />
                </Box>
              )
            )
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <Typography>No product images available</Typography>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box>
              <Typography
                style={{
                  fontWeight: theme.fontWeight.medium,
                  flex: 1,
                  fontFamily: 'Roboto Slab',
                  fontSize: theme.MetricsSizes.regular_xxx,
                  color: theme.Colors.black,
                }}
              >
                {product?.product_name}
              </Typography>
              <Box>
                <Typography sx={{ padding: '2px' }}>
                  <Box
                    component="span"
                    sx={{
                      fontWeight: theme.fontWeight.regular,
                      fontSize: theme.MetricsSizes.small_xx,
                      color: theme.Colors.black,
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    SKU_ID :
                  </Box>{' '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: theme.fontWeight.regular,
                      fontSize: theme.MetricsSizes.small_xx,
                      color: '#676767',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    {product?.sku_id}
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography
                style={{
                  fontWeight: theme.fontWeight.mediumBold,
                  fontSize: theme.MetricsSizes.regular_xxx,
                  color: theme.Colors.primary,
                  fontFamily: 'Roboto Slab',
                }}
              >
                {formatAmountCurrency(
                  selectedItem?.price_details?.selling_price || 0
                ) ||
                  formatAmountCurrency(
                    productItems?.[0]?.price_details.selling_price || 0
                  )}
              </Typography>
              {productItems?.[0]?.price_details.selling_price && (
                <Typography
                  component="span"
                  style={{
                    textDecoration: 'line-through',
                    color: '#F3D8D9',
                    fontFamily: 'Roboto Slab',
                    fontSize: theme.MetricsSizes.regular,
                    fontWeight: theme.fontWeight.medium,
                  }}
                >
                  {formatCurrency(1000)}
                </Typography>
              )}
              <Typography
                style={{
                  fontFamily: 'Roboto Slab',
                  fontSize: theme.MetricsSizes.small_xxx,
                  color: '#2D2D2D',
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                (Incl. all taxes)
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: '#FDECEC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2.8,
                  py: 1,
                  height: '43px',
                }}
              >
                <span
                  style={{
                    color: '#FF9800',
                    fontSize: '18px',
                    paddingRight: '9px',
                  }}
                >
                  ✨
                </span>
              </Box>

              <Box
                sx={{
                  bgcolor: '#6C2B3B',
                  height: '43px',
                  color: 'white',
                  px: 3,
                  py: 1,
                  width: '100%',
                  position: 'relative',
                  fontWeight: 600,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: '-16px',
                    top: 0,
                    bottom: 0,
                    width: '32px',
                    height: '43px',
                    bgcolor: '#6C2B3B',
                    transform: 'skewX(-30deg)',
                  },
                }}
              >
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    fontFamily: 'Roboto Slab',
                    color: theme.Colors.whitePrimary,
                  }}
                >
                  Get 4% OFF on Earrings
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              background: '#E2FFD1',
              padding: '4px 12px',
              display: 'flex',
              gap: '8px',
              width: 'fit-content',
              borderRadius: '30px',
              mb: 3,
              border: '1px solid #A9FF77',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                boxShadow: 2,
                height: '10px',
                width: '10px',
                borderRadius: '100%',
                background: '#6D2E3D',
              }}
            ></Box>
            <Typography
              sx={{
                color: '#6CB044',
                fontSize: '14px',
                fontFamily: 'Roboto slab',
              }}
            >
              {selectedItem?.quantity> 0? `${selectedItem.quantity} In Stock` : 'Out of Stock'}
            </Typography>
          </Box>

          {/* Weight Selection */}
          {variationButtons.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {productItems && productItems.length > 0 && (
                <Typography
                  style={{
                    fontSize: theme.MetricsSizes.small_xxx,
                    fontStyle: 'medium',
                    fontWeight: theme.fontWeight.medium,
                  }}
                >
                  {Object.keys(JSON.parse(productItems[0].variation))[0]}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {variationButtons.map((button: VariationButton) => (
                  <ButtonComponent
                    key={button.key}
                    buttonText={button.buttonText}
                    onClick={() => setSelectedItem(button.item)}
                    sx={{
                      background:
                        selectedItem?.id === button.item.id
                          ? '#F3D8D9'
                          : '#FFFFFF',
                      color: '#000000',
                      borderRadius: '8px',
                      textTransform: 'none',
                      border:
                        selectedItem?.id === button.item.id
                          ? '1px solid #7a1c2d'
                          : '1px solid #C4C4C4',
                      fontSize: '16px',
                      fontWeight: 500,
                      fontFamily: 'Roboto Slab',
                      padding: '4px 24px',
                      minWidth: '80px',
                    }}
                  />
                ))}
              </Grid>
            </Box>
          )}

          <Grid
            container
            size={12}
            spacing={2}
            // marginTop={'10px'}
            marginBottom={3}
            justifyContent={'start'}
          >
            <DualActionButton
              leftButtonText={'Buy Now'}
              rightButtonText={'Add to Cart'}
              rightButtonColor={theme.Colors.primaryLight}
              leftButtonColor={theme.Colors.primary}
              rightButtonWidth={'199px'}
              leftButtonWidth={'199px'}
              rightButtonTextColor={theme.Colors.primary}
              onLeftButtonClick={onClickBuyNowButton}
              disabledLeftBtn={selectedItem?.quantity === 0 || productItems?.quantity> 0?true:false}
              onRightButtonClick={handleAddToCart}
              leftButtonStyle={{
                borderRadius: '8px',
                fontFamily: 'Roboto Slab',
                fontSize: theme.MetricsSizes.regular,
                fontWeight: theme.fontWeight.medium,
                color: theme.Colors.whitePrimary,
              }}
              rightButtonStyle={{
                borderRadius: '8px',
                fontFamily: 'Roboto Slab',
                fontWeight: theme.fontWeight.medium,
                color: theme.Colors.primary,
              }}
              containerStyle={{ gap: '13px' }}
            />

            <StyledIconButton
              onClick={handleFavoriteClick}
              isFavorite={selectedItem?.is_wishlisted ?? false}
            >
              {selectedItem?.is_wishlisted ?? false ? (
                <FavoriteFilledIcon />
              ) : (
                <FavoriteHeartIcon />
              )}
            </StyledIconButton>
            <Grid
              sx={{
                width: 42,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'grid',
                cursor: 'pointer',
                border: '1px solid #632532',
                borderRadius: '8px',
              }}
            >
              <ShareIcon />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography
              style={{
                fontFamily: 'Roboto Slab',
                fontSize: theme.MetricsSizes.small_xxx,
                color: theme.Colors.black,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              Deliver at
            </Typography>

            <Box
              sx={{ border: '1px solid  #D2D2D2', p: 2, borderRadius: '8px' }}
            >
              {/* Pincode Input with Refresh */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <MUHTextInput
                  placeholderText="Enter your Pin Code"
                  value={pincode}
                  onChange={handleChange}
                  fontSize={12}
                  placeholderFontSize={12}
                  placeholderColor="#2D2D2D"
                  borderRadius={2}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    backgroundColor: '#F3F3F3',
                    borderRadius: '8px',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          borderRadius: '0px 8px 8px 0px',
                          maxHeight: 'none',
                          height: '100%',
                          pl: '3px',
                          pr: '5px',
                        }}
                      >
                        {pincode.length === 6 && isValidPinCode(pincode) ? (
                          <IconButton>
                            <PincodeArrowRightIcon />
                          </IconButton>
                        ) : pincode ? (
                          <IconButton onClick={() => setPincode('')}>
                            <PincodeLoadingIcon />
                          </IconButton>
                        ) : (
                          <IconButton>
                            <PincodeArrowRightIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon />
                  <Typography
                    style={{
                      fontFamily: 'Roboto Slab',
                      fontSize: theme.MetricsSizes.small_xxx,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.Colors.black,
                    }}
                  >
                    Expected Delivery On
                  </Typography>
                </Box>

                <Box sx={{ mt: 1 }} />
                <Typography
                  style={{
                    fontFamily: 'Roboto Slab',
                    fontSize: theme.MetricsSizes.small_xxx,
                    fontWeight: theme.fontWeight.regular,
                    color: theme.Colors.black,
                  }}
                >
                  {deliveryDate}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Description
              materialType={product?.material_type_name || ''}
              productItemsDetails={selectedItem ? selectedItem : productItems}
              purity={product?.purity || ''}
              description={product?.description || ''}
            />
          </Box>
        </Box>
      </Grid>

      {openDialog && (
        <DialogComp
          open={openDialog}
          dialogTitle={product?.product_name}
          isViewMode
          renderDialogContent={renderDialogContent}
          onViewModeClick={onViewModeClick}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Grid>
  );
};

export default ProductBuy;
