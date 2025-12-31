import { useState, useEffect } from 'react';
import ProductCard from '@components/ProductCard';
import Grid from '@mui/material/Grid2';
import DecorativeHeader from './DecorativeHeader';
import { ButtonComponent } from '@components/index';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import MUHLoader from '@components/MUHLoader';

type Props = {
  data: any[];
  title: string;
  onDataRefresh?: () => void;
  isLoading?: boolean;
};

const ProductWrapper = ({ data, title, onDataRefresh, isLoading }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState(data);

  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? products : products?.slice(0, 4);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  const handleProductClick = (productId: string) => {
    const cleanProductName = visibleCategories[0]?.product_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/-+/g, '')
      .replace(/^-|-$/g, '');

    navigate(
      `/home/${cleanProductName}/productdetails?id=${Number(productId)}`
    );
  };

  const handleWishlistClick = async (item: any) => {
    try {
      const currentWishlistStatus = item?.is_wishlisted;

      let response: any;

      if (currentWishlistStatus) {
        response = await OnlineOrdersService.updateWishlistItem(
          item.product_id || item.id || 1,
          0,
          false,
          item.product_item_id
        );
      } else {
        response = await OnlineOrdersService.createWishlistOrAddCart({
          user_id: 0,
          product_id: item.product_id || item.id,
          product_item_id: item.product_item_id || item.id || 1,
          order_item_type: 1,
          is_wishlisted: true,
          quantity: item.quantity || 1,
          product_name: item.name || item.product_name || '',
          sku_id: item.sku_id || '',
          thumbnail_image: item.thumbnail_image || item.image_urls?.[0] || '',
          estimated_price: item.price || item.selling_price || '0',
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

      if (item && apiWishlistStatus !== null) {
        const updatedItem = {
          ...item,
          is_wishlisted: apiWishlistStatus,
          ...(itemData && {
            quantity: itemData.quantity,
            estimated_price: itemData.estimated_price,
          }),
        };

        setProducts((prevProducts) =>
          prevProducts.map((dataItem) =>
            dataItem.id === item.id ? updatedItem : dataItem
          )
        );

        if (onDataRefresh) {
          onDataRefresh();
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return isLoading ? (
    <MUHLoader />
  ) : (
    <Grid
      container
      sx={{ m: { xs: 1.5, md: 5.5 }, justifyContent: 'center', gap: 3 }}
    >
      <DecorativeHeader title={title} />
      <Grid container width={'100%'} spacing={{ xs: 1, md: 3 }}>
        {visibleCategories.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}>
            <ProductCard
              id={item.id}
              image={item.thumbnail_image || item.image_urls[0]}
              name={item.name || item?.product_name}
              price={item.estimated_price || item.selling_price}
              imageHeight={300}
              is_wishlisted={item.is_wishlisted}
              onClick={() => handleProductClick(item.id)}
              onWishlistClick={() => handleWishlistClick(item)}
              userId={0}
              productId={item.product_id || item.id}
              productItemId={item.product_item_id}
              skuId={item.sku_id || ''}
            />
          </Grid>
        ))}
      </Grid>
      <ButtonComponent
        buttonText={showAll ? 'View Less' : 'View More'}
        buttonFontSize={16}
        bgColor={theme.Colors.primary}
        buttonTextColor={theme.Colors.whitePrimary}
        buttonFontWeight={600}
        btnBorderRadius={1.7}
        btnHeight={43}
        btnWidth={150}
        onClick={() => setShowAll((prev) => !prev)}
      />
    </Grid>
  );
};

export default ProductWrapper;
