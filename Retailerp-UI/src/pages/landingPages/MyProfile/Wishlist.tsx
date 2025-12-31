import {
  Box,
  Typography,
  IconButton,
  CardMedia,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, useEffect } from 'react';
import MUHButtonComponent from '@components/MUHButtonComponent';
import { CrossIcon } from '@assets/Images';
import { OnlineOrdersService } from '@services/OnlineOrdersService';
import { WishlistOrCartItem } from 'response';

const Wishlist = () => {
  const theme = useTheme();
  const [wishlistItems, setWishlistItems] = useState<WishlistOrCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteItem = async (params: { itemId: number }) => {
    const itemToDelete = wishlistItems.find(
      (item) => item.product_item_id === params.itemId
    );
    if (!itemToDelete) {
      return;
    }
    const originalItems = [...wishlistItems];

    try {
      setWishlistItems((prevItems) => {
        const filteredItems = prevItems.filter(
          (item) => item.product_item_id !== params.itemId
        );
        return filteredItems;
      });

      const response: any = await OnlineOrdersService.updateWishlistItem(
        itemToDelete.product_id,
        0,
        false,
        params.itemId
      ).catch((error: any) => {
        console.error('API call threw an error:', error);
        throw error;
      });

      const hasError = response && response.error;

      if (!response || hasError) {
        setWishlistItems(originalItems);
        return;
      }

      if (response && response.data?.is_wishlisted === false) {
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  // Handle add to cart functionality
  const handleAddToCart = async (item: any) => {
    try {
      await OnlineOrdersService.createWishlistOrAddCart({
        user_id: 0, // TODO: Get from auth context
        product_id: item.product_id,
        product_item_id: item.product_item_id,
        order_item_type: 2, // 2 for cart
        is_in_cart: true,
        quantity: 1,
        is_wishlisted: item.is_wishlisted,
        product_name: item.product_name,
        sku_id: item.sku_id,
        thumbnail_image: item.thumbnail_image,
        estimated_price: item.estimated_price,
        successMessage: 'Item added to cart'
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response: any = await OnlineOrdersService.getWishlistOrCart({
          user_id: 0, // TODO: Get from auth context or props
          type: 1, // 1 for wishlist
        });

        if (response?.data?.data?.items) {
          setWishlistItems(response.data.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <Typography>Loading wishlist...</Typography>;
  }

  return (
    <Grid container spacing={2}>
      <Typography
        style={{
          fontWeight: 600,
          marginBottom: 2,
          borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
          width: 'fit-content',
          fontFamily: 'Roboto Slab',
          fontSize: '20px',
        }}
      >
        Wishlist
      </Typography>

      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}
      >
        {wishlistItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3.5 }} key={item.id}>
            <Box
              sx={{
                borderRadius: '12px',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() =>
                  handleDeleteItem({
                    itemId: item.product_item_id,
                  })
                }
                sx={{
                  width: '40px',
                  height: '40px',
                  position: 'absolute',
                  top: 7,
                  right: 10,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: theme.Colors.whitePure },
                }}
              >
                <CrossIcon />
              </IconButton>

              <CardMedia
                component="img"
                image={item.thumbnail_image}
                alt={item.product_name}
                sx={{
                  width: '100%',
                  objectFit: 'fill',
                  height: '300px',
                  borderRadius: '12px',
                }}
              />

              <Box sx={{ pt: 2 }}>
                <Typography
                  style={{
                    fontWeight: 400,
                    fontFamily: 'Roboto Slab',
                    fontSize: '20px',
                    marginBottom: 2,
                    color: theme.Colors.black,
                  }}
                  noWrap
                >
                  {item.product_name}
                </Typography>

                <Typography
                  style={{
                    fontWeight: 600,
                    fontFamily: 'Roboto Slab',
                    fontSize: '20px',
                    marginBottom: 10,
                    color: theme.Colors.primary,
                  }}
                >
                  ₹{item.estimated_price}
                </Typography>

                <MUHButtonComponent
                  buttonText="Add to Cart"
                  bgColor="#64232f"
                  buttonTextColor={theme.Colors.whitePrimary}
                  btnWidth="100%"
                  padding="8px 16px"
                  buttonStyle={{
                    fontFamily: 'Roboto Slab',
                    fontSize: '16px',
                    fontWeight: 500,
                    borderRadius: '8px',
                  }}
                  onClick={() => handleAddToCart(item)}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Wishlist;
