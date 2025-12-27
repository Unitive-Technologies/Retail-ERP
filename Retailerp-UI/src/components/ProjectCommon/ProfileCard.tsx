import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type ProfileData = {
  name: string;
  code: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
};

type Props = {
  profileData: ProfileData;
  type: 'employee' | 'customer';
  mode?: 'list' | 'view';
  showAvatar?: boolean;
};

const ProfileCard = ({
  profileData,
  type,
  mode = 'list',
  showAvatar = false,
}: Props) => {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const renderEmployeeDetails = () => (
    <Box sx={{ color: 'white', textAlign: 'left', minWidth: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography
          style={{
            fontWeight: 600,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          Department
        </Typography>
        <Typography
          style={{
            fontWeight: 500,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          : {profileData.department || 'N/A'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography
          style={{
            fontWeight: 600,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          Designation
        </Typography>
        <Typography
          style={{
            fontWeight: 500,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          : {profileData.designation || 'N/A'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          style={{
            fontWeight: 600,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          Date of Joining
        </Typography>
        <Typography
          style={{
            fontWeight: 500,
            minWidth: 120,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          : {profileData.dateOfJoining || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  const renderCustomerDetails = () => (
    <Box sx={{ color: 'white', textAlign: 'right', minWidth: 250 }}>
      {profileData.phone && (
        <Typography
          style={{
            fontWeight: 500,
            marginBottom: '4px',
            fontFamily: theme.fontFamily.roboto,
            fontSize: '14px',
          }}
        >
          +91 {profileData.phone}
        </Typography>
      )}
      {profileData.address && (
        <Typography
          style={{
            fontWeight: 400,
            marginBottom: '2px',
            fontFamily: theme.fontFamily.roboto,
            fontSize: '12px',
            opacity: 0.9,
          }}
        >
          {profileData.address}
        </Typography>
      )}
      {profileData.city && profileData.pinCode && (
        <Typography
          style={{
            fontWeight: 400,
            fontFamily: theme.fontFamily.roboto,
            fontSize: '12px',
            opacity: 0.9,
          }}
        >
          {profileData.city} - {profileData.pinCode}
        </Typography>
      )}
    </Box>
  );

  return (
    <Card
      style={{
        marginBottom: '24px',
        marginTop: mode === 'view' ? '0px' : '24px',
        background: 'linear-gradient(135deg, #471923 0%, #7F3242 100%)',
        borderRadius: '8px',
      }}
    >
      <CardContent sx={{ py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: showAvatar ? 3 : 0,
          }}
        >
          {showAvatar && (
            <Avatar src={profileData.avatar} sx={{ width: 80, height: 80 }}>
              {getInitials(profileData.name)}
            </Avatar>
          )}

          <Box sx={{ color: 'white', flex: 1 }}>
            <Typography
              style={{
                fontWeight: 600,
                marginBottom: 0.5,
                color: 'white',
                fontFamily: theme.fontFamily.roboto,
                fontSize: '20px',
              }}
            >
              {profileData.name}
            </Typography>
            <Typography
              style={{
                fontWeight: 500,
                marginBottom: 0.5,
                color: 'white',
                fontFamily: theme.fontFamily.roboto,
                fontSize: '14px',
              }}
            >
              {profileData.code}
            </Typography>
          </Box>
          {type === 'employee' && renderEmployeeDetails()}
          {type === 'customer' && renderCustomerDetails()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
