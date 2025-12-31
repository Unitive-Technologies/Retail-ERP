import { memo, useEffect, useMemo, useState } from 'react';
import { IconButton, styled, Typography, TextField } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AddressList from './addressList';
import OrderSummary from './orderSummary';
import ProductDetailsCard from './productDetailsCard';
import { ButtonComponent, Loader } from '@components/index';
import { ProductService } from '@services/ProductService';
import { ProductList } from 'response';
import { DropDownServiceAll } from '@services/DropDownServiceAll';
import { OrderService } from '@services/OrderService';

// Custom styled button for secondary actions
const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.Colors.whitePrimary,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const PageToolBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: '10px 40px',
  alignItems: 'center',
  borderBottom: '1px solid #DFDFDF',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.Colors.primaryLight,
  borderRadius: '8px',
  height: '30px',
  width: '30px',
}));

const BackIcon = styled(ArrowBack)(({ theme }) => ({
  color: theme.Colors.black,
  height: '20px',
  width: '20px',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto Slab',
  fontWeight: 500,
  color: theme.Colors.black,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  height: '100%',
}));

const LeftSideContainer = styled(Box)(({ theme }) => ({
  flex: 2,
  padding: theme.spacing(0, 2),
}));
const RightSideContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0, 2),
}));

const VerticalDivider = styled(Box)(() => ({
  width: '2px',
  backgroundColor: '#DFDFDF',
  alignSelf: 'stretch',
  height: '70vh',
  marginTop: '16px',
}));

const DiscountContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 2, 2, 0),
}));
const DiscountBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: '0px 16px 0px 0px',
}));

const Checkout = memo(({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Get productId from URL search parameters
  const productId = searchParams.get('id');
  const selectedItem = location.state?.selectedItem;

  const [quantity, setQuantity] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState('');
  const [product, setProduct] = useState<ProductList | undefined>(undefined);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const subtotal = useMemo(() => {
    if (!selectedItem) return 0;
    
    // Calculate subtotal for selected item
    const price = selectedItem?.price_details?.selling_price || 0;
    return price * quantity;
  }, [selectedItem, quantity]);

  const total = subtotal - discount;

  useEffect(() => {    
    const fetchProductAndAddresses = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse: any = await ProductService.getProductById(
          Number(productId)
        );

        if (!productResponse) {
          console.error('No response received from API');
          return;
        } else if (productResponse.data.data) {
          setProduct(productResponse.data.data.product);
        } else {
          console.error('No product found in response.data');
        }

        const addressResponse: any = await OrderService.getCustomerAddress();
        console.log('Address response:', addressResponse);

        if (addressResponse?.data?.data.addresses) {
          const addressesWithNames = await Promise.all(
            addressResponse.data.data.addresses.map(async (address: any) => {
              try {
                // Fetch state name
                const stateResponse: any = await DropDownServiceAll.getAllStates();
                const stateData = stateResponse?.data?.data?.states;
                const matchedState = stateData?.find((state: any) => state.id === address.state_id);
                const stateName = matchedState?.state_name || `State ${address.state_id}`;

                // Fetch district name
                const districtResponse: any = await DropDownServiceAll.getAllDistricts();
                const districtData = districtResponse?.data?.data?.districts;
                let districtName = address.district_id; // Declare outside if block
                
                if (districtData && districtData.length > 0) { 
                  // Try both string and number comparison
                  const matchedDistrict = districtData?.find((district: any) => 
                    district.id === address.district_id || 
                    district.id === Number(address.district_id) ||
                    String(district.id) === String(address.district_id)
                  );
                  districtName = matchedDistrict?.district_name || address.district_id;
                } else {
                  console.log('No district data found');
                  console.log('Using fallback district name:', districtName);
                }

                return {
                  ...address,
                  state_name: stateName,
                  district_name: districtName,
                };
              } catch (error) {
                console.error('Error fetching state/district:', error);
                return address;
              }
            })
          );
          setAddresses(addressesWithNames);
        } else {
          console.log('No addresses found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndAddresses();
  }, [productId]);

  // Set selectedAddressId based on default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((address: any) => address.is_default === true);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [addresses]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBillingSameAsShippingChange = (checked: boolean) => {
    setBillingSameAsShipping(checked);
  };

  const handleSaveNewBillingAddress = async (newAddress: any) => {
    try {

      const customerAddress = [{
          customer_id: 1, // TODO: Get from auth context
          name: newAddress.name,
          mobile_number: newAddress.phone || newAddress.mobile_number,
          address_line: newAddress.address || 'fadfad',
          country_id: newAddress.countryId || 1,
          state_id: newAddress.stateId || 2,
          district_id: newAddress.cityId || 2,
          pin_code: newAddress.pin_code || '637301',
          is_default: newAddress.is_default || true,
        }]
      // Call the createCustomerAddress API
      const response: any = await OrderService.createCustomerAddress({
        addresses: customerAddress
      });

      if (response?.data?.data.data.addresses) {        
        // Add the new address to the addresses state (both delivery and billing)
        const createdAddress = Array.isArray(response.data.data.addresses) 
          ? response.data.data.data.addresses[0] 
          : response.data.data.data.addresses[0];
        
        // Validate the created address has required fields
        if (createdAddress && createdAddress.id) {
          setAddresses((prev) => [...prev, createdAddress]);
          setSelectedAddressId(createdAddress.id);
          setBillingSameAsShipping(true);
          console.log('Address successfully added to state');
        } else {
          console.error('Created address is missing required fields:', createdAddress);
        }
      } else {
  
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      // Format order items from selected item
      const orderItems = [{
        product_id: selectedItem?.product_id || product?.id,
        product_item_id: selectedItem?.id,
        quantity: quantity,
        image_url: selectedItem?.image_urls?.[0] || product?.image_urls?.[0] || '',
        product_name: product?.product_name || '',
        sku_id: selectedItem?.sku_id || product?.sku_id,
        purity: selectedItem.purity || '99.900',
        gross_weight: selectedItem.gross_weight || 0,
        net_weight: selectedItem.net_weight || 0,
        stone_weight: selectedItem.stone_weight || 0,
        rate: selectedItem.price_details?.selling_price || 0,
        making_charge: selectedItem.making_charge || 0,
        wastage: selectedItem.wastage || 0,
        measurement_details: selectedItem.measurement_details || [],
        selling_price: selectedItem?.price_details?.selling_price || 0,
      }];

      // Create order payload
      const orderPayload = {
        customer_id: 1, // TODO: Get from auth context
        discount_amount: discount,
        order_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        items: orderItems,
      };

      // Call createOrder API
      const response: any = await OrderService.createOrder(orderPayload);
      console.log('Create order response:', response);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    }
  };

  return (
    <MainContainer>
      <PageToolBar>
        <BackButton onClick={handleGoBack}>
          <BackIcon />
        </BackButton>
        <TitleTypography variant="contactLabel">
          Address & Checkout
        </TitleTypography>
      </PageToolBar>
      <ContentContainer>
        <LeftSideContainer>
          {loading ? (
            <Loader />
          ) : (
            <ProductDetailsCard
              product={product}
              quantity={quantity}
              productItems={selectedItem}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          )}

          <AddressList
            title="Delivery Address"
            addresses={addresses}
            isAddNewAddress={true}
            selectedId={selectedAddressId}
            onSelect={setSelectedAddressId}
          />

          <AddressList
            title="Billing Address"
            addresses={addresses}
            isRadio={false}
            selectedId={selectedAddressId}
            onSelect={setSelectedAddressId}
            isSameAsShipping={billingSameAsShipping}
            onSameAsShippingChange={handleBillingSameAsShippingChange}
            onSaveNewAddress={handleSaveNewBillingAddress}
          />
        </LeftSideContainer>
        <VerticalDivider />
        <RightSideContainer>
          <DiscountContainer>
            <Typography sx={{ fontFamily: 'Roboto slab' }} variant="h6">
              Discount
            </Typography>
            <DiscountBox>
              <TextField
                placeholder="Enter Coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#CCCCCC',
                    },
                    '&:hover fieldset': {
                      borderColor: '#CCCCCC',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7a1c2d',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto Slab',
                    padding: '8px 12px',
                  },
                }}
              />
              <ButtonComponent
                buttonText="Apply"
                sx={{
                  color: '#6D2E3D',
                  background: '#F3D8D9',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Roboto Slab',
                  padding: '6px 24px',
                  minWidth: 'fit-content',
                  border: 'none',
                }}
                onClick={() => setDiscount(500)}
              ></ButtonComponent>
            </DiscountBox>
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shippingFee={0}
              deliveryFee={0}
              total={total}
            />

            <ButtonComponent
              sx={{
                background: 'linear-gradient(to right, #471923, #7F3242)',
                color: '#FFFFFF',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                fontFamily: 'Roboto Slab',
                padding: '4px 24px',
                minWidth: '-webkit-fill-available',
                border: 'none',
              }}
              buttonText="Proceed to Payment"
              onClick={handleProceedToPayment}
            ></ButtonComponent>
          </DiscountContainer>
        </RightSideContainer>
      </ContentContainer>
    </MainContainer>
  );
});

export default Checkout;
