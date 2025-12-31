import { useEffect, useState, useCallback } from 'react';
import { API_SERVICES } from '@services/index';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import { HTTP_STATUSES } from '@constants/Constance';
import Banner from './banner/Banner';
import Categories from './Categories';
import ChaneiraPromise from './ChaneiraPromise';
import FeaturesBar from './FeaturesBar';
import ProductWrapper from './ProductWrapper';
import JewelryView from './JewelryView';
import StayConnected from './StayConnected';

type Category = {
  id: number;
  category_name: string;
  category_image_url: string;
  material_type_id: number;
  material_type: string | null;
  material_image_url: string | null;
};

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [newestProducts, setNewestProducts] = useState<any[]>([]);
  const [isLoadingNewest, setIsLoadingNewest] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const response: any = await API_SERVICES.CategoryService.getAll({});

      if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
        const categoriesData =
          response.data?.data?.categories?.filter(Boolean) || [];
        setCategories(categoriesData);
      }
    } catch (error) {
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchWishlistItems = useCallback(async () => {
    setIsLoadingWishlist(true);
    try {
      const response: any = await OnlineOrdersService.getWishlistOrCart({
        user_id: 0,
        type: 1,
      });

      if (response?.data?.data?.items) {
        setWishlistItems(response.data.data.items);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []);

  const fetchNewestProducts = useCallback(async () => {
    setIsLoadingNewest(true);
    try {
      const response: any = await API_SERVICES.ProductService.getWebsiteDetails(
        {
          sort_by: 'newest',
        }
      );

      const products = response.data?.data || [];
      setNewestProducts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingNewest(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      const [categoriesPromise, wishlistPromise, newestPromise] = [
        fetchCategories(),
        fetchWishlistItems(),
        fetchNewestProducts(),
      ];

      try {
        await Promise.all([categoriesPromise, wishlistPromise, newestPromise]);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [fetchCategories, fetchWishlistItems, fetchNewestProducts]);

  const refreshWishlistItems = () => {
    fetchWishlistItems();
  };

  const refreshNewestProducts = () => {
    fetchNewestProducts();
  };

  return (
    <>
      <Banner />
      <Categories data={categories} isLoading={isLoadingCategories} />
      <FeaturesBar />
      <ProductWrapper
        data={wishlistItems}
        title="Customer Favourites"
        onDataRefresh={refreshWishlistItems}
        isLoading={isLoadingWishlist}
      />
      <ProductWrapper
        data={newestProducts}
        title="Our Latest Launch"
        onDataRefresh={refreshNewestProducts}
        isLoading={isLoadingNewest}
      />
      <ChaneiraPromise />
      <JewelryView />
      <StayConnected />
    </>
  );
};

export default Home;
