import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grow,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  useMediaQuery,
  Divider,
  ListItemIcon,
  InputAdornment,
  TextField,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_MENU } from '@constants/Constance';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import { MenuIcon, PopoverIcon, SavingsSchemeIcon } from '../../assets/Images';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonComponent } from '@components/index';

interface Category {
  id: number;
  category_name: string;
  category_image_url: string;
  material_type_id: number;
  material_type: string | null;
  material_image_url: string | null;
}

interface SubCategory {
  id: number;
  subcategory_name: string;
  subcategory_image_url: string;
  reorder_level: number;
  category_id: number;
  category_name: string;
  category_image_url: string;
  materialtype_id: number;
  material_type: string;
  material_image_url: string;
}

export const NavigationBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [paperHover, setPaperHover] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [drawerLevel, setDrawerLevel] = useState<
    'main' | 'category' | 'subcategory'
  >('main');
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  // Check if screen is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabPosition, setTabPosition] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const genderOptions = ['Men', 'Women', 'Kids', 'Unisex'];

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and subcategories in parallel
        const [categoriesResponse, subCategoriesResponse] = await Promise.all([
          API_SERVICES.CategoryService.getAll({}),
          API_SERVICES.SubCategoryService.getAll({}),
        ]);

        if (
          categoriesResponse &&
          'status' in categoriesResponse &&
          categoriesResponse.status < HTTP_STATUSES.BAD_REQUEST &&
          'data' in categoriesResponse
        ) {
          const categoriesData =
            categoriesResponse.data?.data?.categories || [];
          setCategories(categoriesData);
        }

        if (
          subCategoriesResponse &&
          'status' in subCategoriesResponse &&
          subCategoriesResponse.status < HTTP_STATUSES.BAD_REQUEST &&
          'data' in subCategoriesResponse
        ) {
          const subCategoriesData =
            subCategoriesResponse.data?.data?.subCategories || [];
          setSubCategories(subCategoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
      }
    };

    fetchData();
  }, []);

  // Get subcategories for a specific category
  const getSubCategoriesByCategoryId = useCallback(
    (categoryId: number) => {
      return subCategories.filter((sub) => sub.category_id === categoryId);
    },
    [subCategories]
  );

  // Get categories that have subcategories
  const categoriesWithSubcategories = useMemo(() => {
    return categories.filter((category) => {
      const subCategoriesForCategory = getSubCategoriesByCategoryId(
        category.id
      );
      return subCategoriesForCategory.length > 0;
    });
  }, [categories, getSubCategoriesByCategoryId]);

  const handleMenuClick = (label: string, categoryId?: number) => {
    if (label === 'Savings Scheme') {
      navigate('/home/schemePages');
      onMouseLeave();
      setMobileMenuOpen(false);
      resetDrawerState();
      return;
    }

    if (label === 'Gender') {
      navigate('/home/gender');
      onMouseLeave();
      setMobileMenuOpen(false);
      resetDrawerState();
      return;
    }

    if (label === NAVIGATION_MENU.ALL_JEWELLERY) {
      // Handle All Jewellery click - navigate to home or all products
      navigate('/home');
      onMouseLeave();
      setMobileMenuOpen(false);
      resetDrawerState();
      return;
    }

    // If categoryId is provided, navigate with categoryId
    if (categoryId) {
      navigate(`/home/category/${categoryId}`);
    } else {
      // Fallback: find category by name
      const category = categories.find((cat) => cat.category_name === label);
      if (category) {
        navigate(`/home/category/${category.id}`);
      }
    }

    onMouseLeave();
    setMobileMenuOpen(false);
    resetDrawerState();
  };

  const handleOptionClick = useCallback(
    (categoryId: number, subcategoryId: number) => {
      navigate(`/home/category/${categoryId}/subcategory/${subcategoryId}`);
      onMouseLeave();
      setMobileMenuOpen(false);
      resetDrawerState();
    },
    [navigate]
  );

  const handleGenderOptionClick = (genderOption: string) => {
    navigate(`/home/gender/${encodeURIComponent(genderOption.toLowerCase())}`);
    setMobileMenuOpen(false);
    resetDrawerState();
  };

  const resetDrawerState = () => {
    setDrawerLevel('main');
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setExpandedCategory(null);
  };

  const handleMainCategoryClick = (category: string, categoryId?: number) => {
    if (category === 'All Jewellery') {
      setSelectedMainCategory(category);
      setDrawerLevel('category');
    } else {
      handleMenuClick(category, categoryId);
    }
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    if (categoryName === 'Gender') {
      if (expandedCategory === categoryName) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryName);
      }
      return;
    }

    const subCategoriesForCategory = getSubCategoriesByCategoryId(categoryId);

    if (subCategoriesForCategory.length > 0) {
      if (expandedCategory === categoryName) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryName);
      }
    } else {
      handleMenuClick(categoryName, categoryId);
    }
  };

  const handleBackClick = () => {
    if (drawerLevel === 'subcategory') {
      setDrawerLevel('category');
      setSelectedSubCategory(null);
    } else if (drawerLevel === 'category') {
      setDrawerLevel('main');
      setSelectedMainCategory(null);
      setExpandedCategory(null);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const getAllJewelleryContent = useCallback(
    () => (
      <Box
        sx={{
          p: 2.2,
          display: 'flex',
          gap: 4,
          minWidth: 500,
          background: theme.Colors.whitePrimary,
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
          borderRadius: 1.5,
          overflowY: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {categoriesWithSubcategories.map((category) => {
          const subCategoriesForCategory = getSubCategoriesByCategoryId(
            category.id
          );
          return (
            <Box
              sx={{ maxHeight: '200px', overflowY: 'auto' }}
              key={category.id}
            >
              <Typography
                variant="h6"
                sx={{ mb: 0.4, color: '#4E2223', fontWeight: 600 }}
              >
                {category.category_name}
              </Typography>
              {subCategoriesForCategory.map((subCategory) => (
                <Box
                  key={subCategory.id}
                  onClick={() => handleOptionClick(category.id, subCategory.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1,
                    pl: 2,
                    cursor: 'pointer',
                    color: '#4E2223',
                  }}
                >
                  <img src={PopoverIcon} />
                  <Typography>{subCategory.subcategory_name}</Typography>
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    ),
    [
      categoriesWithSubcategories,
      getSubCategoriesByCategoryId,
      handleOptionClick,
    ]
  );

  const renderPopoverContent = useCallback(
    (category: string) => {
      if (category === NAVIGATION_MENU.ALL_JEWELLERY) {
        return getAllJewelleryContent();
      }

      if (category === 'Savings Scheme' || category === 'Gender') {
        return null;
      }

      const categoryData = categories.find(
        (cat) => cat.category_name === category
      );
      if (!categoryData) {
        return (
          <Box sx={{ p: 2 }}>
            <Typography>No content for this category.</Typography>
          </Box>
        );
      }

      const subCategoriesForCategory = getSubCategoriesByCategoryId(
        categoryData.id
      );

      return (
        <Box
          sx={{
            p: 2.2,
            minWidth: 200,
            background: theme.Colors.whitePrimary,
            boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.1)',
            transition: 'all 0.5s ease-in-out',
            borderRadius: 1.5,
            overflowY: 'auto',
            maxHeight: '250px',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 0.4, color: '#4E2223', fontWeight: 600 }}
          >
            {categoryData.category_name}
          </Typography>
          {subCategoriesForCategory.map((subCategory) => (
            <Box
              key={subCategory.id}
              onClick={() => handleOptionClick(categoryData.id, subCategory.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
                pl: 2,
                cursor: 'pointer',
                color: '#4E2223',
              }}
            >
              <img src={PopoverIcon} />
              <Typography>{subCategory.subcategory_name}</Typography>
            </Box>
          ))}
        </Box>
      );
    },
    [
      categories,
      getSubCategoriesByCategoryId,
      handleOptionClick,
      getAllJewelleryContent,
    ]
  );

  const isActive = useCallback(
    (category: string) => {
      if (category === 'Savings Scheme') {
        return location?.pathname?.includes('/schemePages');
      }

      if (category === 'Gender') {
        return location?.pathname?.includes('/gender');
      }

      if (category === NAVIGATION_MENU.ALL_JEWELLERY) {
        return location?.pathname === '/home';
      }

      const categoryData = categories.find(
        (cat) => cat.category_name === category
      );

      if (!categoryData) return false;

      const pathname = location?.pathname;
      if (!pathname) return false;

      // Check if pathname matches /home/category/{categoryId}
      const categoryIdMatch = pathname.match(/\/home\/category\/(\d+)/);
      if (categoryIdMatch && parseInt(categoryIdMatch[1]) === categoryData.id) {
        return true;
      }

      return false;
    },
    [location.pathname, categories]
  );

  const onMuseHover = (
    event: React.MouseEvent<HTMLElement>,
    category: string
  ) => {
    if (isMobile) return;

    if (category === 'Savings Scheme' || category === 'Gender') {
      setHoveredTab(category);
      return;
    }

    const tabElement = event.currentTarget;
    const tabRect = tabElement.getBoundingClientRect();

    if (toolbarRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      setTabPosition({
        left: tabRect.left - toolbarRect.left,
        width: tabRect.width,
      });
    }

    setHoveredTab(category);
    setPaperHover(category);
  };

  const onMouseLeave = () => {
    if (isMobile) return;
    setHoveredTab(null);
    setPaperHover(null);
  };

  // Mobile Drawer Component
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => {
        setMobileMenuOpen(false);
        resetDrawerState();
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          backgroundColor: theme.Colors.whitePrimary,
        },
      }}
    >
      {drawerLevel === 'main' && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#4E2223', fontWeight: 600 }}>
              Categories
            </Typography>
            <IconButton
              onClick={() => {
                setMobileMenuOpen(false);
                resetDrawerState();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ pt: 0 }}>
            {/* All Jewellery */}
            <ListItemButton
              onClick={() => handleMainCategoryClick('All Jewellery')}
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemText
                primary="All Jewellery"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#4E2223',
                    fontWeight: 500,
                  },
                }}
              />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>

            {/* Categories from API */}
            {categoriesWithSubcategories.map((category) => (
              <ListItemButton
                key={category.id}
                onClick={() =>
                  handleMainCategoryClick(category.category_name, category.id)
                }
                sx={{ borderBottom: '1px solid #f0f0f0' }}
              >
                <ListItemText
                  primary={category.category_name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#4E2223',
                      fontWeight: 500,
                    },
                  }}
                />
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <ArrowForwardIcon />
                </ListItemIcon>
              </ListItemButton>
            ))}

            {/* Gender - New menu item */}
            <ListItemButton
              onClick={() => handleMainCategoryClick('Gender')}
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemText
                primary="Gender"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#4E2223',
                    fontWeight: 500,
                  },
                }}
              />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>

            {/* Savings Scheme - Regular menu item */}
            <ListItemButton
              onClick={() => handleMainCategoryClick('Savings Scheme')}
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemText
                primary="Savings Scheme"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#4E2223',
                    fontWeight: 500,
                  },
                }}
              />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <ArrowBackIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </>
      )}

      {drawerLevel === 'category' &&
        selectedMainCategory === 'All Jewellery' && (
          <>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <IconButton onClick={handleBackClick}>
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: '#4E2223', fontWeight: 600 }}
              >
                All Jewellery
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <IconButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    resetDrawerState();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider />
            <List sx={{ pt: 0 }}>
              {categoriesWithSubcategories.map((category) => {
                const subCategoriesForCategory = getSubCategoriesByCategoryId(
                  category.id
                );
                return (
                  <Box key={category.id}>
                    <ListItemButton
                      onClick={() =>
                        handleCategoryClick(category.id, category.category_name)
                      }
                      sx={{ borderBottom: '1px solid #f0f0f0' }}
                    >
                      <ListItemText
                        primary={category.category_name}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: '#4E2223',
                            fontWeight: 500,
                          },
                        }}
                      />
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        {subCategoriesForCategory.length > 0 ? (
                          expandedCategory === category.category_name ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </ListItemIcon>
                    </ListItemButton>

                    {subCategoriesForCategory.length > 0 && (
                      <Collapse
                        in={expandedCategory === category.category_name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {subCategoriesForCategory.map((subCategory) => (
                            <ListItemButton
                              key={subCategory.id}
                              onClick={() =>
                                handleOptionClick(category.id, subCategory.id)
                              }
                              sx={{
                                pl: 4,
                                borderBottom: '1px solid #f5f5f5',
                                backgroundColor: '#fafafa',
                                '&:hover': {
                                  backgroundColor: '#f0f0f0',
                                },
                              }}
                            >
                              <ListItemText
                                primary={subCategory.subcategory_name}
                                sx={{
                                  '& .MuiListItemText-primary': {
                                    color: '#666',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              })}

              <Box>
                <ListItemButton
                  onClick={() => {
                    if (expandedCategory === 'Gender') {
                      setExpandedCategory(null);
                    } else {
                      setExpandedCategory('Gender');
                    }
                  }}
                  sx={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <ListItemText
                    primary="Gender"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#4E2223',
                        fontWeight: 500,
                      },
                    }}
                  />
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    {expandedCategory === 'Gender' ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemIcon>
                </ListItemButton>

                <Collapse
                  in={expandedCategory === 'Gender'}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {genderOptions.map((option) => (
                      <ListItemButton
                        key={option}
                        onClick={() => handleGenderOptionClick(option)}
                        sx={{
                          pl: 4,
                          borderBottom: '1px solid #f5f5f5',
                          backgroundColor: '#fafafa',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}
                      >
                        <ListItemText
                          primary={option}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: '#666',
                              fontWeight: 400,
                              fontSize: '14px',
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            </List>
          </>
        )}

      {drawerLevel === 'subcategory' && selectedSubCategory && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <IconButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#4E2223', fontWeight: 600 }}>
              {selectedSubCategory}
            </Typography>
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  resetDrawerState();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <List sx={{ pt: 0 }}>
            {(() => {
              const categoryData = categories.find(
                (cat) => cat.category_name === selectedSubCategory
              );
              if (!categoryData) return null;
              const subCategoriesForCategory = getSubCategoriesByCategoryId(
                categoryData.id
              );
              return subCategoriesForCategory.map((subCategory) => (
                <ListItemButton
                  key={subCategory.id}
                  onClick={() =>
                    handleOptionClick(categoryData.id, subCategory.id)
                  }
                  sx={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <ListItemText
                    primary={subCategory.subcategory_name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#4E2223',
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              ));
            })()}
          </List>
        </>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.Colors.whitePrimary,
          borderRadius: '1px solid #DFDFDF',
          borderBottom: '1px solid #DFDFDF',
        }}
      >
        <Toolbar
          ref={toolbarRef}
          sx={{
            minHeight: '53px !important',
          }}
        >
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              scrollbarWidth: 'none',
              width: '100%',
            }}
          >
            {/* Mobile Layout - Always show search box */}
            {isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ color: theme.Colors.primary }}
                >
                  <MenuIcon />
                </IconButton>
                <TextField
                  placeholder="Search product"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.Colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.Colors.primary,
                      },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{ color: '#999', fontSize: '20px' }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleSearchClear}
                            size="small"
                            sx={{ color: '#999' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                />
              </Box>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 3.5,
                  alignItems: 'center',
                  pl: 0.2,
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {/* All Jewellery */}
                <Box
                  onMouseEnter={(e) =>
                    onMuseHover(e, NAVIGATION_MENU.ALL_JEWELLERY)
                  }
                  onMouseLeave={() => onMouseLeave()}
                  onClick={() => handleMenuClick(NAVIGATION_MENU.ALL_JEWELLERY)}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '15px 0px',
                    background: 'transparent',
                    // width: '140px',
                    color:
                      isActive(NAVIGATION_MENU.ALL_JEWELLERY) ||
                      hoveredTab === NAVIGATION_MENU.ALL_JEWELLERY
                        ? theme.Colors.primary
                        : theme.Colors.black,
                    '&:hover': {
                      color: theme.Colors.primary,
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      backgroundColor: '#4E2223',
                      opacity:
                        isActive(NAVIGATION_MENU.ALL_JEWELLERY) ||
                        hoveredTab === NAVIGATION_MENU.ALL_JEWELLERY
                          ? 1
                          : 0,
                      transition: 'opacity 0.5s ease-in-out',
                    },
                  }}
                >
                  <Typography sx={{ whiteSpace: 'nowrap' }}>
                    {NAVIGATION_MENU.ALL_JEWELLERY}
                  </Typography>
                </Box>
                {/* Categories from API */}
                {categoriesWithSubcategories.map((category) => (
                  <Box
                    key={category.id}
                    onMouseEnter={(e) => onMuseHover(e, category.category_name)}
                    onMouseLeave={() => onMouseLeave()}
                    onClick={() =>
                      handleMenuClick(category.category_name, category.id)
                    }
                    sx={{
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '15px 0px',
                      background: 'transparent',
                      color:
                        isActive(category.category_name) ||
                        hoveredTab === category.category_name
                          ? theme.Colors.primary
                          : theme.Colors.black,
                      '&:hover': {
                        color: theme.Colors.primary,
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                        backgroundColor: '#4E2223',
                        opacity:
                          isActive(category.category_name) ||
                          hoveredTab === category.category_name
                            ? 1
                            : 0,
                        transition: 'opacity 0.5s ease-in-out',
                      },
                    }}
                  >
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      {category.category_name}
                    </Typography>
                  </Box>
                ))}
                {/* Gender */}
                {/* <Box
                  onMouseEnter={(e) => onMuseHover(e, 'Gender')}
                  onMouseLeave={() => onMouseLeave()}
                  onClick={() => handleMenuClick('Gender')}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '15px 0px',
                    background: 'transparent',
                    color:
                      isActive('Gender') || hoveredTab === 'Gender'
                        ? theme.Colors.primary
                        : theme.Colors.black,
                    '&:hover': {
                      color: theme.Colors.primary,
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      backgroundColor: '#4E2223',
                      opacity:
                        isActive('Gender') || hoveredTab === 'Gender' ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out',
                    },
                  }}
                >
                  <Typography>Gender</Typography>
                </Box> */}
                {/* Savings Scheme */}
                {/* <Box
                  onMouseEnter={(e) => onMuseHover(e, 'Savings Scheme')}
                  onMouseLeave={() => onMouseLeave()}
                  onClick={() => handleMenuClick('Savings Scheme')}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '15px 0px',
                    background: 'transparent',
                    color:
                      isActive('Savings Scheme') || hoveredTab === 'Savings Scheme'
                        ? theme.Colors.primary
                        : theme.Colors.black,
                    '&:hover': {
                      color: theme.Colors.primary,
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      backgroundColor: '#4E2223',
                      opacity:
                        isActive('Savings Scheme') || hoveredTab === 'Savings Scheme' ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out',
                    },
                  }}
                >
                  <Typography>Savings Scheme</Typography>
                </Box> */}
              </Box>
            )}

            {/* Desktop Hover Popover */}
            {!isMobile && (
              <Grow in={!!paperHover && !!tabPosition} timeout={300}>
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '90%',
                    left: tabPosition?.left,
                    minWidth: Math.max(tabPosition?.width || 200, 200),
                    zIndex: 1000,
                    background: 'transparent',
                    pt: 1,
                    pr: 1,
                    maxHeight: '450px',
                    display: 'flex',
                  }}
                  elevation={0}
                  onMouseEnter={() => setPaperHover(hoveredTab)}
                  onMouseLeave={onMouseLeave}
                >
                  {paperHover && renderPopoverContent(paperHover)}
                </Paper>
              </Grow>
            )}
            {!isMobile ? (
              <Box sx={{ width: '18%' }}>
                <ButtonComponent
                  startIcon={<SavingsSchemeIcon />}
                  buttonText="Savings Scheme"
                  buttonFontSize={12}
                  btnWidth={"max-content"}
                  bgColor={`linear-gradient(90deg, ${theme.Colors.primary} 0%, ${theme.Colors.primaryDarkEnd} 100%)`}
                  buttonTextColor={theme.Colors.whitePrimary}
                  buttonFontWeight={500}
                  btnBorderRadius={1.7}
                  btnHeight={35}
                  onClick={() => navigate('/home/schemePages')}
                />
              </Box>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && <MobileDrawer />}
    </>
  );
};

export default NavigationBar;
