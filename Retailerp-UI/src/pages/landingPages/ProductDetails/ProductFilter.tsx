import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  CardProductData,
  categories,
  filterOptions,
} from '@constants/DummyData';
import { TextInput } from '@components/index';
import { useNavigate } from 'react-router-dom';

import ProductGrid from './ProductGrid';
import ProductBuy from './ProductBuy';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { sortByOptions } from '@constants/Constance';

// Product type
type Product = {
  id: string;
  name: string;
  price: number | string;
  category?: string;
  image: string;
};

interface Subcategory {
  id: number;
  label: string;
  count: number;
}

interface ProductFilterProps {
  category?: string | null;
  products?: any[];
  subcategories?: Subcategory[];
  selectedSubcategoryId?: number | null;
}

const ProductFilter = ({
  category,
  products = [],
  subcategories = [],
  selectedSubcategoryId = null,
}: ProductFilterProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    selectedSubcategoryId
  );
  const [sortBy, setSortBy] = useState('Best Seller');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setSelectedSubcategory(
      selectedSubcategoryId !== undefined ? selectedSubcategoryId : null
    );
  }, [selectedSubcategoryId]);

  const categoryDisplayName = useMemo(() => {
    return (
      products[0]?.category_name ||
      category ||
      products[0]?.category ||
      'Products'
    );
  }, [category, products]);

  const totalProductCount = useMemo(() => products.length, [products]);

  // Transform API products to match ProductGrid format
  const transformedProducts = useMemo(() => {
    return products.map((product: any) => ({
      id: product.id?.toString() || '',
      name: product.product_name || '',
      price: product.base_price || product.price || 0,
      image: product.image_urls?.[0] || '',
      category: product.category_name || '',
      isNew: false,
      discount: 0,
      originalPrice: product.base_price || product.price || 0,
    }));
  }, [products]);

  // Filter products by price range and selected subcategory
  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts;

    // Filter by subcategory if one is selected
    if (selectedSubcategory !== null) {
      filtered = filtered.filter((p) => {
        const product = products.find(
          (prod: any) => prod.id?.toString() === p.id
        );
        return product?.subcategory_id === selectedSubcategory;
      });
    }

    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = typeof p.price === 'number' ? p.price : 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    return filtered;
  }, [transformedProducts, selectedSubcategory, priceRange, products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      const priceA = typeof a.price === 'number' ? a.price : 0;
      const priceB = typeof b.price === 'number' ? b.price : 0;

      if (sortBy === 'Price Low to High') return priceA - priceB;
      if (sortBy === 'Price High to Low') return priceB - priceA;
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortBy]);

  // Handle subcategory click
  const handleSubcategoryClick = (subcategoryId: number | null) => {
    setSelectedSubcategory(subcategoryId);

    // Update URL if categoryId exists in path
    const pathParts = window.location.pathname.split('/');
    const categoryIndex = pathParts.findIndex((part) => part === 'category');

    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      const categoryId = pathParts[categoryIndex + 1];
      if (subcategoryId) {
        navigate(`/home/category/${categoryId}/subcategory/${subcategoryId}`);
      } else {
        navigate(`/home/category/${categoryId}`);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {selectedProduct ? (
        <Box>
          <ProductBuy />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 1.5, paddingInline: '5px' }}>
            <Typography
              variant="inherit"
              sx={{
                color: '#782F3E',
                fontWeight: 500,
                fontSize: '20px',
                fontFamily: 'Roboto Slab',
              }}
            >
              {categoryDisplayName}{' '}
              <Typography
                variant="inherit"
                component="span"
                sx={{
                  color: theme.Colors.black,
                  fontSize: '18px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
              >
                | {totalProductCount} Items
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              p: '8px 20px',
              border: '1px solid #E1E1E1',
              borderRadius: '8px',
            }}
          >
            {/* Subcategory Tabs */}
            {subcategories.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {/* <Typography
                  onClick={() => handleSubcategoryClick(null)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Roboto Slab',
                    fontWeight: 500,
                    color: selectedSubcategory === null ? '#fff' : '#2D2D2D',
                    backgroundColor:
                      selectedSubcategory === null
                        ? theme.Colors.primary
                        : 'transparent',
                    border:
                      selectedSubcategory === null
                        ? 'none'
                        : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    display: 'inline-block',
                    textAlign: 'center',
                  }}
                >
                  All ({transformedProducts.length})
                </Typography> */}
                {subcategories.map((subcategory) => (
                  <Typography
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'Roboto Slab',
                      fontWeight: 500,
                      color:
                        selectedSubcategory === subcategory.id
                          ? '#fff'
                          : '#2D2D2D',
                      backgroundColor:
                        selectedSubcategory === subcategory.id
                          ? theme.Colors.primary
                          : 'transparent',
                      border:
                        selectedSubcategory === subcategory.id
                          ? 'none'
                          : '1px solid transparent',
                      borderRadius: '4px',
                      padding: '10px 20px',
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    {subcategory.label} ({subcategory.count})
                  </Typography>
                ))}
              </Box>
            )}

            {/* Sort By */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '0.5px solid #631F32',

                  paddingLeft: 1,
                  borderRadius: 1,
                }}
              >
                <Typography
                  style={{
                    fontWeight: 400,
                    fontSize: '14px',
                    fontStyle: 'regular',
                    fontFamily: 'Roboto Slab',
                    color: '#575757',
                    // marginRight: 8,
                  }}
                >
                  Short By :
                </Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <MUHSelectBoxComponent
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    selectItems={sortByOptions}
                    placeholderText="Sort By"
                    borderRadius={8}
                    borderColor="transparent"
                    isCheckbox={false}
                    selectHeight={40}
                    selectBoxStyle={{
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'Roboto Slab',
                      fontStyle: 'normal',
                      color: '#2D2D2D',

                      minHeight: '40px',

                      borderRadius: '8px',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                    menuItemTextColor="#2D2D2D"
                    menuItemTextSize={14}
                    selectedColor="#2D2D2D"
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Left Sidebar - Filters */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  borderRadius: '12px',
                  // p: 2,
                  border: '1px solid #E1E1E1',
                  overflow: 'hidden',
                }}
              >
                {/* Price Filter */}
                <Accordion
                  defaultExpanded
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',

                    borderBottom: '1px solid #E1E1E1',
                    borderRadius: 0,
                    '&:first-of-type': {
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    },
                    '&:last-of-type': {
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                      borderBottom: 'none',
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: '18px',
                        fontFamily: 'Roboto Slab',
                        color: theme.Colors.black,
                      }}
                    >
                      Price
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails >
                    <Box sx={{ px: 0.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          // gap: 2,
                        }}
                      >
                        <Grid sx={{ width: '100px', height: '30px' }}>
                          <TextInput
                            padding={0.7}
                            value={priceRange[0]}
                            height={30}
                            borderRadius={1}
                            onChange={(e) =>
                              setPriceRange([
                                Number(e.target.value),
                                priceRange[1],
                              ])
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    sx={{ mr: 0, ml: 2, p: 0, pt: 0.5 }}
                                  >
                                    ₹
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid sx={{ width: '100px', height: '30px' }}>
                          <TextInput
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([
                                priceRange[0],
                                Number(e.target.value),
                              ])
                            }
                            borderRadius={1}
                            padding={0.1}
                            height={30}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ₹
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Grid>
                      </Box>
                      <Slider
                        value={priceRange}
                        onChange={(_, newValue) =>
                          setPriceRange(newValue as number[])
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={100000}
                        sx={{
                          color: '#471923',
                          '& .MuiSlider-thumb': {
                            backgroundColor: "#471923",
                          },
                          '& .MuiSlider-track': {
                            backgroundColor: theme.Colors.primaryDarkEnd,
                          },
                        }}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Other Filters */}
                {Object.entries(filterOptions).map(([filterType, options]) => (
                  <Accordion
                    key={filterType}
                    defaultExpanded
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                      boxShadow: 'none',
                      borderBottom: '1px solid #E1E1E1',
                      fontWeight: '400',
                      fontSize: '16px',
                      fontFamily: 'Roboto Slab',
                      color: theme.Colors.black,
                      borderRadius: 0,
                      '&:last-of-type': {
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        style={{
                          fontWeight: 400,
                          fontSize: '18px',
                          fontFamily: 'Roboto Slab',
                          color: theme.Colors.black,
                        }}
                      >
                        {filterType === 'shopFor' ? 'Shop For' : filterType}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {options.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                sx={{
                                  color: '#2D2D2D',
                                  '&.Mui-checked': {
                                    color: theme.Colors.primaryDarkEnd,
                                  },
                                }}
                              />
                            }
                            label={option}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Grid>

            {/* Right Side - Product Grid */}
            <Grid size={{ xs: 12, md: 9 }}>
              <ProductGrid
                products={
                  sortedProducts.length > 0 ? sortedProducts : CardProductData
                }
                onProductClick={(product) => setSelectedProduct(product)}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ProductFilter;
