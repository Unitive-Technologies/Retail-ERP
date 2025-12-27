import { Avatar, Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

type EmployeeCardProps = {
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  imageUrl?: string; 
};

const EmployeeCardComponent = ({
  name,
  employeeId,
  department,
  designation,
  dateOfJoining,
  imageUrl = 'https://randomuser.me/api/portraits/women/47.jpg', 
}: EmployeeCardProps) => {
  return (
    <Card
      style={{
        marginBottom: '24px',
        marginTop: '8px',
        background: 'linear-gradient(135deg, #471923 0%, #7F3242 100%)',
        borderRadius: '8px',
      }}
    >
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar src={imageUrl} sx={{ width: 80, height: 80 }}>
            {name?.[0] || 'U'}
          </Avatar>

          <Box sx={{ color: 'white', flex: 1 }}>
            <Typography
              style={{
                fontWeight: 600,
                marginBottom: 0.5,
                color: 'white',
                fontFamily: 'Roboto-Regular',
                fontSize: '20px',
              }}
            >
              {name}
            </Typography>
            <Typography
              style={{
                fontWeight: 500,
                marginBottom: 0.5,
                color: 'white',
                fontFamily: 'Roboto-Regular',
                fontSize: '14px',
              }}
            >
              {employeeId}
            </Typography>
          </Box>

          <Box sx={{ color: 'white', textAlign: 'left', minWidth: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography
                style={{
                  fontWeight: 600,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                Department
              </Typography>
              <Typography
                style={{
                  fontWeight: 500,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                : {department}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography
                style={{
                  fontWeight: 600,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                Designation
              </Typography>
              <Typography
                style={{
                  fontWeight: 500,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                : {designation}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                style={{
                  fontWeight: 600,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                Date of Joining
              </Typography>
              <Typography
                style={{
                  fontWeight: 500,
                  minWidth: 120,
                  fontFamily: 'Roboto-Regular',
                  fontSize: '14px',
                }}
              >
                : {dateOfJoining}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeCardComponent;
