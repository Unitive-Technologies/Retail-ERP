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
import { ProductService, ProductItemDetail } from '@services/ProductService';

import { isValidPinCode } from '@utils/form-util';
import ProductDescription from './ProductDescription';
import {
  HTTP_STATUSES,
  PRODUCT_TYPE,
  VARIATION_TYPE,
} from '@constants/Constance';
import MUHTypography from '@components/MUHTypography';

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
  stockQuantity: number;
}

// default/dummy product shown when no product_id provided
const DEFAULT_PRODUCT: ProductDetails = {
  id: '1',
  name: 'Gold Coated Silver Earring',
  price: 5400,
  originalPrice: 6000,
  productId: `SKU_12801455`,
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
  stockQuantity: 5,
};

const ProductViewPage: React.FC = () => {
  const [deliveryDate] = useState('Wed, 16th June');
  const theme = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('product_id');
  const skuIdFromQuery = queryParams.get('skuId') || queryParams.get('sku_id');
  const isChild = queryParams.get('isChild');

  const [product, setProduct] = useState<any>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [pincode, setPincode] = useState('606206');
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    const fetchProduct = async (id: string) => {
      try {
        const responseAny: any = await ProductService.getById(id);
        if (responseAny?.data?.statusCode < HTTP_STATUSES.BAD_REQUEST) {
          const fullData = responseAny?.data?.data;
          const respProduct = fullData?.product;
          let itemDetails: ProductItemDetail[] = fullData?.item_details || [];

          if (isChild && respProduct?.variation_type === VARIATION_TYPE.WITH) {
            itemDetails = itemDetails?.filter(
              (item: any) => item?.sku_id === skuIdFromQuery
            );
          }

          const parsedItemDetails = (itemDetails || []).map((item: any) => {
            const variationObj = item.variation
              ? JSON.parse(item.variation)
              : {};

            return {
              ...item,
              variation: variationObj,
            };
          });

          const matchedItem = itemDetails?.find(
            (item: any) => item?.sku_id === skuIdFromQuery
          );

          const tempProduct = {
            product_type: respProduct?.product_type,
            variation_type: respProduct?.variation_type,
            productId: isChild ? skuIdFromQuery : respProduct?.sku_id,
            name: respProduct?.product_name,
            price: 1000,
            description: respProduct?.description,
            images: respProduct?.image_urls,
            purity: respProduct?.purity,
            stockQuantity: isChild
              ? matchedItem?.quantity ?? 0
              : itemDetails[0]?.quantity ?? 0,
            item_details: parsedItemDetails,
          };

          const productDetails = getProductDetailsFromData(tempProduct);
          setProduct({ ...tempProduct, product_details: productDetails });

          const parsedVariations = respProduct?.product_variations
            ? JSON.parse(respProduct.product_variations)
            : [];

          if (!isChild) {
            setVariations(parsedVariations);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product by id', err);
      }
    };

    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, skuIdFromQuery]);

  const getProductDetailsFromData = (productData: any) => {
    const itemDetails: ProductItemDetail[] = productData?.item_details || [];

    if (!itemDetails.length) return [];

    const selected = itemDetails[selectedVariation] || {};

    const getAdditionalDetails = () =>
      (selected?.additional_details || [])
        .filter((d: any) => {
          if (d?.is_visible !== undefined) return Boolean(d.is_visible);
          if (typeof d?.visibility === 'string') {
            return d.visibility.toLowerCase() !== 'hide';
          }
          return true;
        })
        .map((d: any) => ({ label: d.label_name, value: d.unit + 'g' }));

    const getDimensions = () => {
      const { width = 0, length = 0, measurement_type: mtype }: any = selected;
      if (width <= 0 && length <= 0) return [];
      let value = '';
      if (width > 0 && length > 0)
        value = `Width: ${width} ${mtype}    Length: ${length} ${mtype}`;
      else if (width > 0) value = `Width: ${width} ${mtype}`;
      else value = `Length: ${length} ${mtype}`;
      return [{ label: 'Dimensions', value }];
    };

    if (productData.product_type === PRODUCT_TYPE.WEIGHT) {
      if (productData.variation_type === VARIATION_TYPE.WITHOUT) {
        return [
          { label: 'Purity', value: productData.purity + '%' },
          { label: 'Grs Weight', value: selected?.gross_weight + 'g' },
          { label: 'Net Weight', value: selected?.net_weight + 'g' },
          { label: 'Stone Weight', value: (selected?.stone_weight || 0) + 'g' },
          ...getAdditionalDetails(),
          ...getDimensions(),
        ];
      }
      if (productData.variation_type === VARIATION_TYPE.WITH) {
        return [
          { label: 'Purity', value: productData.purity + '%' },
          { label: 'Grs Weight', value: selected?.gross_weight + 'g' },
          { label: 'Net Weight', value: selected?.net_weight + 'g' },
          ...getDimensions(),
        ];
      }
    } else if (productData.product_type === PRODUCT_TYPE.PIECE) {
      return [
        { label: 'Purity', value: productData.purity + '%' },
        ...getDimensions(),
      ];
    }
    return [];
  };

  useEffect(() => {
    if (!product?.item_details?.length) return;

    const updatedDetails = getProductDetailsFromData(product);
    const selectedItem = product.item_details[selectedVariation] || {};

    setProduct((prev: any) => ({
      ...prev,
      stockQuantity: selectedItem?.quantity ?? 0,
      product_details: updatedDetails,
    }));
  }, [selectedVariation]);

  const handleSelectVariation = (variation: string, value: string) => {
    const itemDetails = product?.item_details || [];
    const existingVariation = itemDetails[selectedVariation]?.variation || {};
    const selectedVrtn = {
      ...existingVariation,
      [variation]: value,
    };
    const matchedIndex = itemDetails.findIndex((item: any) => {
      const itemVar = item.variation || {};
      return Object.keys(selectedVrtn).every(
        (key) => itemVar[key] === selectedVrtn[key]
      );
    });

    if (matchedIndex !== -1) {
      setSelectedVariation(matchedIndex);
    } else {
      console.warn('No matching variation found for', selectedVrtn);
    }
  };

  // console.log(product, 'product-------');

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setOpenDialog({ open: true });
  };

  const onViewModeClick = () => {
    console.log('View mode child');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            src={product?.images[selectedImage]}
            alt={product?.name}
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
        {product?.images.map((image: any, idx: number) => (
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

  if (!product?.product_type) return;

  return (
    <Grid container size={12} spacing={5} p={{ xs: 2, md: 6 }}>
      {/* Left Side - Product Images */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Box>
          {/* Mobile Layout - Single main image + thumbnail strip */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {/* Main Image with Floating Icons */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '13px',
                overflow: 'hidden',
                mb: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleImageClick(selectedImageIndex)}
            >
              <img
                src={product?.images[selectedImageIndex]}
                alt={`${product?.name} main`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Floating Action Icons */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  zIndex: 2,
                }}
              >
                {/* Heart Icon */}
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Heart clicked');
                  }}
                >
                  <HeartIcon />
                </IconButton>

                {/* Share Icon */}
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Share clicked');
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Thumbnail Strip */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ccc',
                  borderRadius: '2px',
                },
              }}
            >
              {product?.images.map((image: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: '60px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border:
                      selectedImageIndex === index
                        ? '2px solid #6C2B3B'
                        : '1px solid #e0e0e0',
                    flexShrink: 0,
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product?.name} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Desktop Layout - Grid of images */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'repeat(2, 1fr)',
              rowGap: 6,
              columnGap: 4,
              overflowY:
                (product?.images?.length ?? 0) > 6 ? 'auto' : 'visible',
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
            {product?.images.map((image: any, index: number) => (
              <Box
                key={index}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '13px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  aspectRatio: '1/1',
                }}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`${product?.name} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Dialog for image preview */}
          {openDialog.open && (
            <DialogComp
              open={true}
              dialogTitle={product?.name}
              isViewMode={true}
              renderDialogContent={renderDialogContent}
              onViewModeClick={onViewModeClick}
              onClose={() => setOpenDialog({ open: false })}
            />
          )}
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
                {product?.name}
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
                    {product?.productId}
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
                ₹{product?.price.toLocaleString()}
              </Typography>
              {product?.originalPrice && (
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
                  ₹{product?.originalPrice.toLocaleString()}
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

            {/* Offer Banner */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                overflow: 'hidden',
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

            {/* Stock Indicator */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#E8F5E8',
                  px: 2.5,
                  py: 1,
                  borderRadius: '20px',
                  border: '1px solid #A9FF77',
                  marginTop: '10px',
                }}
              >
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    bgcolor: '#6D2E3D',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Roboto Slab',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#6CB044',
                  }}
                >
                  {product?.stockQuantity} In Stock
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Variations */}
        {variations?.map((variation: any, index: number) => (
          <Box key={index} sx={{ mt: 3, mb: 2 }}>
            <Typography
              variant="inherit"
              sx={{
                fontFamily: 'Roboto Slab',
                fontWeight: 600,
                fontSize: 17,
                mb: 1,
              }}
            >
              {variation?.variation}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {variation?.values?.map((val: string, idx: number) => {
                const isSelected =
                  product?.item_details[selectedVariation]?.variation[
                    variation?.variation
                  ] === val;

                return (
                  <Box
                    key={idx}
                    onClick={() =>
                      handleSelectVariation(variation?.variation, val)
                    }
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: `1px solid ${isSelected ? theme.Colors.primary : ' #C4C4C4'}`,
                      background: isSelected
                        ? theme.Colors.primaryLight
                        : theme.Colors.whitePrimary,
                      borderRadius: '4px',
                      height: '35px',
                      minWidth: '100px',
                    }}
                  >
                    <MUHTypography
                      text={val}
                      color={theme.Colors.black}
                      size={16}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}

        {/* Action Buttons - Desktop Only */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Grid
            container
            size={12}
            spacing={2}
            paddingTop={'20px'}
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
        </Box>

        {/* Mobile Action Buttons - Full Width */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
          <Grid container spacing={1}>
            <Grid size={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: theme.Colors.primary,
                  color: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'Roboto Slab',
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.regular,
                }}
                onClick={() => console.log('Buy Now clicked')}
              >
                Buy Now
              </Box>
            </Grid>
            <Grid size={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: theme.Colors.primaryLight,
                  color: theme.Colors.primary,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'Roboto Slab',
                  fontWeight: theme.fontWeight.medium,
                  fontSize: theme.MetricsSizes.regular,
                }}
                onClick={() => console.log('Add to Cart clicked')}
              >
                Add to Cart
              </Box>
            </Grid>
          </Grid>
        </Box>

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

          <Box sx={{ border: '1px solid #D2D2D2', p: 2, borderRadius: '8px' }}>
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
                slotProps={{
                  input: {
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
                  },
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
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <ProductDescription productDetail={product} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductViewPage;
