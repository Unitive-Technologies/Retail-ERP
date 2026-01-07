import { Box, Typography, IconButton, Chip, useTheme } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';

const notification = [
  { id: 1, title: 'New Quotation Received - QR58/24-25', expiry: '16/02/2025' },
  {
    id: 2,
    title: 'Your Quotation QUT 58/24-25 has been approved',
    expiry: '25/02/2025',
  },
  { id: 3, title: 'New Quotation Received - QR58/24-25', expiry: '16/02/2025' },
  { id: 4, title: 'New Quotation Received - QR58/24-25', expiry: '16/02/2025' },
];

const NotificationList = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const handleClick = () => navigateTo('/notifications');

  return (
    <Box
      sx={{
        width: '100%',
        p: 3,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: theme.fontFamily.inter,
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          Notification
        </Typography>

        <Chip
          label="View All"
          onClick={handleClick}
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: theme.Colors.primary,
            backgroundColor: '#F4F7FE',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        />
      </Box>

      {/* List */}
      {notification.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            p: 2,
            mb: 1.5,
            bgcolor: '#FDFDFD',
            borderRadius: 2,
            border: '1px solid #EEE',
          }}
        >
          <IconButton size="small">
            <NotificationsNoneIcon sx={{ color: '#D36A6A' }} />
          </IconButton>

          <Box>
            <Typography
              sx={{
                fontFamily: theme.fontFamily.inter,
                fontSize: 14,
                fontWeight: 500,
                color: '#222',
                mb: 0.5,
              }}
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: theme.fontFamily.inter,
                fontSize: 12,
                color: '#666',
              }}
            >
              Expiry : {item.expiry}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default NotificationList;
