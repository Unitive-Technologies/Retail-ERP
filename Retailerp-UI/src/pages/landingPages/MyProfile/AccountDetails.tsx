import { AddressIcon, EditIcon } from '@assets/Images';
import { defaultAddresses } from '@constants/DummyData';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

import BasicDetailEdit from './BasicDetailEdit';
import AddAddress from './AddAddress';

import { Button } from '@mui/material';

const AccountDetails = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleAddressEdit = () => setIsEditingAddress(true);
  const handleCancelAddress = () => setIsEditingAddress(false);

  return (
    <>
      {/* Main Content */}
      <Grid size={{ xs: 12, sm: 9, md: 12 }}>
        <>
          {isEditing ? (
            <BasicDetailEdit onCancel={handleCancel} />
          ) : isEditingAddress ? (
            <AddAddress onCancel={handleCancelAddress} />
          ) : (
            <>
              {/* Basic Details */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    color: theme.Colors.black,
                    borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
                  }}
                >
                  Basic Details
                </Typography>
                <Button
                  onClick={handleEditClick}
                  size="small"
                  sx={{
                    borderRadius: '30px',
                    border: `1px solid ${theme.Colors.primary}`,
                    fontSize: '14px',
                    fontWeight: 400,
                    gap: 1,
                    pl: 1,
                    pr: 1,
                    color: theme.Colors.primary,
                    textTransform: 'none',
                  }}
                >
                  <EditIcon /> Edit
                </Button>
              </Box>

              <Box mt={3}>
                {/* Name */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                      mt: { xs: 0, sm: 0 },
                    }}
                  >
                    Charan
                  </Typography>
                </Box>

                {/* Mobile */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Mobile Number
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                    }}
                  >
                    +91 9944089896
                  </Typography>
                </Box>

                {/* Email */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      width: { xs: '100%', sm: '150px' },
                      fontFamily: 'Roboto Slab',
                      mb: { xs: 0.5, sm: 0 },
                    }}
                  >
                    Email ID
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#303030',
                      fontFamily: 'Roboto Slab',
                      textAlign: { xs: 'left', sm: 'center' },
                      width: { xs: 'auto', sm: '100px' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '16px', sm: '18px' },
                      color: '#000',
                      fontFamily: 'Roboto Slab',
                      wordBreak: 'break-word',
                    }}
                  >
                    charan142@gmail.com
                  </Typography>
                </Box>
              </Box>

              {/* <Box my={4} sx={{ borderBottom: '1px solid #632532' }} /> */}
              <Box display="flex" alignItems="center" my={4}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: theme.Colors.primaryDarkStart,
                  }}
                />
              </Box>

              {/* Address */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    color: theme.Colors.black,
                    borderBottom: `2px solid ${theme.Colors.primaryDarkStart}`,
                    fontFamily: 'Roboto Slab',
                  }}
                >
                  Address
                </Typography>
                <Button
                  size="small"
                  onClick={handleAddressEdit}
                  sx={{
                    borderRadius: '30px',
                    border: `1px solid ${theme.Colors.primary}`,
                    fontSize: '14px',
                    fontWeight: 400,
                    gap: 1,
                    pl: 1,
                    pr: 1,
                    color: theme.Colors.primary,
                    fontFamily: 'Roboto Slab',
                    textTransform: 'none',
                  }}
                >
                  <AddressIcon />
                  Add New
                </Button>
              </Box>

              <Box mt={3}>
                {defaultAddresses.map((addr, idx) => (
                  <Box key={idx}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                          fontSize: '18px',
                          color: theme.Colors.primary,
                          fontFamily: 'Roboto Slab',
                        }}
                      >
                        Default Address
                      </Typography>
                      <Box
                        onClick={handleAddressEdit}
                        sx={{
                          backgroundColor: '#FFEBEC',
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <EditIcon />
                      </Box>
                    </Box>
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: '16px',
                        color: theme.Colors.black,
                        fontFamily: 'Roboto Slab',
                      }}
                      mt={1}
                      lineHeight={1.6}
                    >
                      {addr.name} <br />
                      {addr.mobile} <br />
                      {addr.addressLine1} <br />
                      {addr.addressLine2} <br />
                      {addr.state} {addr.pin}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </>
      </Grid>
    </>
  );
};

export default AccountDetails;
