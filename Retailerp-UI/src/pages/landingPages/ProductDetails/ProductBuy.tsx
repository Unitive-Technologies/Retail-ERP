import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { DialogComp, DualActionButton } from '@components/index';
import {
  CalendarIcon,
  HeartIcon,
  PincodeArrowRightIcon,
  PincodeLoadingIcon,
  ShareIcon,
  StudImg,
} from '@assets/Images';
import MUHTextInput from '@components/MUHTextInput';
import { useLocation } from 'react-router-dom';

import Description from './Description';

import { isValidPinCode } from '@utils/form-util';

// Product interface
interface ProductSpecifications {
  purity: string;
  grossWeight: string;
  netWeight: string;
  stoneWeight: string;
  dimensions: {
    width: string;
    length: string;
  };
}

interface ProductDetails {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  productId: string;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  description: string;
  specifications: ProductSpecifications;
  weightOptions: { value: string; label: string }[];
  inStock: boolean;
}

const ProductBuy: React.FC = () => {
  const [deliveryDate, setDeliveryDate] = useState('Wed, 16th June');
  const theme = useTheme();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id');

  // In a real implementation, you would fetch the product data based on the productId
  // For now, we'll just use our sample data and log the ID
  useEffect(() => {
    console.log('Product ID from URL:', productId);
  }, [productId]);

  const [product] = useState<ProductDetails>({
    id: productId || '1',
    name: 'Gold Coated Silver Earring',
    price: 5400,
    originalPrice: 6000,
    productId: `SKU_128${productId || '01455'}`,
    discount: 10,
    rating: 4.5,
    reviewCount: 128,
    images: [
      StudImg,
      StudImg,
      StudImg,
      StudImg,
      StudImg,
      StudImg,
      StudImg,
      StudImg,
    ],
    category: 'Earrings',
    description:
      'Elegant gold coated silver earrings with traditional design and premium finish.',
    specifications: {
      purity: '92.5%',
      grossWeight: '45.23 g',
      netWeight: '43.39 g',
      stoneWeight: '2.39 g',
      dimensions: { width: '1.5 cm', length: '3.2 cm' },
    },
    weightOptions: [
      { value: '45.23g', label: '45.23 g' },
      { value: '50.0g', label: '50.0 g' },
    ],
    inStock: true,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions[0].value
  );
  const [openDialog, setOpenDialog] = useState({ open: false });

  const [pincode, setPincode] = useState('606206');

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setOpenDialog({ open: true });
  };

  const onViewModeClick = () => {
    console.log('View mode child');
  };
  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };
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
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '13px',
            }}
          />
        </Box>
      </Grid>

      <Grid
        container
        size={{ xs: 12, md: 6 }}
        sx={{ gap: 2, overflow: 'scroll', height: '100vh' }}
        flexDirection={'row'}
      >
        {product.images.map((image, idx) => (
          <Box
            key={idx}
            sx={{
              cursor: 'pointer',
              borderRadius: '13px',
              border:
                idx === selectedImage ? '2px solid #6C2B3B' : '1px solid #eee',
              boxShadow: idx === selectedImage ? 2 : 0,
              transition: 'border 0.2s',
              width: '45%',
              mx: 'auto',
              background: '#fff',
            }}
            onClick={() => setSelectedImage(idx)}
          >
            <img
              src={image}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '13px',
              }}
            />
          </Box>
        ))}
      </Grid>
    </Grid>
  );

  return (
    <Grid container size={12} spacing={5} p={6}>
      {/* Left Side - Product Images */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            rowGap: 6,
            columnGap: 4,
            overflowY: product.images.length > 6 ? 'auto' : 'visible',
            maxHeight: '1120px',
            // width: '540px',
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
          {product.images.map((image, index) => (
            <Box
              key={index}
              sx={{
                cursor: 'pointer',

                borderRadius: '13px',
                // width: '360px',
                // height: '360px',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              // onClick={() => setSelectedImage(index)}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
          {openDialog.open ? (
            <DialogComp
              open={true}
              dialogTitle={product.name}
              isViewMode={true}
              renderDialogContent={renderDialogContent}
              onViewModeClick={onViewModeClick}
              onClose={() => setOpenDialog({ open: false })}
            />
          ) : null}
        </Box>
      </Grid>

      {/* Right Side - Product Details */}
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
                {product.name}
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
                    {product.productId}
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography
                style={{
                  fontWeight: theme.fontWeight.mediumBold,
                  fontSize: theme.MetricsSizes.regular_xxx,
                  color: theme.Colors.black,
                  fontFamily: 'Roboto Slab',
                }}
              >
                ₹{product.price.toLocaleString()}
              </Typography>
              {product.originalPrice && (
                <Typography
                  component="span"
                  style={{
                    textDecoration: 'line-through',
                    color: 'text.disabled',
                    fontFamily: 'Roboto Slab',
                    fontSize: theme.MetricsSizes.regular,

                    fontWeight: theme.fontWeight.medium,
                  }}
                >
                  ₹{product.originalPrice.toLocaleString()}
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
                // width: 'fit-content',

                mb: 2,
              }}
            >
              {/* Left icon box */}
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

              {/* Offer content with slant cut */}
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

          {/* Weight Selection */}
          {/* <Box sx={{ mb: 3 }}>
            <Typography
              style={{
                // fontFamily: 'Roboto Slab',
                fontSize: theme.MetricsSizes.small_xxx,
                fontStyle: 'medium',
                fontWeight: theme.fontWeight.medium,
              }}
            >
              Weight
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size="auto">
                <TextInput
                  size="small"
                  variant="outlined"
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  placeholder="Enter weight"
                  width="100px"
                />
              </Grid>

              <Grid size="auto">
                <TextInput
                  size="small"
                  variant="outlined"
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  placeholder="Enter weight"
                  width="100px"
                />
              </Grid>
            </Grid>
          </Box> */}

          <Grid
            container
            size={12}
            spacing={2}
            // marginTop={'10px'}
            paddingTop={'30px'}
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
              onLeftButtonClick={() => console.log('Buy Now clicked')}
              onRightButtonClick={() => console.log('Add to Cart clicked')}
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
              onClick={() => {}}
            >
              <HeartIcon />
            </Grid>
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
              onClick={() => {}}
            >
              <ShareIcon />
            </Grid>
          </Grid>
          {/* Delivery Information */}
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

              {/* Delivery Date */}
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
                <Box />
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Description />
          </Box>
        </Box>
      </Grid>
    </Grid>

    // </Container>
  );
};

export default ProductBuy;
