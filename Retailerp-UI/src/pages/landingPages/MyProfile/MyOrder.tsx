import {
  Box,
  Typography,
  InputAdornment,
  Collapse,
  Divider,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useState, useEffect } from 'react';
import { TextInput, Loader } from '@components/index';
import Grid from '@mui/material/Grid2';
import { OrderIcon } from '@assets/Images';
import { FILTER_OPTIONS } from '@constants/Constance';
import MUHSelectBoxComponent from '@components/MUHSelectBoxComponent';
import { API_SERVICES } from '@services';

const MyOrder = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState('Online');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response: any = await API_SERVICES.OrderService.getOrder({
          customer_id: 1, // TODO: Get from auth context
        });

        if (response?.data?.data.orders) {
          setOrders(response?.data?.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Grid size={{ xs: 3, sm: 5, md: 5 }}>
          <TextInput
            height={40}
            placeholderText="Search product"
            placeholderColor={'#2D2D2D'}
            fontFamily="Roboto Slab"
            fontWeight={500}
            fontSize={14}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#2D2D2D' }} />
                  </InputAdornment>
                ),
              },
            }}
            type="search"
          />
        </Grid>

        <Grid>
          <MUHSelectBoxComponent
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            selectItems={FILTER_OPTIONS}
            selectWidth={110}
            selectHeight={40}
            // placeholderText="Select Status"
            isCheckbox={false}
            isSearch={false}
            menuItemTextColor={theme.Colors.black}
            selectBoxStyle={{
              fontFamily: 'Roboto Slab',
              fontSize: 14,
              fontWeight: 500,
              color: '#2D2D2D',
            }}
          />
        </Grid>
      </Box>
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <Typography>No orders found</Typography>
        </Box>
      ) : (
        orders.map((order, idx) => (
          <Box
            key={idx}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {/* Order Header */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Box display="flex" alignItems="center">
                  <OrderIcon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontFamily: 'Roboto Slab',
                      flex: 1,
                      color: theme.Colors.black,
                    }}
                  >
                    Order No :
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontFamily: 'Roboto Slab',
                      color: '#474747',
                    }}
                  >
                    {order.order_number}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      flex: 1,
                      color: theme.Colors.black,
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    Order Qty :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#474747',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    {order.items.length}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      flex: 1,
                      color: theme.Colors.black,
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    Order Date :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#474747',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    {formatDate(order.updated_at)}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      flex: 1,
                      color: theme.Colors.black,
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    Status:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#474747',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    {' '}
                    {order.order_status}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              onClick={handleToggle}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '14px',
                fontWeight: 400,
                color: theme.Colors.black,
                fontFamily: 'Roboto Slab',
              }}
            >
              {expanded ? 'View Order' : 'Hide Order'}
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Divider />

            <Collapse in={expanded}>
              {order.items.map((item: any, idx: any) => (
                <Box
                  key={idx}
                  display="flex"
                  gap={2}
                  alignItems="center"
                  mt={2}
                >
                  <img
                    src={item.image_url || '/api/placeholder/80/80'}
                    alt={item.product_name}
                    width="80"
                    height="80"
                    style={{ borderRadius: '8px' }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: '18px',
                        fontFamily: 'Roboto Slab',
                        color: theme.Colors.black,
                      }}
                    >
                      {item.product_name}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#782F3E',
                        fontWeight: 500,
                        fontSize: '18px',
                        fontFamily: 'Roboto Slab',
                      }}
                    >
                      {item.total_amount}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontFamily: 'Roboto Slab',
                        color: '#303030',
                        fontWeight: 400,
                      }}
                    >
                      Delivered on :{' '}
                      <Box
                        component="span"
                        sx={{
                          fontFamily: 'Roboto Slab',
                          color: theme.Colors.black,
                        }}
                      >
                        {formatDate(item.updated_at)}
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Collapse>
          </Box>
        ))
      )}
    </>
  );
};

export default MyOrder;
