import { useEffect, useState } from 'react';
import { CategoryData } from '@constants/DummyData';
import { API_SERVICES } from '@services/index';
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

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response: any = await API_SERVICES.CategoryService.getAll({});

        if (response?.status < HTTP_STATUSES.BAD_REQUEST) {
          const categoriesData =
            response.data?.data?.categories?.filter(Boolean) || [];
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Banner />
      <Categories data={categories} isLoading={isLoadingCategories} />
      <FeaturesBar />
      <ProductWrapper data={CategoryData} title="Customer Favourites" />
      <ProductWrapper data={CategoryData} title="Our Latest Launch" />
      <ChaneiraPromise />
      <JewelryView />
      <StayConnected />
    </>
  );
};

export default Home;