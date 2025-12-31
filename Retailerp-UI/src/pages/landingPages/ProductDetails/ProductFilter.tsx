import { useState, useMemo, useEffect, ChangeEvent } from 'react';
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
import { TextInput } from '@components/index';
import { useNavigate } from 'react-router-dom';

import ProductGrid from './ProductGrid';
import ProductBuy from './ProductBuy';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { sortByOptions } from '@constants/Constance';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  subcategoryId?: number;
  stone?: string;
  color?: string;
  style?: string;
  shopFor?: string;
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
  loading?: boolean;
  onWishlistClick?: (productId: number, currentWishlistStatus: boolean) => void;
}

const ProductFilter = ({
  category,
  products = [],
  subcategories = [],
  selectedSubcategoryId = null,
  loading,
  onWishlistClick,
}: ProductFilterProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    selectedSubcategoryId
  );

  const [sortBy, setSortBy] = useState('Best Seller');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  // Initialize filters state dynamically based on variants
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    const initialFilters: Record<string, string[]> = {};
    if (products && products.length > 0) {
      products.forEach((product: any) => {
        if (product.variants && Array.isArray(product.variants)) {
          product.variants.forEach((variant: any) => {
            if (!initialFilters[variant.variant_type]) {
              initialFilters[variant.variant_type] = [];
            }
          });
        }
      });
    }
    return initialFilters;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setSelectedSubcategory(
      selectedSubcategoryId !== undefined ? selectedSubcategoryId : null
    );
  }, [selectedSubcategoryId]);

  const categoryDisplayName = useMemo(() => {
    return (
      category ||
      'Products'
    );
  }, [category, products]);

  // Generate dynamic filters from product variants
  const dynamicFilterOptions = useMemo(() => {
    const filterMap: Record<string, Set<string>> = {};
    
    products.forEach((product: any) => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant: any) => {
          const variantType = variant.variant_type;
          if (!filterMap[variantType]) {
            filterMap[variantType] = new Set();
          }
          
          if (variant.type_ids && Array.isArray(variant.type_ids)) {
            variant.type_ids.forEach((typeId: any) => {
              if (typeId.value) {
                filterMap[variantType].add(typeId.value);
              }
            });
          }
        });
      }
    });
    
    // Convert Sets to arrays and format keys
    const result: Record<string, string[]> = {};
    Object.keys(filterMap).forEach(key => {
      result[key] = Array.from(filterMap[key]);
    });
    
    return result;
  }, [products]);

  // Transform API products to match ProductGrid format
  const transformedProducts = useMemo(() => {
    return products.map((product: any) => ({
      id: product.id?.toString(),
      name: product.product_name,
      price: Number(product.selling_price) || 0,
      image: product.image_urls?.[0] || '',
      category: product.category_name,
      subcategoryId: product.subcategory_id ?? null,
      isNew: false,
      discount: 0,
      is_wishlisted: product.is_wishlisted,
      originalPrice: product.selling_price || 0,
      stone: product.stone_type ?? 'Unknown',
      color: product.color ?? 'Unknown',
      style: product.style ?? 'Unknown',
      shopFor: product.shop_for ?? 'Unknown',
    }));
  }, [products]);
  
  const filteredProducts = useMemo(() => {
    return transformedProducts.filter((product) => {
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      if (
        selectedSubcategory !== null &&
        product.subcategoryId !== selectedSubcategory
      ) {
        return false;
      }

      // Dynamic variant-based filtering
      const originalProduct = products.find(p => p.id?.toString() === product.id);
      if (originalProduct && originalProduct.variants) {
        for (const [filterType, selectedValues] of Object.entries(filters)) {
          if (selectedValues.length > 0) {
            const variant = originalProduct.variants.find((v: any) => v.variant_type === filterType);
            if (variant && variant.type_ids) {
              const variantValues = variant.type_ids.map((typeId: any) => typeId.value);
              // OR logic: Show product if it has ANY of the selected values
              const hasAnyMatchingValue = selectedValues.some(value => variantValues.includes(value));
              if (!hasAnyMatchingValue) {
                return false;
              }
            } else {
              // If variant doesn't exist for this filter type, exclude the product
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [transformedProducts, products, priceRange, selectedSubcategory, filters]);

  const maxPrice = useMemo(() => {
    return Math.max(...transformedProducts.map((p) => p.price), 0);
  }, [transformedProducts]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const sortedProducts = useMemo(() => {
    if (sortBy === 'Best Seller') return filteredProducts;

    return [...filteredProducts].sort((a, b) =>
      sortBy === 'Price Low to High' ? a.price - b.price : b.price - a.price
    );
  }, [filteredProducts, sortBy]);
  
  const handleCheckboxChange = (
    filterKey: string,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = Array.isArray(prev[filterKey])
        ? prev[filterKey]
        : [];
      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleSubcategoryClick = (subcategoryId: number | null) => {
    setSelectedSubcategory(subcategoryId);

    const pathParts = window.location.pathname.split('/');
    const categoryIndex = pathParts.findIndex((part) => part === 'category');

    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      const categoryId = pathParts[categoryIndex + 1];
      navigate(
        subcategoryId
          ? `/home/category/${categoryId}/subcategory/${subcategoryId}`
          : `/home/category/${categoryId}`
      );
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'white' }}>
      {selectedProduct ? (
        <ProductBuy />
      ) : (
        <>
          {/* HEADER */}
          <Box sx={{ mb: 1.5, paddingInline: '5px' }}>
            <Typography
              variant="inherit"
              sx={{
                color: '#782F3E',
                fontWeight: 500,
                fontSize: '28px',
                fontFamily: 'Roboto Slab',
              }}
            >
              {categoryDisplayName}
              <Typography
                variant="inherit"
                component="span"
                sx={{
                  color: theme.Colors.black,
                  fontSize: '20px',
                  fontWeight: 400,
                  fontFamily: 'Roboto Slab',
                }}
              >
                {' '}
                | {sortedProducts.length} Items
              </Typography>
            </Typography>
          </Box>

          {/* SUBCATEGORY + SORT */}
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                      margin: 0,
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
                  <AccordionSummary
                    sx={{ margin: 0 }}
                    expandIcon={<ExpandMoreIcon />}
                  >
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
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between',
                        // gap: 2,
                      }}
                    >
                      <TextInput
                        size="small"
                        value={priceRange[0]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = Math.min(
                            Math.max(0, Number(e.target.value)),
                            priceRange[1] - 1000
                          );
                          setPriceRange([value, priceRange[1]]);
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ mr: 1, ml: 0, p: 0, pt: 0.5 }}
                              >
                                ₹
                              </InputAdornment>
                            ),
                          },
                        }}
                        inputProps={{
                          min: 0,
                          max: priceRange[1] - 1000,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: theme.Colors.primary,
                            },
                            '&:hover fieldset': {
                              borderColor: theme.Colors.primaryDarkEnd,
                            },
                          },
                          width: '120px',
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextInput
                          size="small"
                          value={priceRange[1]}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = Math.max(
                              Number(e.target.value),
                              priceRange[0] + 1000
                            );
                            setPriceRange([priceRange[0], value]);
                          }}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{ mr: 1, ml: 0, p: 0, pt: 0.5 }}
                                >
                                  ₹
                                </InputAdornment>
                              ),
                            },
                          }}
                          inputProps={{
                            min: priceRange[0] + 1000,
                            max: 100000,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: theme.Colors.primary,
                              },
                              '&:hover fieldset': {
                                borderColor: theme.Colors.primaryDarkEnd,
                              },
                            },
                            width: '120px',
                          }}
                        />
                      </Box>
                    </Box>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={maxPrice}
                      onChange={(_, value) =>
                        setPriceRange(value as [number, number])
                      }
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Other Filters */}
                {Object.entries(dynamicFilterOptions).map(([filterType, options]) => (
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
                      '&.MuiAccordion-root.Mui-expanded': {
                        margin: 0,
                      },
                      '&:last-of-type': {
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                      },
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        height: '50px',
                        minHeight: '50px !important',
                        margin: 0,
                      }}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      {' '}
                      <Typography
                        style={{
                          fontWeight: 400,
                          fontSize: '18px',
                          fontFamily: 'Roboto Slab',
                          color: theme.Colors.black,
                        }}
                      >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {options.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                checked={
                                  filters[filterType]?.includes(option) || false
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    filterType,
                                    option
                                  )
                                }
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
                products={sortedProducts}
                loading={loading}
                onProductClick={(product) => setSelectedProduct(product)}
                onWishlistClick={onWishlistClick}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ProductFilter;
