import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProductFilter from '../ProductDetails/ProductFilter';
import { useEffect, useState } from 'react';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';
import { Loader } from '@components/index';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import { CategoryService } from '@services/CategoryService';

interface Subcategory {
  id: number;
  label: string;
  count: number;
}

const ProductCategories = () => {
  const { categoryId, subcategoryId, option } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');

  const fetchCategoryName = async () => {
    if (!categoryId) return;
    
    try {
      const response: any = await CategoryService.getById(Number(categoryId));
      
      if (response?.data?.statusCode === HTTP_STATUSES.OK && response?.data?.data) {
        const categoryData = response.data.data.category;
        setCategoryName(categoryData.category_name || '');
      }      
    } catch (error) {
      console.error('Failed to fetch category name:', error);
    }
  };

  const fetchProducts = async () => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params: any = {
        category_id: categoryId,
      };

      const response: any = await API_SERVICES.ProductService.getWebsiteDetails(params);
      
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const fetchedProducts = response?.data?.data ?? [];
        setProducts(fetchedProducts);

        const subcategoryMap = new Map<number, { id: number; name: string; count: number }>();

        console.log(fetchedProducts, 'fetchedProducts---------');

        fetchedProducts.forEach((product: any) => {
          if (product.subcategory_id && product.subcategory_name) {
            const subcatId = product.subcategory_id;
            if (subcategoryMap.has(subcatId)) {
              subcategoryMap.get(subcatId)!.count++;
            } else {
              subcategoryMap.set(subcatId, {
                id: subcatId,
                name: product.subcategory_name,
                count: 1,
              });
            }
          }
        });

        const subcategoryArray: Subcategory[] = Array.from(subcategoryMap.values()).map(
          (subcat) => ({
          id: subcat.id,
          label: subcat.name,
          count: subcat.count,
          })
        );

        setSubcategories(subcategoryArray);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      toast.error(err?.message || 'Failed to fetch products');
      setProducts([]);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistClick = async (productId: number, currentWishlistStatus: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      
      let response: any;

      if (currentWishlistStatus) {
        // Remove from wishlist - use updateWishlistItem
        response = await OnlineOrdersService.updateWishlistItem(
          productId,
          0,
          false,
          product?.product_item_id || 1
        );
      } else {
        // Add to wishlist - use createWishlistOrAddCart
        response = await OnlineOrdersService.createWishlistOrAddCart({
          user_id: 0, // TODO: Get from auth context
          product_id: productId,
          product_item_id: product?.product_item_id || 1,
          order_item_type: 1, // 1 for wishlist
          is_wishlisted: true,
          quantity: 1,
          product_name: product?.product_name || '',
          sku_id: product?.sku_id || '',
          thumbnail_image: product?.image_urls?.[0] || '',
          estimated_price: product?.selling_price?.toString() || '0',
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

      // Update the products array with new wishlist status
      if (apiWishlistStatus !== null) {
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { 
                  ...product, 
                  is_wishlisted: apiWishlistStatus,
                  ...(itemData && {
                    quantity: itemData.quantity,
                    estimated_price: itemData.estimated_price,
                  }),
                }
              : product
          )
        );
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  useEffect(() => {
    fetchCategoryName();
    fetchProducts();
  }, [categoryId]);

  // For backward compatibility with legacy routes
  const category = option ? `Earrings-${option}` : categoryId ? `Category-${categoryId}` : 'earrings';


  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{ paddingInline: 3, pt: 1.5, background: 'white' }}>
      <ProductFilter
        category={categoryName || category}
        products={products}
        subcategories={subcategories}
        selectedSubcategoryId={subcategoryId ? Number(subcategoryId) : null}
        onWishlistClick={handleWishlistClick}
      />
    </Box>
  );
};

export default ProductCategories;
