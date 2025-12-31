export interface WishlistOrCartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_item_id: number;
  order_item_type: number;
  quantity: number;
  net_weight: string | null;
  product_name: string;
  sku_id: string;
  thumbnail_image: string;
  estimated_price: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WishlistOrCartResponse {
  statusCode: number;
  message: string;
  data: {
    items: WishlistOrCartItem[];
  };
}

export interface CreateWishlistItemRequest {
  user_id?: number;
  product_id: number;
  product_item_id: number;
  order_item_type: number;
  quantity: number;
  product_name: string;
  sku_id: string;
  is_wishlisted?: boolean;
  is_in_cart?: boolean;
  thumbnail_image: string;
  estimated_price: string;
  successMessage?: string;
  failureMessage?: string;
}

export interface CreateWishlistItemResponse {
  statusCode: number;
  message: string;
  data: WishlistOrCartItem;
}

export interface DeleteWishlistItemResponse {
  statusCode: number;
  message: string;
}
