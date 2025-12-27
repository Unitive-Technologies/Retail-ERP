import { Box, Typography, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProductFilter from '../ProductDetails/ProductFilter';
import { useEffect, useState } from 'react';
import { API_SERVICES } from '@services/index';
import { HTTP_STATUSES } from '@constants/Constance';
import toast from 'react-hot-toast';
import { Loader } from '@components/index';

interface Subcategory {
  id: number;
  label: string;
  count: number;
}

const ProductCategories = () => {
  const theme = useTheme();
  const { categoryId, subcategoryId, option } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

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

      const response: any = await API_SERVICES.ProductService.getAll(params);
      
      if (response?.data?.statusCode === HTTP_STATUSES.OK) {
        const fetchedProducts = response?.data?.data?.products ?? [];
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

  useEffect(() => {
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
    <Box sx={{ paddingInline: 3, pt: 1.5 }}>
      <Box>
        <ProductFilter 
          category={category}
          products={products}
          subcategories={subcategories}
          selectedSubcategoryId={subcategoryId ? Number(subcategoryId) : null}
        />
      </Box>
    </Box>
  );
};

export default ProductCategories;
